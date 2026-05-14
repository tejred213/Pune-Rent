from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Property, IPRateLimit
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import logging

load_dotenv()

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database Configuration
# Use DATABASE_URL for production (Render), fallback to SQLite for local development
database_url = os.getenv('DATABASE_URL', 'sqlite:///properties.db')

# Fix PostgreSQL URI scheme - psycopg2-binary uses postgresql+psycopg2
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql+psycopg2://', 1)
elif database_url and database_url.startswith('postgresql://'):
    database_url = database_url.replace('postgresql://', 'postgresql+psycopg2://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Database
db.init_app(app)

# Enable CORS for frontend communication with specific domains
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://www.punerent.in",
            "https://punerent.in",
            "http://localhost:5173",  # Vite dev server
            "http://localhost:3000",  # Local development
            "http://localhost:5001"   # Local backend
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type"]
    }
})

# Create database tables
with app.app_context():
    db.create_all()

# ============ IP RATE LIMITING ============

RATE_LIMIT_MAX = 3          # max pins per window
RATE_LIMIT_WINDOW_HOURS = 12

def get_client_ip():
    forwarded_for = request.headers.get('X-Forwarded-For', '')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    return request.remote_addr

def is_rate_limited(ip: str) -> bool:
    """Return True if this IP has exceeded the submission limit. Side-effect: updates the DB record."""
    now = datetime.utcnow()
    record = IPRateLimit.query.filter_by(ip_address=ip).first()

    if record is None:
        db.session.add(IPRateLimit(ip_address=ip, submission_count=1, window_start=now))
        db.session.commit()
        return False

    # Still inside an active block
    if record.blocked_until and now < record.blocked_until:
        return True

    window_age = now - record.window_start
    if window_age > timedelta(hours=RATE_LIMIT_WINDOW_HOURS):
        # Window expired — reset
        record.submission_count = 1
        record.window_start = now
        record.blocked_until = None
        db.session.commit()
        return False

    record.submission_count += 1
    if record.submission_count > RATE_LIMIT_MAX:
        record.blocked_until = now + timedelta(hours=RATE_LIMIT_WINDOW_HOURS)
        db.session.commit()
        return True

    db.session.commit()
    return False


def cleanup_rate_limits():
    """Remove expired IPRateLimit records older than the window (runs every hour)."""
    try:
        with app.app_context():
            cutoff = datetime.utcnow() - timedelta(hours=RATE_LIMIT_WINDOW_HOURS)
            expired = IPRateLimit.query.filter(
                IPRateLimit.window_start < cutoff,
                (IPRateLimit.blocked_until == None) | (IPRateLimit.blocked_until < datetime.utcnow())
            ).all()
            for record in expired:
                db.session.delete(record)
            db.session.commit()
    except Exception as e:
        logger.error(f'✗ Rate limit cleanup failed: {str(e)}')


scheduler = BackgroundScheduler(daemon=True)
scheduler.add_job(
    func=cleanup_rate_limits,
    trigger='interval',
    hours=1,
    id='cleanup_rate_limits',
    name='Cleanup Expired Rate Limits',
    replace_existing=True
)

if not scheduler.running:
    scheduler.start()

# ============ API ROUTES ============

# GET all properties
@app.route('/api/properties', methods=['GET'])
def get_properties():
    """Get all properties with optional filtering"""
    area = request.args.get('area', '')
    config = request.args.get('config', '')
    
    query = Property.query
    
    if area:
        query = query.filter(Property.area.ilike(f'%{area}%'))
    if config and config != 'All':
        query = query.filter(Property.config.ilike(f'%{config}%'))
    
    properties = query.all()
    return jsonify([prop.to_dict() for prop in properties]), 200

# GET single property by ID
@app.route('/api/properties/<int:id>', methods=['GET'])
def get_property(id):
    """Get a single property by ID"""
    property = Property.query.get_or_404(id)
    return jsonify(property.to_dict()), 200

# POST - Create new property
@app.route('/api/properties', methods=['POST'])
def create_property():
    """Create a new property listing"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['lat', 'lng', 'price', 'config', 'area']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        client_ip = get_client_ip()
        if is_rate_limited(client_ip):
            # Silent drop — return a plausible success response without persisting
            fake_id = abs(hash(client_ip + str(datetime.utcnow().minute))) % 1_000_000
            return jsonify({
                'message': 'Property created successfully',
                'property': {
                    'id': fake_id,
                    'lat': float(data['lat']),
                    'lng': float(data['lng']),
                    'price': data['price'],
                    'config': data['config'],
                    'area': data['area'],
                    'society_name': data.get('society_name', ''),
                    'flag': data.get('flag', None),
                    'description': data.get('description', ''),
                    'owner_name': data.get('owner_name', ''),
                    'owner_phone': data.get('owner_phone', ''),
                    'created_at': datetime.utcnow().isoformat(),
                    'updated_at': datetime.utcnow().isoformat(),
                }
            }), 201

        new_property = Property(
            lat=float(data['lat']),
            lng=float(data['lng']),
            price=data['price'],
            config=data['config'],
            area=data['area'],
            society_name=data.get('society_name', ''),
            flag=data.get('flag', None),
            description=data.get('description', ''),
            owner_name=data.get('owner_name', ''),
            owner_phone=data.get('owner_phone', '')
        )
        
        db.session.add(new_property)
        db.session.commit()
        
        return jsonify({
            'message': 'Property created successfully',
            'property': new_property.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# PUT - Update property
@app.route('/api/properties/<int:id>', methods=['PUT'])
def update_property(id):
    """Update an existing property"""
    try:
        property = Property.query.get_or_404(id)
        data = request.get_json()
        
        # Update fields if provided
        if 'lat' in data:
            property.lat = float(data['lat'])
        if 'lng' in data:
            property.lng = float(data['lng'])
        if 'price' in data:
            property.price = data['price']
        if 'config' in data:
            property.config = data['config']
        if 'area' in data:
            property.area = data['area']
        if 'society_name' in data:
            property.society_name = data['society_name']
        if 'flag' in data:
            property.flag = data['flag']
        if 'description' in data:
            property.description = data['description']
        if 'owner_name' in data:
            property.owner_name = data['owner_name']
        if 'owner_phone' in data:
            property.owner_phone = data['owner_phone']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Property updated successfully',
            'property': property.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# DELETE property
@app.route('/api/properties/<int:id>', methods=['DELETE'])
def delete_property(id):
    """Delete a property"""
    try:
        property = Property.query.get_or_404(id)
        db.session.delete(property)
        db.session.commit()
        
        return jsonify({'message': 'Property deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# GET statistics
@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get statistics about properties"""
    total_properties = Property.query.count()
    unique_areas = db.session.query(Property.area).distinct().count()
    
    return jsonify({
        'total_properties': total_properties,
        'unique_areas': unique_areas
    }), 200

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Backend is running!'}), 200

# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True, port=5001)
    finally:
        # Shutdown scheduler gracefully
        if scheduler.running:
            scheduler.shutdown()

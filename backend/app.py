from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Property
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Database Configuration
# Use DATABASE_URL for production (Render), fallback to SQLite for local development
database_url = os.getenv('DATABASE_URL', 'sqlite:///properties.db')

# Fix PostgreSQL URI scheme
if database_url and database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql+psycopg://', 1)
elif database_url and database_url.startswith('postgresql://'):
    # Use psycopg (v3) driver instead of psycopg2
    database_url = database_url.replace('postgresql://', 'postgresql+psycopg://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize Database
db.init_app(app)

# Enable CORS for frontend communication
CORS(app)

# Create database tables
with app.app_context():
    db.create_all()

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
        
        new_property = Property(
            lat=float(data['lat']),
            lng=float(data['lng']),
            price=data['price'],
            config=data['config'],
            area=data['area'],
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
    app.run(debug=True, port=5001)

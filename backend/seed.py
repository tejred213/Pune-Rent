from app import app, db
from models import Property

def seed_database():
    """Clear all dummy data from the database"""
    
    with app.app_context():
        # Clear existing data
        Property.query.delete()
        db.session.commit()
        
        # Empty properties list - no dummy data
        properties_data = []
        
        # Add properties to database
        for data in properties_data:
            prop = Property(**data)
            db.session.add(prop)
        
        db.session.commit()
        print(f"✓ Database cleared! All dummy data removed. Ready for user-generated content!")

if __name__ == '__main__':
    seed_database()

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Property(db.Model):
    __tablename__ = 'properties'
    
    id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    price = db.Column(db.String(50), nullable=False)  # e.g., "25K"
    config = db.Column(db.String(50), nullable=False)  # e.g., "2 BHK"
    area = db.Column(db.String(100), nullable=False)  # e.g., "Koregaon Park"
    society_name = db.Column(db.String(150), default='')
    flag = db.Column(db.String(100), default=None)  # e.g., "⚠️ Above avg"
    description = db.Column(db.Text, default='')
    owner_name = db.Column(db.String(100), default='')
    owner_phone = db.Column(db.String(20), default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'lat': self.lat,
            'lng': self.lng,
            'price': self.price,
            'config': self.config,
            'area': self.area,
            'society_name': self.society_name,
            'flag': self.flag,
            'description': self.description,
            'owner_name': self.owner_name,
            'owner_phone': self.owner_phone,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

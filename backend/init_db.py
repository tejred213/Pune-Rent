"""
Database initialization script
Run this to create tables on PostgreSQL (Render)

Usage:
    python init_db.py

Make sure DATABASE_URL environment variable is set before running:
    export DATABASE_URL="postgresql://user:password@host/database"
"""

from app import app, db

if __name__ == "__main__":
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully!")
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            exit(1)

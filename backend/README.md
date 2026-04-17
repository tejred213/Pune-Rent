# Pune Rent - Backend API

Flask REST API backend with SQLite database for managing property listings.

## Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Seed Initial Data
```bash
python seed.py
```

### 3. Run the Flask Server
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Get All Properties
```
GET /api/properties
Query Parameters:
  - area: Filter by area (optional)
  - config: Filter by BHK config (optional)
```

### Get Single Property
```
GET /api/properties/<id>
```

### Create Property
```
POST /api/properties
Body: {
  "lat": 18.5362,
  "lng": 73.8968,
  "price": "25K",
  "config": "1 BHK",
  "area": "Koregaon Park",
  "flag": "⚠️ Above avg" (optional),
  "description": "Nice apartment" (optional),
  "owner_name": "John Doe" (optional),
  "owner_phone": "9876543210" (optional)
}
```

### Update Property
```
PUT /api/properties/<id>
Body: { ...updated fields... }
```

### Delete Property
```
DELETE /api/properties/<id>
```

### Get Statistics
```
GET /api/statistics
```

### Health Check
```
GET /api/health
```

## Database

SQLite database file: `properties.db`

Tables:
- `properties` - Stores all property listings

## Frontend Integration

Update the React frontend's `App.jsx` to fetch data from:
- `http://localhost:5000/api/properties`

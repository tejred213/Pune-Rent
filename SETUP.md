# Pune.Rent - Setup Guide

Full-stack real estate mapping application with React frontend and Flask backend.

## Project Structure

```
Pune-Rent/
├── pune-rent/           # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/             # Python Flask Backend
│   ├── app.py
│   ├── models.py
│   ├── seed.py
│   ├── requirements.txt
│   └── properties.db    (auto-created)
```

## Frontend Setup (React + Vite)

### 1. Navigate to frontend
```bash
cd pune-rent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file (if using Jawg or other providers)
```
VITE_JAWG_API_TOKEN=your_token_here
```

### 4. Start the development server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

## Backend Setup (Python Flask + SQLite)

### 1. Navigate to backend
```bash
cd backend
```

### 2. Create Virtual Environment (Recommended)
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Seed Database with Initial Data
```bash
python seed.py
```

Output: `✓ Database seeded with 9 properties!`

### 5. Start Flask Server
```bash
python app.py
```

Backend will run at: `http://localhost:5000`

## API Endpoints

### Properties
- **Get all:** `GET /api/properties`
- **Get one:** `GET /api/properties/<id>`
- **Create:** `POST /api/properties`
- **Update:** `PUT /api/properties/<id>`
- **Delete:** `DELETE /api/properties/<id>`

### Utilities
- **Statistics:** `GET /api/statistics`
- **Health check:** `GET /api/health`

## Running Both Together

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd pune-rent
npm run dev
```

## Features

✅ **Interactive Map** - Leaflet + OpenStreetMap  
✅ **Metro Lines** - Purple & Aqua lines with real GeoJSON coordinates  
✅ **Marker Clustering** - Dynamic clustering based on zoom level  
✅ **BHK Filtering** - Filter by 1 BHK, 2 BHK, 3 BHK, or All  
✅ **Area Search** - Search and autocomplete for property areas  
✅ **Dark/Light Mode** - Theme toggle with preserved preferences  
✅ **Map Styles** - Multiple tile layer options (OSM, Topo, Satellite)  
✅ **Real Database** - SQLite with Flask REST API  
✅ **CORS Enabled** - Frontend-backend communication ready  

## Database Schema

**Properties Table:**
- id (Integer, Primary Key)
- lat (Float)
- lng (Float)
- price (String)
- config (String) - BHK configuration
- area (String)
- flag (String, Optional) - Special marker
- description (Text, Optional)
- owner_name (String, Optional)
- owner_phone (String, Optional)
- created_at (DateTime)
- updated_at (DateTime)

## Environment Variables

**Backend (.env):**
```
FLASK_ENV=development
FLASK_DEBUG=True
```

## Troubleshooting

### Port Already in Use
- Backend: `lsof -i :5000` then `kill -9 <PID>`
- Frontend: `lsof -i :5173` then `kill -9 <PID>`

### CORS Errors
Ensure backend is running on `http://localhost:5000` and frontend on `http://localhost:5173`

### Database Issues
Delete `properties.db` and run `python seed.py` again

## Next Steps

- Add authentication (login/signup for property owners)
- Add image upload for properties
- User reviews and ratings system
- Advanced filtering (price range, amenities)
- Mobile responsive design
- Deployment (Heroku backend, Netlify/Vercel frontend)

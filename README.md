# 🏘️ Pune.Rent

A modern, full-stack real estate mapping application for discovering rental properties in Pune. Built with React and Leaflet on the frontend, Flask on the backend, and PostgreSQL for production.

## ✨ Features

- 🗺️ **Interactive Map View** - Visualize rental properties on an interactive map with clustering
- 🔍 **Property Search** - Browse properties by area, price range, and configuration
- 📍 **Geo-location** - Properties displayed with precise latitude/longitude coordinates
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔄 **Real-time Updates** - Keep property data current and accurate
- 📊 **Property Statistics** - View market insights and pricing trends
- 🚀 **Production Ready** - Deployed with automatic database migrations and health checks

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Lightning-fast build tool
- **Leaflet & React-Leaflet** - Interactive mapping
- **Leaflet Cluster** - Map marker clustering
- **ESLint** - Code quality

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Production database (with SQLite fallback for development)
- **APScheduler** - Background task scheduling
- **Flask-CORS** - Cross-origin resource sharing
- **Gunicorn** - Production WSGI server

## 📋 Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git

## 🚀 Quick Start

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd pune-rent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Seed the database** (first time only)
   ```bash
   python seed.py
   ```
   Expected output: `✓ Database seeded with 9 properties!`

5. **Start Flask server**
   ```bash
   python app.py
   ```
   Backend will be available at `http://localhost:5000`

## 📁 Project Structure

```
Pune-Rent/
├── pune-rent/              # React Frontend
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css         # Global styles
│   │   ├── index.css       # Base styles
│   │   ├── main.jsx        # Entry point
│   │   ├── assets/         # Images and static files
│   │   └── data/           # Data utilities
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── backend/                # Python Flask Backend
│   ├── app.py              # Main Flask app
│   ├── models.py           # Database models
│   ├── init_db.py          # Database initialization
│   ├── seed.py             # Sample data seeder
│   ├── requirements.txt    # Python dependencies
│   ├── runtime.txt         # Python version specification
│   ├── Procfile            # Heroku/Render deployment
│   └── instance/           # Instance-specific files
│
├── SETUP.md                # Detailed setup instructions
├── DEPLOYMENT.md           # Deployment guide
├── POSTGRES_RENDER_GUIDE.md # PostgreSQL setup for Render
└── NEON_MIGRATION_GUIDE.md  # Neon database migration
```

## 🔌 API Endpoints

### Properties

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/<id>` | Get a specific property |
| POST | `/api/properties` | Create a new property |
| PUT | `/api/properties/<id>` | Update a property |
| DELETE | `/api/properties/<id>` | Delete a property |

### Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/statistics` | Get property statistics |
| GET | `/api/health` | Health check endpoint |

## 📦 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=sqlite:///properties.db  # or PostgreSQL URL for production

# Frontend Environment (in pune-rent/)
VITE_API_URL=http://localhost:5000
```

For production deployments with PostgreSQL:
```env
DATABASE_URL=postgresql+psycopg2://user:password@host:port/dbname
```

## 🧪 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `python app.py` - Start Flask development server
- `python seed.py` - Populate database with sample data
- `python init_db.py` - Initialize database schema

## 🌍 Deployment

The application is configured for deployment on **Render** or similar platforms:

- **Frontend**: Built with Vite and served as static files
- **Backend**: Deployed with Gunicorn and PostgreSQL
- **Database**: Uses Neon for managed PostgreSQL hosting

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions and [POSTGRES_RENDER_GUIDE.md](POSTGRES_RENDER_GUIDE.md) for database setup.


## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running (production) or SQLite file exists (development)
- Check `DATABASE_URL` environment variable format
- For local development, SQLite is automatically used

### CORS Errors
- Verify frontend URL is in the CORS allowed origins
- Check backend is running and accessible

### Port Already in Use
- Frontend: Change in `vite.config.js` or use `npm run dev -- --port 3000`
- Backend: Use `python app.py --port 5001` or kill existing process

## 📚 Documentation

- [Setup Guide](SETUP.md) - Comprehensive setup instructions
- [Deployment Guide](DEPLOYMENT.md) - Production deployment steps
- [PostgreSQL on Render](POSTGRES_RENDER_GUIDE.md) - Database configuration
- [Neon Migration](NEON_MIGRATION_GUIDE.md) - Migrating to Neon database

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with ❤️ for finding the perfect rental in Pune**

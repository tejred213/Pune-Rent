# Deployment Guide for Pune-Rent

## Prerequisites
- Domain name (you already have this ✓)
- GitHub account (for pushing code)
- Vercel account (vercel.com)
- Render/Railway account (render.com or railway.app)

---

## PART 1: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
1. Push your code to GitHub
2. Create `.gitignore` if not present (ignore node_modules, dist)
3. Frontend is already Vite-based - no changes needed

### Step 2: Deploy on Vercel
1. Go to https://vercel.com and sign up
2. Click "New Project" → Import your GitHub repo
3. Select the `pune-rent` folder as the root directory
4. Framework: Vite
5. Deploy

### Step 3: Connect Domain to Vercel
1. In Vercel Project Settings → Domains
2. Add your domain name
3. Update DNS records with Vercel's nameservers (or CNAME)

---

## PART 2: Backend Deployment (Render.com)

### Step 1: Prepare Backend

Create a `Procfile` in backend folder:
```
web: gunicorn app:app
```

Add to `requirements.txt`:
```
gunicorn==21.2.0
```

### Step 2: Update Flask for Production
Update backend/app.py:
- Change CORS origin from localhost to your domain
- Add production configuration

### Step 3: Deploy on Render
1. Go to https://render.com and sign up
2. Create "New Web Service"
3. Connect GitHub repo
4. Configure:
   - Runtime: Python 3
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:app`
5. Deploy

---

## PART 3: Connect Frontend & Backend

### Update Frontend API URL
In `pune-rent/src/` files, replace localhost API calls with:
```javascript
const API_URL = process.env.VITE_API_URL || 'https://your-backend.onrender.com'
```

Create `pune-rent/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Database Considerations

**Current Setup**: SQLite (properties.db)

### Issue: SQLite doesn't persist on Render/Railway free tier

**Solution**: 
1. **Keep SQLite** (simple): Seed database on each deploy
2. **Switch to PostgreSQL**: Free tier available on both platforms (better for production)

### To use PostgreSQL (Better Option):
- Render: Provides free PostgreSQL tier
- Update `requirements.txt`: Add `psycopg2-binary`
- Update database URI in app.py to PostgreSQL connection string

---

## Environment Variables

Create `.env` files for:

### Backend (.env in backend folder):
```
FLASK_ENV=production
DATABASE_URL=your_database_url
DEBUG=False
```

### Frontend (`.env.production` in pune-rent folder):
```
VITE_API_URL=https://your-backend-url
```

---

## Testing Before Production
1. Build frontend: `npm run build`
2. Test with production build locally
3. Verify API calls point to backend URL
4. Test all key features

---

## Cost Summary
- **Vercel Frontend**: Free ($0)
- **Render Backend**: Free tier available ($0 initially, may need upgrade)
- **Domain**: ~$10-15/year (you already have this)
- **Total**: ~$0-15/year

---

## Next Steps
1. Would you like help updating the code for production?
2. Should we switch to PostgreSQL or keep SQLite?
3. Need help with CORS configuration for your domain?

# PostgreSQL + Render Deployment Guide for Pune-Rent

## Overview
- **Frontend**: React + Vite → Vercel
- **Backend**: Flask + PostgreSQL → Render
- **Database**: PostgreSQL (free tier on Render)
- **Total Cost**: ~$0-15/year (domain only)

---

## PART 1: Backend Setup (PostgreSQL Ready)

### ✅ Already Done
- ✅ Added `psycopg2-binary` to requirements.txt
- ✅ Added `gunicorn` for production server
- ✅ Updated app.py to use `DATABASE_URL` environment variable
- ✅ Created `Procfile` for Render
- ✅ Created `.env.example` for reference

### What This Means
- Backend now auto-detects production vs local environment
- **Local**: Uses SQLite (development)
- **Production (Render)**: Uses PostgreSQL (via DATABASE_URL)

---

## PART 2: Deploy Backend on Render

### Step 1: Prepare GitHub
```bash
cd /Users/tejasredkar/Developer/Pune-Rent
git add .
git commit -m "Setup: Add PostgreSQL and production configs"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render
1. Go to https://render.com and sign up
2. Go to Dashboard → Create → **PostgreSQL**
3. Fill in:
   - **Name**: `pune-rent-db`
   - **Database**: `pune_rent`
   - **User**: `punjent_user` (keep default or customize)
   - **Region**: Choose closest to India (select Mumbai/Singapore if available)
   - **Version**: PostgreSQL 15+ (default is fine)
4. Click **Create Database**
5. ⚠️ **Important**: Save the connection string shown (you'll need it in Step 4)

### Step 3: Create Web Service on Render
1. Dashboard → Create → **Web Service**
2. Connect GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `pune-rent-api` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |
| **Branch** | main |
| **Region** | Same as database (Mumbai/Singapore) |

4. Click **Create Web Service**

### Step 4: Add Environment Variables
1. In Render Web Service Settings → **Environment**
2. Add:

```
DATABASE_URL = [paste the connection string from Step 2]
FLASK_ENV = production
DEBUG = False
```

**Connection string format** (from Render):
```
postgresql://pune_rent_user:PASSWORD@dpg-xxxxx-yyyy.render.onrender.com:5432/pune_rent
```

3. Click **Save**

### Step 5: Deploy
- Render auto-deploys once env vars are set
- Check status in **Logs** tab
- Wait ~2-3 minutes for first deploy
- ⚠️ First deploy may fail with DB table errors (normal, see Step 6)

### Step 6: Initialize Database

⚠️ **Render Free Tier**: No shell access available. Use this method instead:

1. Create `backend/init_db.py`:
```python
from app import app, db

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
```

2. Run locally to initialize database:
```bash
cd backend
export DATABASE_URL="postgresql://pune_rent_user:PASSWORD@dpg-xxxxx-yyyy.render.onrender.com:5432/pune_rent"
python init_db.py
```

**Alternative**: Add to `Procfile` to run on deploy:
```
web: python init_db.py && gunicorn app:app
```

This will initialize tables on every deploy (safe to run multiple times).

### Step 7: Verify Backend
```bash
curl https://pune-rent-api.onrender.com/api/properties
```
Should return: `[]` (empty list, which is correct)

---

## PART 3: Seed Initial Data

### Option A: Add properties via API
```bash
curl -X POST https://pune-rent-api.onrender.com/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 18.5204,
    "lng": 73.8567,
    "price": "25K",
    "config": "2 BHK",
    "area": "Koregaon Park",
    "description": "Spacious 2BHK with parking"
  }'
```

### Option B: Automated Seed Script
Update `backend/seed.py` to use DATABASE_URL, then run it locally:
```bash
cd backend
python seed.py
```

---

## PART 4: Frontend Configuration

### Update API Base URL
In `pune-rent/` project:

Create `.env.production`:
```
VITE_API_URL=https://pune-rent-api.onrender.com
```

Update any API calls in `src/`:
```javascript
// Before
const response = await fetch('http://localhost:5000/api/properties')

// After  
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const response = await fetch(`${API_URL}/api/properties`)
```

---

## PART 5: Deploy Frontend on Vercel

### Step 1: Push code
```bash
git add .
git commit -m "Add frontend API configuration"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. New Project → Import GitHub Repo
3. **Root Directory**: `pune-rent`
4. **Framework**: Vite
5. **Environment**: Add `VITE_API_URL=https://pune-rent-api.onrender.com`
6. Click **Deploy**

### Step 3: Connect Domain
1. Vercel Project Settings → **Domains**
2. Add your domain name
3. Update DNS records (Vercel will provide instructions)

---

## PART 6: Enable CORS (Important!)

Update `backend/app.py` to allow frontend domain:

```python
from flask_cors import CORS

# CORS Configuration
cors_config = {
    "origins": [
        "http://localhost:5173",          # Local development
        "https://your-domain.com",        # Your domain
        "https://www.your-domain.com"     # With www
    ]
}
CORS(app, resources={r"/api/*": cors_config})
```

---

## Testing Checklist

- [ ] Backend API running: `https://pune-rent-api.onrender.com/api/properties` returns `[]`
- [ ] Frontend loads: `https://your-domain.com` loads without errors
- [ ] API connection works: Properties load and display on map
- [ ] Create property: Can add new rental from frontend
- [ ] Update property: Can edit via API
- [ ] Delete property: Can remove via API

---

## Monitoring & Maintenance

### Check Backend Logs
Render Dashboard → Web Service → **Logs** tab

### Check Database Status
Render Dashboard → PostgreSQL → **Info** tab

### Reboot Backend (if needed)
Render Dashboard → Web Service → **Manual Deploy** → **Deploy latest**

---

## Costs (After Free Tier Credits Expire)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Render Backend** | $0 (trial credits) | $7/mo (after trial) |
| **Render Database** | $0 (trial credits) | $15/mo (after trial) |
| **Vercel Frontend** | $0 (free tier) | $20/mo (pro, optional) |
| **Domain** | - | ~$10-15/year |
| **Total Monthly** | $0 | ~$22-25/mo |

Render provides trial credits (~$36) - enough for 1-2 months free!

---

## Troubleshooting

### ❌ "400 Bad Request" from API
**Cause**: CORS issue or invalid request
**Fix**: Check CORS configuration in app.py

### ❌ "502 Bad Gateway" on Render
**Cause**: App not loading properly
**Fix**: Check Render logs, restart service

### ❌ Database connection failed
**Cause**: Wrong DATABASE_URL
**Fix**: Verify connection string in env vars (PASSWORD field especially)

### ❌ Cold start delays (first request slow)
**Normal**: Free tier has cold starts
**Fix**: Keep-alive service like UptimeRobot to prevent spins down

---

## Quick Reference Commands

```bash
# Test locally with PostgreSQL (install PostgreSQL locally first)
export DATABASE_URL="postgresql://user:pass@localhost:5432/pune_rent"
python app.py

# Build frontend for production
cd pune-rent && npm run build

# Check production build locally
npm run preview

# View Render logs in real-time
# Use Render dashboard → Logs tab (no CLI command needed)
```

---

## Next Steps to Deploy

1. **Push code**: `git push origin main`
2. **Create PostgreSQL** on Render (Step 2 above)
3. **Create Web Service** on Render (Step 3 above)
4. **Add environment variables** (Step 4 above)
5. **Initialize database** (Step 6 above)
6. **Deploy frontend** on Vercel
7. **Connect domain** to Vercel

Ready? Let me know if you need help with any step!

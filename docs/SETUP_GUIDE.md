# SARS (Smart Ambulance Routing System) - Setup Guide

Complete installation and configuration guide for Phase 1 of the SARS project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## Project Overview

SARS is a Smart Ambulance Routing System that:
- Manages emergency calls with AI transcription
- Optimizes ambulance dispatch with intelligent routing
- Sends real-time WhatsApp notifications to drivers
- Tracks ambulances and emergencies on interactive maps
- Provides a modern, responsive user interface

**Phase 1 Focus**: Core functionality with improved UI

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.14+, or Linux
- **RAM**: 4GB
- **Disk**: 2GB free space

### Software Requirements
- **Python**: 3.11 or higher
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher
- **Git**: 2.0 or higher

## Backend Setup

### 1. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
# At minimum, set:
# - JWT_SECRET (use a strong random string)
# - GROQ_API_KEY (optional for Phase 1)
# - TWILIO_* (optional for Phase 1)
# - TOMTOM_API_KEY (optional for Phase 1)
```

### 3. Verify Installation

```bash
# Run the backend
python main.py

# You should see:
# INFO:     Application startup complete
```

Visit: http://localhost:8000/api/docs

## Frontend Setup

### 1. Install Node Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env:
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_TOMTOM_API_KEY=your_tomtom_key_here
REACT_APP_ENV=development
```

### 3. Verify Installation

```bash
# Start development server
npm start

# Opens automatically at http://localhost:3000
```

## Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# Database
DATABASE_URL=sqlite:///./sars.db

# AI Transcription
GROQ_API_KEY=your_groq_key

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# JWT Security (CHANGE THIS!)
JWT_SECRET=your_super_secret_key_change_this

# Maps
TOMTOM_API_KEY=your_tomtom_key

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# Logging
LOG_LEVEL=INFO
DEBUG=True
```

### Frontend Configuration

Edit `frontend/.env`:

```env
# API
REACT_APP_API_URL=http://localhost:8000/api

# Maps
REACT_APP_TOMTOM_API_KEY=your_tomtom_key

# Environment
REACT_APP_ENV=development
```

### Getting API Keys

#### 1. Groq API (Optional)
- Visit: https://console.groq.com
- Create account and API key
- Set `GROQ_API_KEY` in backend .env

#### 2. Twilio (Optional)
- Visit: https://www.twilio.com
- Create account
- Get Account SID and Auth Token
- Set `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`

#### 3. TomTom Maps (Optional)
- Visit: https://developer.tomtom.com
- Sign up and create API key
- Set `TOMTOM_API_KEY` in both .env files

## Running the Application

### Terminal 1: Start Backend

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run server
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend

```bash
cd frontend

# Install dependencies if not done
npm install

# Start dev server
npm start
```

Expected output:
```
On Your Network: http://localhost:3000
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/api/docs
- **Backend ReDoc**: http://localhost:8000/api/redoc

### Demo Login

For testing without authentication setup:
- **Username**: `demo` (or any username)
- **Password**: `demo` (or any password)

The system will accept any credentials in demo mode.

## Testing

### Backend Testing

```bash
cd backend

# Run tests
pytest tests/

# Run specific test
pytest tests/test_emergency.py

# With coverage
pytest --cov=app tests/
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run specific test
npm test -- EmergencyForm

# With coverage
npm test -- --coverage
```

### Manual Testing Checklist

#### Emergencies
- [ ] Create new emergency with audio upload
- [ ] Edit emergency details
- [ ] View emergency list
- [ ] Filter by status/priority

#### Ambulances
- [ ] View ambulance fleet
- [ ] See ambulance status
- [ ] Check driver information
- [ ] Update ambulance location

#### Dispatch
- [ ] Select pending emergency
- [ ] Enter hospital information
- [ ] Optimize routes
- [ ] Select ambulance from recommendations
- [ ] Confirm dispatch
- [ ] Check WhatsApp status

#### Navigation
- [ ] Access all pages from sidebar
- [ ] Check responsive design on mobile
- [ ] Verify CORS is working
- [ ] Test logout functionality

## Troubleshooting

### Backend Issues

#### Port 8000 already in use
```bash
# Find and kill process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

#### Database errors
```bash
# Remove old database
rm backend/sars.db

# It will be recreated on next run
python main.py
```

#### Import errors
```bash
# Verify virtual environment is activated
which python  # should show venv path

# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

#### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

#### Node modules issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### CORS errors
- Check backend `.env` CORS_ORIGINS includes `http://localhost:3000`
- Ensure backend is running on port 8000
- Check API_URL in frontend `.env`

### API Connection Issues

#### Cannot reach backend from frontend
1. Verify backend is running: `http://localhost:8000/health`
2. Check CORS configuration in backend
3. Verify REACT_APP_API_URL in frontend .env
4. Check firewall settings

#### Auth token issues
```javascript
// Clear localStorage and login again
localStorage.clear()
```

## Next Steps

After successful setup:

1. **Explore the UI**
   - Familiarize with all pages
   - Test all features
   - Check responsive design

2. **Integrate External APIs** (Optional)
   - Configure Groq API key for transcription
   - Set up Twilio for WhatsApp
   - Add TomTom Maps integration

3. **Customize for Your Needs**
   - Update hospital database
   - Add ambulance fleet data
   - Customize color scheme
   - Add your logo

4. **Deploy** (Later Phase)
   - Backend: Heroku, AWS, or DigitalOcean
   - Frontend: Vercel, Netlify, or GitHub Pages

## Additional Resources

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [React Docs](https://react.dev)
- [Material-UI Docs](https://mui.com)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org)

## Support & Contribution

For issues or questions:
1. Check this guide
2. Review project README.md
3. Create a GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Error messages
   - Environment details

## License

MIT License - See LICENSE file in project root

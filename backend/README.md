# SARS (Smart Ambulance Routing System) - Backend

FastAPI-based backend for the Smart Ambulance Routing System with AI-powered emergency management and route optimization.

## Features

- 🚑 **Emergency Management** - Comprehensive CRUD operations for emergencies
- 🤖 **AI Transcription** - Groq API integration for audio-to-text conversion
- 🧠 **Data Extraction** - Automatic extraction of structured data from transcriptions
- 📍 **Route Optimization** - TomTom Maps integration for optimal route calculation
- 💬 **WhatsApp Integration** - Twilio API for driver notifications
- 🔐 **Authentication** - JWT-based secure authentication
- 📊 **RESTful API** - Complete API documentation with Swagger UI

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **SQLite** - Database (Phase 1)
- **Groq API** - AI transcription service
- **Twilio** - WhatsApp messaging
- **TomTom Maps API** - Route optimization

## Installation

### Prerequisites
- Python 3.11+
- pip or poetry

### Setup

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```
   DATABASE_URL=sqlite:///./sars.db
   GROQ_API_KEY=your_groq_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TOMTOM_API_KEY=your_tomtom_key
   JWT_SECRET=your_secret_key
   ```

5. **Run the application**
   ```bash
   python main.py
   # or
   uvicorn app.main:app --reload
   ```

   API will be available at [http://localhost:8000](http://localhost:8000)
   Swagger UI: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

## Project Structure

```
backend/
├── app/
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API routes
│   ├── services/            # Business logic
│   ├── database/            # DB configuration
│   ├── utils/               # Utilities
│   ├── config.py            # Configuration
│   └── main.py              # FastAPI app
├── tests/                   # Unit tests
├── requirements.txt         # Python dependencies
└── main.py                  # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Emergencies
- `GET /api/emergencies` - List all emergencies
- `POST /api/emergencies` - Create new emergency
- `GET /api/emergencies/{id}` - Get emergency details
- `PUT /api/emergencies/{id}` - Update emergency
- `DELETE /api/emergencies/{id}` - Delete emergency

### Ambulances
- `GET /api/ambulances` - List all ambulances
- `GET /api/ambulances/available` - Get available ambulances
- `POST /api/ambulances` - Create ambulance
- `GET /api/ambulances/{id}` - Get ambulance details
- `PUT /api/ambulances/{id}` - Update ambulance

### Dispatch
- `POST /api/dispatch/optimize` - Optimize routes for ambulances
- `POST /api/dispatch` - Create dispatch
- `GET /api/dispatch/{id}` - Get dispatch details
- `PUT /api/dispatch/{id}/status` - Update dispatch status

### Transcription
- `POST /api/transcription/process` - Upload audio and extract data

## Database Models

### Emergency
- ID, Patient Name, Location, Condition
- Priority Level, Status, Caller Info
- Timestamps, Dispatch Relationship

### Ambulance
- ID, Name, Vehicle Number, Status
- Location (lat/lon), Type, Capacity
- Equipment, Driver Relationship

### Driver
- ID, Name, Phone, Email
- License Number, Qualifications
- Active Status, Timestamps

### User
- ID, Username, Email, Password Hash
- Full Name, Role, Active Status
- Timestamps

### Dispatch
- ID, Emergency ID, Ambulance ID
- Hospital Info, Distance, ETA
- WhatsApp Status, Route Polyline
- Timestamps

## Testing

```bash
pytest tests/
```

## Configuration

### Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - Groq API key for transcription
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TOMTOM_API_KEY` - TomTom Maps API key
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `CORS_ORIGINS` - Allowed origins for CORS

## Deployment

### Using Docker
```bash
docker build -t sars-backend .
docker run -p 8000:8000 --env-file .env sars-backend
```

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Using Heroku
```bash
heroku create sars-backend
heroku config:set GROQ_API_KEY=your_key
git push heroku main
```

## API Documentation

Once running, visit:
- **Swagger UI**: `/api/docs`
- **ReDoc**: `/api/redoc`
- **OpenAPI JSON**: `/api/openapi.json`

## Common Tasks

### Create a new database migration
```bash
# Database is auto-created on first run with SQLAlchemy
# For PostgreSQL, use Alembic
alembic revision --autogenerate -m "Add new column"
alembic upgrade head
```

### Reset database
```python
from app.database.database import Base, engine
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
```

## Performance Optimization

- **Database Indexing** - Indexed on frequently queried fields
- **Caching** - Response caching for GET requests
- **Pagination** - Limit and offset parameters for large datasets
- **Async Operations** - FastAPI async route handlers

## Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password storage
- **CORS Middleware** - Configurable allowed origins
- **Environment Variables** - Sensitive config not in code
- **Input Validation** - Pydantic models validate all input

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Follow code style: `black` and `flake8`
3. Write tests for new features
4. Submit pull request

## License

MIT License - See LICENSE file

## Support

For issues and questions, please create an issue on GitHub.

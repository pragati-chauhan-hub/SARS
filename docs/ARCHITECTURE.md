# SARS System Architecture

Technical architecture overview for the Smart Ambulance Routing System Phase 1.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 18)                      │
│     Material-UI Components, React Router, Axios             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         │ (Axios)
┌────────────────────────▼────────────────────────────────────┐
│                  Backend (FastAPI)                           │
│    Pydantic Validation, SQLAlchemy ORM, CORS                │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐ │
│ │              Router Layer (API Routes)                   │ │
│ │  Emergencies │ Ambulances │ Dispatch │ Auth │ Transcribe│ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │            Service Layer (Business Logic)                │ │
│ │ • TranscriptionService (Groq API)                        │ │
│ │ • WhatsAppService (Twilio API)                           │ │
│ │ • RouteOptimizer (TomTom Maps)                           │ │
│ │ • AuthService (JWT)                                      │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │           Data Layer (Database Models)                   │ │
│ │ Emergency │ Ambulance │ Driver │ User │ Dispatch        │ │
│ └──────────────────────────────────────────────────────────┘ │
└────────────────┬───────────────────────┬─────────────────────┘
                 │                       │
        ┌────────▼────────┐   ┌─────────▼──────────┐
        │   SQLite DB     │   │ External APIs      │
        │  (Phase 1)      │   │ • Groq (AI)        │
        │                 │   │ • Twilio (SMS)     │
        │                 │   │ • TomTom (Maps)    │
        └─────────────────┘   └────────────────────┘
```

## Technology Stack Detail

### Frontend Architecture

```
src/
├── components/           # Reusable UI components
│   ├── Layout/          # Navigation, Sidebar, Layout wrapper
│   ├── Emergency/       # Emergency management components
│   ├── Dispatch/        # Dispatch workflow components
│   ├── Map/             # Map visualization
│   └── Common/          # Shared utilities (Spinner, Toast, etc)
│
├── pages/               # Page/Route components
│   ├── Dashboard
│   ├── ActiveEmergencies
│   ├── Ambulances
│   ├── Dispatch
│   ├── LiveTracking
│   ├── Settings
│   └── Login
│
├── services/            # API integration
│   └── api.js          # Axios instance with interceptors
│
├── context/             # React Context for state
│   └── AuthContext.js   # User authentication state
│
├── hooks/               # Custom React hooks
│   └── useAuth.js       # Auth context hook
│
├── utils/               # Helper functions
│   ├── formatters.js    # Data formatting
│   ├── validators.js    # Input validation
│   └── constants.js     # App constants
│
├── styles/              # CSS
│   └── index.css        # Global styles
│
├── App.js               # Root component with routing
└── index.js             # ReactDOM render
```

### Backend Architecture

```
app/
├── main.py              # FastAPI app factory
├── config.py            # Configuration management
│
├── models/              # SQLAlchemy ORM models
│   └── emergency.py     # Emergency, Ambulance, Driver, User, Dispatch
│
├── schemas/             # Pydantic schemas for validation
│   └── emergency.py     # Request/Response schemas
│
├── routers/             # API route handlers
│   ├── emergencies.py   # Emergency CRUD
│   ├── ambulances.py    # Ambulance CRUD
│   ├── dispatch.py      # Dispatch logic
│   ├── transcription.py # Audio transcription
│   └── auth.py          # Authentication
│
├── services/            # Business logic
│   ├── transcription_service.py  # Groq integration
│   ├── whatsapp_service.py       # Twilio integration
│   ├── route_optimizer.py        # TomTom integration
│   └── location_service.py       # Distance calculations
│
├── database/            # Database setup
│   └── database.py      # SQLAlchemy engine, session, base
│
└── utils/               # Utilities
    ├── auth.py          # JWT, password hashing
    ├── logger.py        # Logging configuration
    └── validators.py    # Data validators
```

## Data Flow

### Emergency Creation Flow

```
1. User uploads audio file
   └─> AudioUpload component

2. Frontend calls transcription API
   └─> POST /api/transcription/process

3. Backend processes with Groq API
   └─> Extracts: name, location, condition, priority

4. Frontend receives structured data
   └─> EmergencyForm pre-populated

5. User reviews and submits form
   └─> POST /api/emergencies

6. Emergency created in database
   └─> Status: PENDING

7. Frontend navigates to dispatch
   └─> Shows in emergency list
```

### Dispatch Flow

```
1. Dispatcher selects emergency
   └─> GET /api/emergencies/{id}

2. Dispatcher enters hospital info
   └─> DispatchForm component

3. Dispatcher clicks "Optimize Routes"
   └─> POST /api/dispatch/optimize
   └─> Calls TomTom Matrix Route API
   └─> Calculates ETA for each ambulance
   └─> Ranks by ETA (primary), distance (secondary)

4. Backend returns route options
   └─> AmbulanceSelector displays recommendations

5. Dispatcher selects ambulance
   └─> Confirms dispatch

6. Backend creates dispatch record
   └─> POST /api/dispatch
   └─> Sends WhatsApp via Twilio
   └─> Updates ambulance status

7. Driver receives WhatsApp
   └─> Contains: Hospital name, address, patient info, ETA

8. Frontend shows confirmation
   └─> Displays: WhatsApp delivery status
```

### Real-time Updates Flow (Polling)

```
Frontend polls every 10 seconds:
├─ GET /api/emergencies (active only)
├─ GET /api/ambulances (with status)
└─ GET /api/dispatch/{id} (status updates)

Updates UI:
├─ Emergency status badges
├─ Ambulance location markers
└─ WhatsApp delivery status
```

## Database Schema

### Emergency Table
```sql
emergencies
├─ id (PK)
├─ patient_name (String)
├─ patient_phone (String)
├─ location (String)
├─ latitude (Float)
├─ longitude (Float)
├─ condition (Text)
├─ priority (Enum: low, medium, high, critical)
├─ status (Enum: pending, en_route, at_scene, resolved)
├─ caller_name (String)
├─ caller_phone (String)
├─ description (Text)
├─ created_at (DateTime)
└─ updated_at (DateTime)
```

### Ambulance Table
```sql
ambulances
├─ id (PK)
├─ name (String, unique)
├─ vehicle_number (String, unique)
├─ status (Enum: available, en_route, at_scene, returning)
├─ latitude (Float)
├─ longitude (Float)
├─ ambulance_type (String: ALS, BLS)
├─ capacity (Integer)
├─ equipment (Text)
├─ driver_id (FK -> drivers.id)
├─ created_at (DateTime)
└─ updated_at (DateTime)
```

### Driver Table
```sql
drivers
├─ id (PK)
├─ name (String)
├─ phone (String, unique)
├─ email (String, unique)
├─ license_number (String, unique)
├─ qualifications (Text)
├─ is_active (Boolean)
├─ created_at (DateTime)
└─ updated_at (DateTime)
```

### User Table
```sql
users
├─ id (PK)
├─ username (String, unique)
├─ email (String, unique)
├─ full_name (String)
├─ hashed_password (String)
├─ role (String: admin, dispatcher, driver)
├─ is_active (Boolean)
├─ created_at (DateTime)
└─ updated_at (DateTime)
```

### Dispatch Table
```sql
dispatch
├─ id (PK)
├─ emergency_id (FK -> emergencies.id)
├─ ambulance_id (FK -> ambulances.id)
├─ hospital_name (String)
├─ hospital_location (String)
├─ hospital_latitude (Float)
├─ hospital_longitude (Float)
├─ distance_km (Float)
├─ estimated_time_minutes (Integer)
├─ whatsapp_status (String: pending, sent, delivered, failed)
├─ route_polyline (Text)
├─ created_at (DateTime)
└─ updated_at (DateTime)
```

## API Call Flow

### Authentication
```
POST /api/auth/login
├─ Request: { username, password }
├─ Validation: Pydantic schema
├─ Lookup: Find user in database
├─ Verify: Check password hash
└─ Response: JWT token + user data
```

### Get Emergencies
```
GET /api/emergencies?status=pending&limit=10
├─ Auth: Check JWT token
├─ Query: Parse filters
├─ DB Query: Filter by status
├─ Pagination: Apply limit/offset
├─ Serialize: Convert to schema
└─ Response: List of emergencies
```

### Create Dispatch
```
POST /api/dispatch
├─ Auth: Verify token
├─ Validation: Validate request data
├─ DB: Fetch emergency and ambulance
├─ Business Logic: Calculate distance/ETA
├─ Service: Send WhatsApp message
├─ DB: Save dispatch record
├─ Update: Change ambulance status
└─ Response: Dispatch details
```

## Error Handling

### Frontend
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('access_token');
      navigate('/login');
    }
    return Promise.reject(error);
  }
)
```

### Backend
```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )
```

## Performance Considerations

### Frontend
- React.memo for expensive components
- Code splitting with lazy routes
- Image optimization
- CSS modules for scoped styles

### Backend
- Database indexing on frequent queries
- Pagination for large result sets
- Async route handlers
- Connection pooling (with PostgreSQL)

## Security

### Frontend
- HTTP-only cookies for tokens (future)
- Input validation before submission
- XSS protection via React
- CSRF tokens (future)

### Backend
- JWT token validation
- Password hashing with bcrypt
- Input validation with Pydantic
- CORS middleware
- SQL injection prevention via ORM

## Deployment Architecture (Phase 2)

```
┌─────────────────────────────────────────────┐
│          CDN (CloudFlare)                   │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼─────────────┐  ┌───────▼──────────┐
│ Frontend        │  │ API Gateway      │
│ (Vercel/S3)     │  │ (AWS/CloudFlare) │
└─────────────────┘  └───────┬──────────┘
                              │
                     ┌────────▼────────┐
                     │  Load Balancer  │
                     └────────┬────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼──────┐  ┌────────▼──────┐
            │ Backend #1   │  │ Backend #2    │
            │ (Gunicorn)   │  │ (Gunicorn)    │
            └───────┬──────┘  └────────┬──────┘
                    │                  │
                    └──────────┬───────┘
                               │
                    ┌──────────▼───────────┐
                    │  PostgreSQL Master   │
                    │  (AWS RDS)           │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  PostgreSQL Replica  │
                    │  (Backup)            │
                    └──────────────────────┘
```

## Monitoring & Logging

### Frontend
- Error tracking: Sentry
- Analytics: Google Analytics
- Performance: Web Vitals

### Backend
- Logs: stdout + file
- Metrics: Prometheus
- Tracing: OpenTelemetry
- Health checks: /health endpoint

## Future Improvements (Phase 2+)

1. **WebSockets** - Real-time updates instead of polling
2. **GraphQL** - Alternative API layer
3. **PostgreSQL** - Replace SQLite for production
4. **Redis** - Caching and session management
5. **Elasticsearch** - Full-text search
6. **Kafka** - Event streaming for real-time processing
7. **Docker** - Containerization for deployment
8. **Kubernetes** - Orchestration and scaling

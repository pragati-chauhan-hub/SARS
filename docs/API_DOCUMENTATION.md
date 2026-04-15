# SARS API Documentation

Complete API reference for the Smart Ambulance Routing System backend.

## Base URL

```
http://localhost:8000/api
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require JWT token in header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses are JSON:

```json
{
  "data": { /* response data */ },
  "error": null,
  "message": "Success"
}
```

## Error Handling

Errors return appropriate HTTP status codes:

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid auth
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "dispatcher1",
  "email": "user@example.com",
  "password": "secure_password",
  "full_name": "John Dispatcher",
  "role": "dispatcher"
}

Response: 201 Created
{
  "id": 1,
  "username": "dispatcher1",
  "email": "user@example.com",
  "full_name": "John Dispatcher",
  "role": "dispatcher",
  "is_active": true
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "dispatcher1",
  "password": "secure_password"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "dispatcher1",
    "email": "user@example.com",
    "full_name": "John Dispatcher",
    "role": "dispatcher",
    "is_active": true
  }
}
```

## Emergency Endpoints

### List Emergencies
```
GET /emergencies?status=pending&priority=critical&skip=0&limit=10
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "patient_name": "John Doe",
    "location": "123 Main St",
    "condition": "Severe chest pain",
    "priority": "critical",
    "status": "pending",
    "created_at": "2024-04-15T10:30:00",
    "updated_at": "2024-04-15T10:30:00"
  }
]
```

### Create Emergency
```
POST /emergencies
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient_name": "John Doe",
  "patient_phone": "+1234567890",
  "location": "123 Main Street",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "condition": "Severe chest pain",
  "priority": "critical",
  "caller_name": "Jane Doe",
  "caller_phone": "+9876543210",
  "description": "Patient is conscious but in distress"
}

Response: 201 Created
{
  "id": 1,
  "patient_name": "John Doe",
  "location": "123 Main Street",
  "condition": "Severe chest pain",
  "priority": "critical",
  "status": "pending",
  "created_at": "2024-04-15T10:30:00"
}
```

### Get Emergency Details
```
GET /emergencies/1
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "patient_name": "John Doe",
  "location": "123 Main Street",
  "condition": "Severe chest pain",
  "priority": "critical",
  "status": "pending",
  "created_at": "2024-04-15T10:30:00"
}
```

### Update Emergency
```
PUT /emergencies/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "en_route",
  "condition": "Stable condition"
}

Response: 200 OK
{ /* updated emergency */ }
```

### Delete Emergency
```
DELETE /emergencies/1
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Emergency deleted successfully" }
```

## Ambulance Endpoints

### List Ambulances
```
GET /ambulances?status=available&skip=0&limit=10
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "name": "Ambulance-01",
    "vehicle_number": "AMB-001",
    "status": "available",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "ambulance_type": "ALS",
    "capacity": 2,
    "driver_id": 1,
    "created_at": "2024-04-15T10:30:00"
  }
]
```

### Get Available Ambulances
```
GET /ambulances/available
Authorization: Bearer <token>

Response: 200 OK
[ /* list of available ambulances */ ]
```

### Create Ambulance
```
POST /ambulances
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ambulance-01",
  "vehicle_number": "AMB-001",
  "ambulance_type": "ALS",
  "capacity": 2,
  "equipment": "Defibrillator, Oxygen",
  "driver_id": 1
}

Response: 201 Created
{ /* created ambulance */ }
```

### Update Ambulance
```
PUT /ambulances/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "en_route",
  "latitude": 40.7150,
  "longitude": -74.0080
}

Response: 200 OK
{ /* updated ambulance */ }
```

## Dispatch Endpoints

### Optimize Routes
```
POST /dispatch/optimize
Authorization: Bearer <token>
Content-Type: application/json

{
  "emergency_id": 1,
  "emergency_latitude": 40.7128,
  "emergency_longitude": -74.0060,
  "hospital_latitude": 40.7700,
  "hospital_longitude": -73.9800
}

Response: 200 OK
{
  "routes": [
    {
      "ambulance_id": 1,
      "ambulance_name": "Ambulance-01",
      "distance_km": 5.2,
      "duration_minutes": 12,
      "eta_minutes": 12
    }
  ],
  "recommended_ambulance_id": 1
}
```

### Create Dispatch
```
POST /dispatch
Authorization: Bearer <token>
Content-Type: application/json

{
  "emergency_id": 1,
  "ambulance_id": 1,
  "hospital_name": "City Hospital",
  "hospital_location": "456 Park Ave",
  "hospital_latitude": 40.7700,
  "hospital_longitude": -73.9800
}

Response: 201 Created
{
  "id": 1,
  "emergency_id": 1,
  "ambulance_id": 1,
  "hospital_name": "City Hospital",
  "distance_km": 5.2,
  "estimated_time_minutes": 12,
  "whatsapp_status": "sent",
  "created_at": "2024-04-15T10:30:00"
}
```

### Get Dispatch Details
```
GET /dispatch/1
Authorization: Bearer <token>

Response: 200 OK
{ /* dispatch details */ }
```

### Update Dispatch Status
```
PUT /dispatch/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "at_scene"
}

Response: 200 OK
{ "message": "Status updated successfully" }
```

## Transcription Endpoints

### Process Audio File
```
POST /transcription/process
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <audio_file.mp3>

Response: 200 OK
{
  "patient_name": "John Doe",
  "location": "123 Main Street",
  "condition": "Severe chest pain",
  "priority": "critical",
  "description": "Patient is conscious...",
  "caller_name": "Jane Doe",
  "caller_phone": "+1234567890",
  "transcribed_text": "..."
}
```

## Priority Levels

- `low` - Non-emergency
- `medium` - Routine call
- `high` - Urgent assistance needed
- `critical` - Life-threatening emergency

## Status Codes

**Emergency Status:**
- `pending` - Waiting for dispatch
- `en_route` - Ambulance en route to patient
- `at_scene` - Ambulance at emergency location
- `resolved` - Emergency resolved

**Ambulance Status:**
- `available` - Ready for dispatch
- `en_route` - Heading to patient
- `at_scene` - At emergency location
- `returning` - Returning to base

## Rate Limiting

Currently no rate limiting in Phase 1. This will be added in Phase 2.

## Pagination

List endpoints support pagination:

```
GET /emergencies?skip=0&limit=10
```

- `skip` (default: 0) - Number of items to skip
- `limit` (default: 10) - Number of items to return (max: 100)

## Filtering

### Emergency Filters
- `status` - Filter by status
- `priority` - Filter by priority

### Ambulance Filters
- `status` - Filter by status

## Examples

### Complete Emergency Workflow

1. **Create Emergency**
```bash
curl -X POST http://localhost:8000/api/emergencies \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "John Doe",
    "location": "123 Main St",
    "condition": "Chest pain",
    "priority": "critical"
  }'
```

2. **Optimize Routes**
```bash
curl -X POST http://localhost:8000/api/dispatch/optimize \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "emergency_id": 1,
    "emergency_latitude": 40.7128,
    "emergency_longitude": -74.0060
  }'
```

3. **Create Dispatch**
```bash
curl -X POST http://localhost:8000/api/dispatch \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "emergency_id": 1,
    "ambulance_id": 1,
    "hospital_name": "City Hospital",
    "hospital_location": "456 Park Ave"
  }'
```

## Health Check

```
GET /health

Response: 200 OK
{ "status": "healthy" }
```

## Support

For API issues or questions:
1. Check this documentation
2. Visit Swagger UI: http://localhost:8000/api/docs
3. Create a GitHub issue with details

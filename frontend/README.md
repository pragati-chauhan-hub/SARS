# SARS (Smart Ambulance Routing System) - Frontend

Modern React-based frontend for the Smart Ambulance Routing System with real-time emergency management and ambulance dispatch features.

## Features

- 🚨 **Emergency Management** - Record and manage emergency calls with AI transcription
- 🚑 **Ambulance Fleet** - Real-time tracking and management of ambulances
- 🚀 **Smart Dispatch** - Route optimization with ETA calculation
- 💬 **WhatsApp Integration** - Automatic driver notifications
- 📍 **Live Tracking** - Real-time map visualization with TomTom Maps
- 🔐 **Authentication** - JWT-based user authentication
- 📱 **Responsive Design** - Mobile-friendly Material-UI components

## Tech Stack

- **React 18+** - UI library
- **Material-UI (MUI) 5** - Component library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility styling (optional)

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_TOMTOM_API_KEY=your_tomtom_api_key
   REACT_APP_ENV=development
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/
│   ├── Layout/              # Navigation, Sidebar, MainLayout
│   ├── Emergency/           # Emergency-related components
│   ├── Dispatch/            # Dispatch workflow components
│   ├── Map/                 # Map and route visualization
│   └── Common/              # Shared components
├── pages/                   # Page components
├── services/               # API services
├── context/                # React Context
├── hooks/                  # Custom hooks
├── utils/                  # Utilities and helpers
├── styles/                 # CSS files
└── App.js                  # Root component
```

## Available Pages

- **Dashboard** - Overview and quick stats
- **Emergencies** - Emergency management and audio upload
- **Ambulances** - Fleet management
- **Dispatch** - Intelligent ambulance routing
- **Live Tracking** - Real-time tracking dashboard
- **Settings** - User preferences

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000/api`.

### Key Endpoints Used:

- `POST /auth/login` - User authentication
- `GET /emergencies` - List emergencies
- `POST /emergencies` - Create emergency
- `GET /ambulances` - List ambulances
- `POST /dispatch/optimize` - Route optimization
- `POST /dispatch` - Create dispatch
- `POST /transcription/process` - Audio transcription

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```

Creates optimized production build in the `build/` directory.

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to hosting** (Vercel, Netlify, AWS S3, etc.)

3. **Update CORS settings** on backend for production URL

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

## License

MIT License - See LICENSE file

## Support

For issues and questions, please create an issue on GitHub.

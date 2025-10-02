# AI Helpdesk Dashboard

A comprehensive dashboard for analyzing AI helpdesk performance with Next.js frontend and FastAPI backend.

## Architecture

This is a monorepo containing:

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: FastAPI with Python for analytics and data processing
- **Shared**: Common types and utilities
- **Cache**: Redis for performance optimization

## Project Structure

```
ai-helpdesk-dashboard/
├── frontend/          # Next.js application
│   ├── app/          # App router pages and API routes
│   ├── components/   # React components
│   └── lib/          # Utilities and providers
├── backend/          # FastAPI application
│   ├── app/          # FastAPI app
│   │   ├── api/      # API routes
│   │   ├── core/     # Configuration and settings
│   │   ├── models/   # Pydantic models
│   │   └── services/ # Business logic
│   └── tests/        # Backend tests
├── shared/           # Shared types and constants
└── docker-compose.yml # Development environment
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Redis (optional, for caching)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/jeffkroon/ai-helpdesk-dashboard.git
   cd ai-helpdesk-dashboard
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Voiceflow API key and other settings
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API docs: http://localhost:8000/docs

### Docker Development

```bash
docker-compose up --build
```

## Features

### Frontend
- 📊 Interactive analytics dashboard
- 📈 Real-time charts and metrics
- 📋 Transcript management
- 🎯 Intent analysis
- 😊 Sentiment tracking
- 📤 Export functionality (CSV/PDF)

### Backend
- 🚀 FastAPI with automatic API documentation
- ⚡ Redis caching for performance
- 🔄 Voiceflow API integration
- 📊 Data processing and analytics
- 📄 Report generation

## API Endpoints

### Analytics
- `POST /api/analytics/overview` - Get overview metrics
- `POST /api/analytics/compare` - Compare periods
- `GET /api/analytics/transcripts` - Get transcripts
- `GET /api/analytics/intents` - Get top intents

### Export
- `POST /api/export` - Export reports (CSV/PDF)

## Environment Variables

```bash
# Voiceflow API
VOICEFLOW_API_KEY=your_api_key_here

# Backend URL (for frontend)
BACKEND_URL=http://localhost:8000

# Cache (optional)
REDIS_URL=redis://localhost:6379
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

## Deployment

### Production Build
```bash
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
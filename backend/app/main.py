from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import analytics, export
from app.core.config import settings

app = FastAPI(
    title="AI Helpdesk Dashboard API",
    description="Backend API for the AI Helpdesk Dashboard",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://ai-dashboard-frontend-zkuc.onrender.com",  # Production frontend
        "https://ai-helpdesk-dashboard-backend.onrender.com",  # Production backend
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(export.router, prefix="/api/export", tags=["export"])

@app.get("/")
@app.head("/")
async def root():
    return {"message": "AI Helpdesk Dashboard API"}

@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

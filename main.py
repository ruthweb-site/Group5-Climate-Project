from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.api import router as api_router
import uvicorn
import os

app = FastAPI(title="Carbon Emission Tracker API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(api_router, prefix="/api")

# Serve specific files at root for index.html convenience
@app.get("/")
async def get_index():
    return FileResponse("index.html")

@app.get("/styles.css")
async def get_styles():
    return FileResponse("styles.css")

@app.get("/app.js")
async def get_js():
    return FileResponse("app.js")

# General static mount (for icons, etc.)
app.mount("/static", StaticFiles(directory="."), name="static")

if __name__ == "__main__":
    print("Starting Carbon Emission Tracker on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

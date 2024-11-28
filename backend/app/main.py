from fastapi import FastAPI, Response
from pydantic import BaseModel
from contextlib import asynccontextmanager
from pathlib import Path
from data import read_history


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads or creates `history.json` that stores message history before API starts."""
    await read_history()
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/health")
async def health_check() -> Response:
    """Returns Healthy status message."""
    return Response(
            content=None,
            status_code=200,
            headers=None,
            media_type=None,
            background=None,
        )


@app.get("/messages/")
async def get_messages(skip: int = 0, limit: int = 10) -> Response:
    return {"skip": skip, "limit": limit}


@app.post("/chat")
async def health_check() -> Response:
    return {"output": "hello"}

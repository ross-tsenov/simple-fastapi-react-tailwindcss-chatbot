from contextlib import asynccontextmanager

from data import ChatRequest, ChatResponse
from fastapi import FastAPI, HTTPException, Response
from model import (
    ModelError,
    ModelNotFoundError,
    load_all_models,
    model_provider,
    unload_all_models,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads all models on startup, and then unloads on shutdown."""

    await load_all_models()
    yield
    await unload_all_models()


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


@app.post("/chat")
async def chat(chat_request: ChatRequest) -> ChatResponse:
    try:
        model = await model_provider(chat_request.model)
        response_message = await model.predict(chat_request.messages, chat_request.metadata)
    except ModelNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=f"Model named `{error.model_name}` does not exist please verify.",
        )
    except ModelError as error:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected model error, please verify your request body.",
        )
    return ChatResponse(
        message=response_message,
    )

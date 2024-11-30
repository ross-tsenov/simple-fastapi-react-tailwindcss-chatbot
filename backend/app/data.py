from typing import Any, Hashable, Literal

from pydantic import BaseModel, Field


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    model: str
    messages: list[Message] = Field(default_factory=list)
    metadata: dict[Hashable, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    message: Message

from __future__ import annotations

import json
import random
from pathlib import Path
from typing import Any, Hashable, Protocol

from data import Message

MODEL_REGISTRY: dict[str, LLMModel] = dict()


async def load_all_models() -> None:
    """Loads/Connects to all registered models."""

    for model in MODEL_REGISTRY.values():
        await model.load()


async def unload_all_models() -> None:
    """Unloads/Disconnects from all registered models."""

    for model in MODEL_REGISTRY.values():
        await model.unload()


async def model_provider(model_name: str) -> LLMModel:
    """Based on the provided `model_name` returns appropriate implementation."""

    if model_name not in MODEL_REGISTRY:
        raise ModelNotFoundError(model_name, f"{model_name} model does not exist.")

    return MODEL_REGISTRY[model_name]


class ModelError(Exception):
    """Base Model Exception Class."""

    def __init__(self, model_name: str, *args: object) -> None:
        super().__init__(*args)
        self.model_name: str = model_name


class ModelNotFoundError(ModelError):
    """Represents Error for accessing not existing model."""


class ModelNotLoadedError(ModelError):
    """Represents Error for using not loaded model."""


class LLMModel(Protocol):
    name: str
    is_loaded: bool

    async def load(self) -> None:
        """Will load model into memory or connect to the service/source."""

    async def unload(self) -> None:
        """Will unload model from the memmory or disconnect from the service/source."""

    async def predict(self, messages: list[Message], metadata: dict[Hashable, Any]) -> Message:
        """Will generate new message based on current message history and `metadata`."""


class FakeLLMModel:
    name: str = "fake_llm_model"

    def __init__(self, path_to_fake_responses: Path | None = None) -> None:
        self.path_to_fake_responses = (
            Path.cwd() / "misc" / "llm_responses.json" if path_to_fake_responses is None else path_to_fake_responses
        )
        self.is_loaded = False
        self.responses: list[str] = list()

    async def load(self) -> None:
        with open(self.path_to_fake_responses) as file:
            self.responses.extend(json.load(file))

        self.is_loaded = True

    async def unload(self) -> None:
        self.responses.clear()
        self.is_loaded = False

    async def predict(self, messages: list[Message], metadata: dict[Hashable, Any]) -> Message:
        if not self.is_loaded:
            raise ModelNotLoadedError(self.name, f"Model {self.name} was not loaded.")

        return Message(
            role="assistant",
            content=random.choice(self.responses),
        )


MODEL_REGISTRY[FakeLLMModel.name] = FakeLLMModel()

from __future__ import annotations

from pathlib import Path
from typing import Hashable, Any, TypedDict
import json


PATH_TO_HISTORY = Path(Path.cwd() / "history.json")
_history: dict[str, Any] = dict()


async def read_json_file(path_to_file: Path) -> dict[Hashable, Any]:
    """Reads json file."""
    with open(path_to_file) as json_file:
        data: dict[Hashable, Any] = json.load(json_file)

    return data


async def write_json_file(path_to_file: Path, data: dict[Hashable, Any]) -> None:
    """Writes json file."""
    with open(path_to_file, "w") as json_file:
        json.dump(data, json_file)


async def read_history() -> None:
    global _history
    if not PATH_TO_HISTORY.exists():
        await write_json_file(PATH_TO_HISTORY, _history)
        return

    _history = await read_json_file(PATH_TO_HISTORY)

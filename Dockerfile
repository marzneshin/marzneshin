FROM python:3.12-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --upgrade uv

CMD ["sh", "-c", "uv sync && uv run alembic upgrade head && uv run main.py"]

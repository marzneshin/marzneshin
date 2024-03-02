# Stage 1: Build Stage
FROM python:3.10-slim AS build

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN apt-get update -y --quiet \
    && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    make \
    gcc \
    g++ \
    python3-dev \
    && make dashboard-build \
    && pip install --no-cache-dir --upgrade -r /app/requirements.txt \  
    && make dashboard-cleanup

# Stage 2: Runtime Stage
FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY --from=build /app /app

RUN apt-get update -y --quiet \
    && apt-get install -y --no-install-recommends \
    nodejs \
    && apt-get clean -y \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

CMD ["make", "start"]

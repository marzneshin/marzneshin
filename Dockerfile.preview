FROM node:20-slim AS frontend-build

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install make git -y

RUN npm install -g pnpm

RUN make dashboard-deps && make dashboard-build

FROM python:3.12-slim AS run-backend

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY --from=frontend-build /app/dashboard/dist /app/dashboard/dist

COPY . /app

RUN apt-get update -y \
    && apt-get install make git gcc g++ python3-dev -y --no-install-recommends \
    && pip install --no-cache-dir -r /app/requirements.txt \  
    && apt-get clean -y \
    && apt-get remove g++ gcc python3-dev -y \
    && rm -rf /var/lib/apt/lists/* 

CMD ["make", "start"]

FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN apt-get update -y \
    && apt-get install npm -y --no-install --no-install-recommends \
    && make dashboard-build \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir --upgrade -r /app/requirements.txt

CMD ["make", "start"]

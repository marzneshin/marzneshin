FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN apt-get update -y \
    && apt-get install npm make gcc python3-dev -y --no-install-recommends \
    && make dashboard-build \
    && pip install --no-cache-dir --upgrade -r /app/requirements.txt \	
		&& apt-get clean -y \
		&& apt-get autoremove npm gcc python3-dev -y \
		&& make dashboard-cleanup \
		&& rm -rf /var/lib/apt/lists/* 

CMD ["make", "start"]

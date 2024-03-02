FROM python:3.10-slim                                                                                                                                      

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN apt-get update -y \
    && apt-get install nodejs npm make gcc g++ python3-dev -y --no-install-recommends \
    && make dashboard-build \
    && pip install --no-cache-dir -r /app/requirements.txt \  
    && apt-get clean -y \
    && apt-get autoremove g++ npm nodejs gcc python3-dev -y \
    && make dashboard-cleanup \
    && rm -rf /var/lib/apt/lists/* 

CMD ["make", "start"]

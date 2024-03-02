FROM python:3.10-slim                                                                                                                                      

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY . /app

RUN apt-get update -y \
    && apt-get install make gcc g++ python3-dev -y --no-install-recommends \
    && pip install --no-cache-dir -r /app/requirements.txt \  
    && apt-get clean -y \
    && apt-get autoremove g++ gcc python3-dev -y \
    && rm -rf /var/lib/apt/lists/* 

CMD ["make", "start"]

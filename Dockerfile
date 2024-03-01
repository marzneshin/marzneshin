FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y curl unzip gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*


COPY ./requirements.txt /app/
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app

RUN ln -s /app/marzban-cli.py /usr/bin/marzban-cli \
    && chmod +x /usr/bin/marzban-cli \
    && marzban-cli completion install --shell bash \
    && alembic upgrade head

CMD ["python main.py"]

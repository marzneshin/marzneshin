<h1 align="center"/>Marzneshin</h1>

<p align="center">
    An Scalable and Comprehensive Proxy Engine management panel.
</p>

<br/>
<p align="center">
    <a href="https://github.com/khodedawsh/Marzneshin/actions/workflows/dashboard-ci.yml">
        <img src="https://github.com/khodedawsh/Marzneshin/actions/workflows/dashboard-ci.yml/badge.svg" />
    </a>
    <a href="https://github.com/khodedawsh/Marzneshin/actions/workflows/package.yml" target="_blank">
        <img src="https://github.com/khodedawsh/Marzneshin/actions/workflows/package.yml/badge.svg" />
    </a>
    <a href="https://hub.docker.com/r/dawsh/marzneshin" target="_blank">
        <img src="https://img.shields.io/docker/pulls/dawsh/marzneshin?style=flat-square&logo=docker" />
    </a>
    <br>
    <a href="#">
        <img src="https://img.shields.io/github/license/khodedawsh/marzneshin?style=flat-square" />
    </a>
    <a href="https://t.me/marzneshins" target="_blank">
        <img src="https://img.shields.io/badge/telegram-group-blue?style=flat-square&logo=telegram" />
    </a>
    <a href="#">
        <img src="https://img.shields.io/badge/twitter-commiunity-blue?style=flat-square&logo=twitter" />
    </a>
    <a href="#">
        <img src="https://img.shields.io/github/stars/khodedawsh/marzneshin?style=social" />
    </a>
</p>

<p align="center">
  <a href="https://github.com/khodedawsh/marzneshin" target="_blank" rel="noopener noreferrer" >
    <img src="https://github.com/Gozargah/Marzban-docs/raw/master/screenshots/preview.png" alt="screenshots" width="600" height="auto">
  </a>
</p>

## Table of Contents

- [Overview](#overview)
	- [How it works](#how-it-works)
	- [Features](#features)
	- [Supported Languages](#supported-languages)
- [Installation guide](#installation-guide)
- [Configuration](#configuration)
- [API](#api)
- [Backup](#backup)
- [Telegram Bot](#telegram-bot)
- [Marzneshin CLI](#marzneshin-cli)
- [Marzneshin Node](#marzneshin-node)
- [Webhook notifications](#webhook-notifications)
- [Donation](#donation)
- [License](#license)
- [Contributors](#contributors)

# Overview

Marzneshin is an UI interface and system which enables managing
[nodes](https://github.com/khodedawsh/marznode), users and services,
hosts. Marzneshin distribute traffic between nodes without withhelding 
admins control over the porpotion and the balance of nodes traffic.

Dashboard enable access to nodes(configurations, status and stats, logs), 
hosts, users, services entites. While providing monitoring and system 
overview statistics.

On another hand, the system (backend) manages traffic distribution, v2ray
configurations, proxies and VPN backends, users subscription to proxies, etc. 

Marzneshin controls the [Marznodes](https://github.com/khodedawsh/marznode) 
connected to it; monitoring/disabling/enabling users on marznode instances while
marznode manages vpn backends (such as xray).

### Features

- **Web UI** Dashboard 
- **Multi Nodes** support for traffic distribution, scalability, and fault tolerance
- Supports protocols **Vmess**, **VLESS**, **Trojan** and **Shadowsocks**
- **Multi-protocol** for a single user
- Manage users' access to inbounds separately
- **Multi-user** on a single inbound
- Limit users' data and set exire dates
- reset traffic periodically (daily, weekly,...)
- **Subscription link** compatible with **V2ray** (e.g. V2RayNG, OneClick, Nekoray, etc.), **Clash** and **ClashMeta**
- Automated **Share link** and **QRcode** generator
- System, nodes, traffic statistics, users monitoring 
- Integrated **Telegram Bot**
- Integrated **Command Line Interface (CLI)**
- **Multi-admin** support (WIP)
- Marzneshin is decoupled from VPN backends
- Resilient and fault tolerance node management
- UI performance and redesign


Deployment and Developer Kit:
- REST-full API
- Kubernetes and multiple deployment strategy and options (WIP)

### Supported Languages
- Russian (WIP)
- English 
- Kurdish (Soranî, Kurmancî)
- Persian (WIP)

# Installation guide

Run the following command

```bash
sudo bash -c "$(curl -sL https://github.com/khodedawsh/Marzneshin/raw/master/script.sh)" @ install
```

Once the installation is complete:

- You'd notice the logs, which you could stop watching by pressing `Ctrl+C`; The process will continue running normally.
- the configuration file can be found at `/etc/opt/marzneshin/.env` (refer to [configurations](#configuration) section to see variables)
- Data files will be placed at `/var/lib/marzneshin`; e.g. the sqlite database.
- You can access the Marzneshin dashboard by opening a web browser and navigating to `http://<SERVER_IP>:8000/dashboard/`

Next, you need to create a sudo admin for logging into the Marzneshin dashboard by the following command

```bash
marzneshin cli admin create --sudo
```

That's it! You can login to your dashboard using these credentials

To see the help message of the Marzneshin script, run the following command

```bash
marzneshin --help
```

If you are eager to run the project using the source code, check the section below
<details markdown="1">
<summary><h3>Manual install (advanced)</h3></summary>

Install xray on your machine

You can install it using [Xray-install](https://github.com/XTLS/Xray-install)

```bash
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
```

Clone this project and install the dependencies (you'd need Python >= 3.10)

```bash
git clone https://github.com/khodedawsh/Marzneshin
cd Marzneshin/
wget -qO- https://bootstrap.pypa.io/get-pip.py | python3 -
python3 -m pip install -r requirements.txt
```

Alternatively, to have an isolated environment you can use [Python Virtualenv](https://pypi.org/project/virtualenv/)

Then run the following command to run the database migration scripts

```bash
alembic upgrade head
```

If you want to use `marzneshin-cli`, you should link it to a file in your `$PATH`, make it executable, and install the auto-completion:

```bash
sudo ln -s $(pwd)/marzneshin-cli.py /usr/bin/marzneshin-cli
sudo chmod +x /usr/bin/marzneshin-cli
marzneshin-cli completion install
```

Now it's time to configuration

Make a copy of `.env.example` file, take a look and edit it using a text editor like `nano`.

You probably like to modify the admin credentials.

```bash
cp .env.example .env
nano .env
```

> Check [configurations](#configuration) section for more information

Eventually, launch the application using command below

```bash
python3 main.py
```

To launch with linux systemctl (copy marzneshin.service file to `/var/lib/marzneshin/marzneshin.service`)

```
systemctl enable /var/lib/marzneshin/marzneshin.service
systemctl start marzneshin
```

To use with nginx

```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name  example.com;

    ssl_certificate      /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/live/example.com/privkey.pem;

    location ~* /(dashboard|api|docs|redoc|openapi.json) {
        proxy_pass http://0.0.0.0:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # xray-core ws-path: /
    # client ws-path: /marzneshin/me/2087
    #
    # All traffic is proxed through port 443, and send to the xray port(2087, 2088 etc.).
    # The '/marzneshin' in location regex path can changed any characters by yourself.
    #
    # /${path}/${username}/${xray-port}
    location ~* /marzneshin/.+/(.+)$ {
        proxy_redirect off;
        proxy_pass http://127.0.0.1:$1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

or

```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name  marzneshin.example.com;

    ssl_certificate      /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://0.0.0.0:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

By default the app will be run on `http://localhost:8000/dashboard`. You can configure it using changing the `UVICORN_HOST` and `UVICORN_PORT` environment variables.
</details>

# Configuration

> You can set settings below using environment variables or placing them in `.env` file.

| Variable                          | Description                                                                                           |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| SUDO_USERNAME                     | Superuser's username                                                                                  |
| SUDO_PASSWORD                     | Superuser's password                                                                                  |
| SQLALCHEMY_DATABASE_URL           | Database URL ([SQLAlchemy's docs](https://docs.sqlalchemy.org/en/20/core/engines.html#database-urls)) |
| UVICORN_HOST                      | Bind application to this host (default: `0.0.0.0`)                                                    |
| UVICORN_PORT                      | Bind application to this port (default: `8000`)                                                       |
| UVICORN_UDS                       | Bind application to a UNIX domain socket                                                              |
| UVICORN_SSL_CERTFILE              | SSL certificate file to have application on https                                                     |
| UVICORN_SSL_KEYFILE               | SSL key file to have application on https                                                             |
| XRAY_SUBSCRIPTION_URL_PREFIX      | Prefix of subscription URLs                                                                           |
| CUSTOM_TEMPLATES_DIRECTORY        | Customized templates directory (default: `app/templates`)                                             |
| CLASH_SUBSCRIPTION_TEMPLATE       | The template that will be used for generating clash configs (default: `clash/default.yml`)            |
| SUBSCRIPTION_PAGE_TEMPLATE        | The template used for generating subscription info page (default: `subscription/index.html`)          |
| HOME_PAGE_TEMPLATE                | Decoy page template (default: `home/index.html`)                                                      |
| TELEGRAM_API_TOKEN                | Telegram bot API token  (get token from [@botfather](https://t.me/botfather))                         |
| TELEGRAM_ADMIN_ID                 | Numeric Telegram ID of admin (use [@userinfobot](https://t.me/userinfobot) to found your ID)          |
| TELEGRAM_PROXY_URL                | Run Telegram Bot over proxy                                                                           |
| JWT_ACCESS_TOKEN_EXPIRE_MINUTES   | Expire time for the Access Tokens in minutes, `0` considered as infinite (default: `1440`)            |
| DOCS                              | Whether API documents should be available on `/docs` and `/redoc` or not (default: `False`)           |
| DEBUG                             | Debug mode for development (default: `False`)                                                         |
| WEBHOOK_ADDRESS                   | Webhook address to send notifications to. Webhook notifications will be sent if this value was set.   |
| WEBHOOK_SECRET                    | Webhook secret will be sent with each request as `x-webhook-secret` in the header (default: `None`)   |
| NUMBER_OF_RECURRENT_NOTIFICATIONS | How many times to retry if an error detected in sending a notification (default: `3`)                 |
| RECURRENT_NOTIFICATIONS_TIMEOUT   | Timeout between each retry if an error detected in sending a notification in seconds (default: `180`) |
| NOTIFY_REACHED_USAGE_PERCENT      | At which percentage of usage to send the warning notification (default: `80`)                         |
| NOTIFY_DAYS_LEFT                  | When to send warning notifaction about expiration (default: `3`)                                      |

# API

Marzneshin provides a REST API that enables developers to interact with Marzneshin services programmatically. To view the API documentation in Swagger UI or ReDoc, set the configuration variable `DOCS=True` and navigate to the `/docs` and `/redoc`.

# Backup

It's always a good idea to backup your Marzneshin files regularly to prevent data loss in case of system failures or accidental deletion. Here are the steps to backup Marzneshin:

1. By default, all Marzneshin important files are saved in `/var/lib/marzneshin` (Docker versions). Copy the entire `/var/lib/marzneshin` directory to a backup location of your choice, such as an external hard drive or cloud storage.
2. Additionally, make sure to backup your env file, which contains your configuration variables. If you installed Marzneshin using the script (recommended installation approach), the env and other configurations should be inside `/etc/opt/marzneshin/` directory.

By following these steps, you can ensure that you have a backup of all your Marzneshin files and data, as well as your configuration variables and Xray configuration, in case you need to restore them in the future. Remember to update your backups regularly to keep them up-to-date.

# Telegram Bot

Marzneshin comes with an integrated Telegram bot that can handle server management, user creation and removal, and send notifications. This bot can be easily enabled by following a few simple steps, and it provides a convenient way to interact with Marzneshin without having to log in to the server every time.

To enable Telegram Bot:

1. set `TELEGRAM_API_TOKEN` to your bot's API Token
2. set `TELEGRAM_ADMIN_ID` to your Telegram account's numeric ID, you can get your ID from [@userinfobot](https://t.me/userinfobot)

# Marzneshin CLI

Marzneshin comes with an integrated CLI named `marzneshin-cli` which allows administrators to have direct interaction with it.

If you've installed Marzneshin using the installation script, you can access the cli commands by running

```bash
marzneshin cli [OPTIONS] COMMAND [ARGS]...
```

For more information, You can read [Marzneshin CLI's documentation](./cli/README.md).

# marznode

[marznode](https://github.com/khodedawsh/marznode) is the backend needed to run proxy servers.

# Webhook notifications

You can set a webhook address and Marzneshin will send the notifications to that address.

the requests will be sent as a post request to the adress provided by `WEBHOOK_ADDRESS` with `WEBHOOK_SECRET` as `x-webhook-secret` in the headers.

Example request sent from Marzneshin:

```
Headers:
Host: 0.0.0.0:9000
User-Agent: python-requests/2.28.1
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
x-webhook-secret: something-very-very-secret
Content-Length: 107
Content-Type: application/json



Body:
{"username": "marzneshin_test_user", "action": "user_updated", "enqueued_at": 1680506457.636369, "tries": 0}
```

Different action typs are: `user_created`, `user_updated`, `user_deleted`, `user_limited`, `user_expired`, `user_disabled`, `user_enabled`

# Donation

If you found Marzneshin useful and would like to support its development, you can't make a donation in one of the following crypto networks:

- TRON network (TRC20):
- ETH, BNB, MATIC network (ERC20, BEP20):
- Bitcoin network:
- Dogecoin network:
- TON network: 

Thank you for your support!

# License

Made in [Unknown!] and Published under [AGPL-3.0](./LICENSE).

# Contributors

We ❤️‍🔥 contributors! If you'd like to contribute, please check out our [Contributing Guidelines](CONTRIBUTING.md) and feel free to submit a pull request or open an issue. We also welcome you to join our [Telegram](https://t.me/marzneshins) group for either support or contributing guidance.

Check [open issues](https://github.com/khodedawsh/marzneshin/issues) to help the progress of this project.

<p align="center">
Thanks to the all contributors who have helped Marzneshin:
</p>
<p align="center">
<a href="https://github.com/khodedawsh/marzneshin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=khodedawsh/marzneshin" />
</a>
</p>
<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

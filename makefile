
start:
	alembic upgrade
	python main.py

dashboard-build:
	sh ./tools/dashboard-build.sh

dashboard-dev:
	sh ./tools/dashboard-run-dev.sh
	python ./main.py

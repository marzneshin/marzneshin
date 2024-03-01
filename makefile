
start:
	alembic upgrade head
	python main.py

dashboard-build:
	cd app/dashboard/
	npm install --prefix './app/dashboard'
	VITE_BASE_API=/api/ npm run build --prefix './app/dashboard' --if-present -- --outDir dist --base '/dashboard/'
	ls
	cp ./app/dashboard/dist/index.html ./app/dashboard/dist/404.html

dashboard-dev:
	npm run dev \
    	-- --host 0.0.0.0 \
    	--base ../app/dashboard/ \
    	--clearScreen false

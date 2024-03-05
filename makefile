
start:
	alembic upgrade head
	python main.py

install-deps:
	npm install --prefix './app/dashboard'

dashboard-build: install-deps
	VITE_BASE_API=/api/ npm run build --prefix './app/dashboard' --if-present -- --outDir dist 
	cp ./app/dashboard/dist/index.html ./app/dashboard/dist/404.html

dashboard-dev:
	VITE_BASE_API=http://0.0.0.0:8000/api/ npm run dev \
		--prefix './app/dashboard/' \
    	-- --host 0.0.0.0 \
    	--base ./app/dashboard/ \
    	--clearScreen false

dashboard-preview:
	VITE_BASE_API=http://0.0.0.0:8000/api/ npm run preview \
		--prefix './app/dashboard/' \
    	-- --host 0.0.0.0 \
    	--base ./app/dashboard/ \
    	--clearScreen false


dashboard-cleanup:
	rm -rf app/dashboard/node_modules/

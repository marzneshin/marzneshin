
start:
	alembic upgrade head
	python main.py

dashboard-deps:
	pnpm install --prefix ./dashboard

dashboard-build:
	cd dashboard; VITE_BASE_API=/api/ npm run build --if-present -- --outDir 'dist' --assetsDir 'static'

dashboard-dev:
	VITE_BASE_API=http://0.0.0.0:8000/api/ npm run dev \
		--prefix './dashboard/' \
    	-- --host 0.0.0.0 \
    	--base /dashboard \
    	--clearScreen false

dashboard-preview:
	VITE_BASE_API=http://0.0.0.0:8000/api/ npm run preview \
		--prefix './dashboard/' \
    	-- --host 0.0.0.0 \
    	--base /dashboard \
    	--clearScreen false

dashboard-cleanup:
	rm -rf ./dashboard/node_modules/

cd `dirname $0`/app/dashboard
VITE_BASE_API=/api/ npm run build --if-present -- --outDir dist --base '/dashboard/'
cp ./dist/index.html ./dist/404.html

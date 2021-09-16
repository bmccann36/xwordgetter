
## run lambda docker and expose on port
docker run -p 9000:8080 \
--env-file .env \
serverless-x-word-getter-dev:appimage 

## test with REST api call
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'


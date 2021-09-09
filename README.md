
## run lambda docker and expose on port
docker run -p 9000:8080 \
-e PUZZLE_DATE_OVERRIDE='2021/09/03' \
xword:latest dist/handler2.Handler

## test with REST api call
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'


#!/bin/sh

echo '[PUSH]';
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";

docker push multicycles/front &
docker push multicycles/app-server &
docker push multicycles/developer &
docker push multicycles/status &

wait

#!/bin/sh

echo '[PUSH]';
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";

docker push multicycles/api &
docker push multicycles/front &
docker push multicycles/developer &
docker push multicycles/status &

wait

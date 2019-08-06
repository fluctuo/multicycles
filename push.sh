#!/bin/sh

echo '[PUSH]';

GIT_TAG=$(git log -1 --pretty=%h)
TAG=${1:-$GIT_TAG}

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";

docker push multicycles/front &
docker push multicycles/app-server &
docker push multicycles/status &

wait

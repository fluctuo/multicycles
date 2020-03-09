#!/bin/sh

echo '[BUILD]';

GIT_TAG=$(git log -1 --pretty=%h)
TAG=${1:-$GIT_TAG}

IMAGEID=$(docker build -q -t multicycles/front:$TAG app/front) && docker tag multicycles/front:$TAG multicycles/front:latest && echo "multicycles/front:$TAG - $IMAGEID"  &
IMAGEID=$(docker build -q -t multicycles/app-server:$TAG app/server) && docker tag multicycles/app-server:$TAG multicycles/app-server:latest && echo "multicycles/app-server:$TAG - $IMAGEID"  &

wait

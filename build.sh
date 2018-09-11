#!/bin/sh

echo '[BUILD]';

TAG=$(git log -1 --pretty=%h)

IMAGEID=$(docker build -q -t multicycles/api:$TAG api) && docker tag multicycles/api:$TAG multicycles/api:latest && echo "multicycles/api:$TAG - $IMAGEID" &
IMAGEID=$(docker build -q -t multicycles/front:$TAG front) && docker tag multicycles/front:$TAG multicycles/front:latest && echo "multicycles/front:$TAG - $IMAGEID"  &
IMAGEID=$(docker build -q -t multicycles/developer:$TAG developer) && docker tag multicycles/developer:$TAG multicycles/developer:latest && echo "multicycles/developer:$TAG - $IMAGEID"  &
IMAGEID=$(docker build -q -t multicycles/status:$TAG status) && docker tag multicycles/status:$TAG multicycles/status:latest && echo "multicycles/status:$TAG - $IMAGEID"  &

wait

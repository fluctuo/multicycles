#!/bin/sh

echo '[BUILD]';

IMAGEID=$(docker build -q -t multicycles/api api) && echo "api image id: $IMAGEID" &
IMAGEID=$(docker build -q -t multicycles/front front) && echo "front image id: $IMAGEID"  &
IMAGEID=$(docker build -q -t multicycles/developer developer) && echo "developer image id: $IMAGEID"  &
IMAGEID=$(docker build -q -t multicycles/status status) && echo "status image id: $IMAGEID" &

wait

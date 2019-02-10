#!/bin/bash

cp -r build dist

cat hosts | while read h
do
    echo $h
    rsync -a dist/* $h:temperature-monitor
    ssh -n $h sudo systemctl restart temperature-monitor
    echo "Done $h"
done

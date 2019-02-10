#!/bin/bash

if [ ! -f ~/.temperature-monitor.config ]; then
    read -p "Location: " location
    sed -e "s/{location}/$location/g" .temperature-monitor.config | tee $HOME/.temperature-monitor.config
fi

sed -e "s/\$USER/$USER/g" temperature-monitor.service | sudo tee /etc/systemd/system/temperature-monitor.service

sudo systemctl enable temperature-monitor.service
sudo systemctl start temperature-monitor.service

#!/bin/bash
mkdir ./.tmp
mkdir ./data
mkdir ./data/statics
mkdir ./data/statics/public
mkdir ./data/statics/public/users
chown -R :www-data ./.tmp
chown -R :www-data ./data
sudo chmod -R g+w ./data
sudo chmod -R g+w ./.tmp

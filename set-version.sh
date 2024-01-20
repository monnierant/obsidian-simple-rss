#!/bin/bash

sed -i "s/\"version\": .*/\"version\": \"$1\",/" manifest.json package.json

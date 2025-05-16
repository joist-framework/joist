#!/bin/bash

npm version minor
npm version minor -w packages/
npm publish -w packages/ --tag latest
git add -A && git commit -m"$(node -p "require('./package.json').version")"
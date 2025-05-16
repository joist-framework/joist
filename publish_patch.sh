#!/bin/bash

npm version patch
npm version patch -w packages/
npm publish -w packages/ --tag latest
git add -A && git commit -m"$(node -p "require('./package.json').version")"
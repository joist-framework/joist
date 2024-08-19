#!/bin/bash

npm version prerelease --preid rc
npm version prerelease -w packages/ --preid rc
npm publish -w packages/ --tag rc
git add -A && git commit -m"$(node -p "require('./package.json').version")"
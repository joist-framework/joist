#!/bin/bash

npm version prerelease --preid next
npm version prerelease -w packages/ --preid next
npm publish -w packages/ --tag next
git add -A && git commit -m"$(node -p "require('./package.json').version")"
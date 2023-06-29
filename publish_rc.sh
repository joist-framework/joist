#!/bin/bash

npm version prerelease --preid rc
npm version prerelease --workspaces --preid rc
npm publish --workspaces --tag rc
git add -A && git commit -m"$(node -p "require('./package.json').version")"
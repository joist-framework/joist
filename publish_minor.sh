#!/bin/bash

npm version minor
npm version minor --workspaces
npm publish --workspaces
git add -A && git commit -m"$(node -p "require('./package.json').version")"
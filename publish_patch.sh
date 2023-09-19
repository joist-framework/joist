#!/bin/bash

npm version patch
npm version patch --workspaces
npm publish --workspaces --tag latest
git add -A && git commit -m"$(node -p "require('./package.json').version")"
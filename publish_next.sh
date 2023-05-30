#!/bin/bash

npm version prerelease --preid next
npm version prerelease --workspaces --preid next
npm publish --workspaces --tag next
git add -A && git commit -m"$(node -p "require('./package.json').version")"
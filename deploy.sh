#!/bin/bash

# Destroy gh-pages branch
git branch -D gh-pages

# Recreate it
git checkout -B gh-pages

# Build the new project for production
npm run build

git add -f build
git commit -am "Rebuild website"
git filter-branch -f --prune-empty --subdirectory-filter build
git push -f origin gh-pages
git checkout -

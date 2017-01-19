#!/bin/bash

# Destroy gh-pages branch
git branch -D gh-pages

# Recreate it
git checkout -B gh-pages

# Build the new project for production, based on :
# https://github.com/facebookincubator/create-react-app/blob/dcdcab0ecc86d9643bc9c3c9a9eee8bbad63bb43/template/README.md#github-pages
# & https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment

npm run build

git add -f build
git commit -am "Rebuild website"
git filter-branch -f --prune-empty --subdirectory-filter build
git push -f origin gh-pages
git checkout -

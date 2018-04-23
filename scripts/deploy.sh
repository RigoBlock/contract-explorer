#!/bin/bash
cd ../src
echo "Removing debug logs..."
find ./ -type f | xargs sed -i -E 's/^\s*console.(log|debug|info|)\((.*)\);?//gm'
echo "Setting app to production environment.."
cd ..
echo "Building app..."
echo "yarn build"
yarn build-beta
echo "Done."
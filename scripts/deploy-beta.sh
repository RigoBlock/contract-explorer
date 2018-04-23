#!/bin/bash
CWD=$(pwd)
DEST_DIR=/home/rigoblock/html/beta.endpoint.network/app/
# DEST_DIR=/home/rigoblock/html/beta.rigoblock.com/app/
if [ ! -d "$DEST_DIR" ]; then
  echo "Destination build directory does not exist. Exiting."
  exit 1
fi
echo "Deleting previous build..."
cd $DEST_DIR && rm -rf *
echo "Copying file to build directory..."
cp -Rp $CWD/. $DEST_DIR
echo "Deleting previous build..."
cd src
echo "Removing debug logs..."
find ./ -type f | xargs sed -i -E 's/^\s*console.(log|debug|info|)\((.*)\);?//gm'
cd ..
echo "Building app..."
echo "yarn build-beta"
yarn build-beta
echo "Done."
cd $CWD


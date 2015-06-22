#!/bin/bash
set -e
npm install
cd api
npm install
cd ..
node_modules/gulp/bin/gulp.js $1

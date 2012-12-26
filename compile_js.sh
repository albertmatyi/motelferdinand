#!/bin/bash -x
cd ./application/static/js
nodejs /usr/local/lib/node_modules/requirejs/bin/r.js -o ./compile_js.js
mv ../js-build/main.js ./main.min.js
#rm ../js-build -R

#!/bin/bash -x
cd ./application/static/js
rm ./main.min.js
rm ./main.admin.min.js
nodejs /usr/local/lib/node_modules/requirejs/bin/r.js -o ./compile_js.js
mv ../js-build/js/main.js ./main.min.js
rm ../js-build -R

nodejs /usr/local/lib/node_modules/requirejs/bin/r.js -o ./compile_admin_js.js
mv ../js-build/js/main.admin.js ./main.admin.min.js
rm ../js-build -R

# RESULTS
ls -alF | grep min


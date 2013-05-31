#!/bin/bash
./compile_css.sh &&\
./compile_js.sh &&\
git add . &&\
git commit -a &&\
git push origin master &&\
appcfg.py --oauth2 update .

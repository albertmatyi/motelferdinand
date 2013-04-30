#!/bin/bash
cat /dev/null > ./server.log
~/progz/sdks/google_appengine_1.7.4/dev_appserver.py \
	--debug \
	. &> ./server.log

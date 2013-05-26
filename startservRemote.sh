#!/bin/bash
cat /dev/null > ./server.log
~/progz/sdks/google_appengine_1.7.7/dev_appserver.py \
	--host 0.0.0.0 \
	--log_level debug \
	--storage_path ./remote \
	--enable_sendmail True \
	--port 8080 \
	. &> ./server.log

#!/bin/bash -x
cat /dev/null > ./server.log
python2 ~/progz/sdks/google_appengine_1.8.0/dev_appserver.py \
	--host 0.0.0.0 \
	--log_level debug \
	--storage_path ./local/ \
	--enable_sendmail False \
	--show_mail_body True \
	--port 8080 \
	. &> ./server.log

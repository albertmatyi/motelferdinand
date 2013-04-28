#!/bin/bash
cat /dev/null > ./server.log
dev_appserver.py \
	--host 0.0.0.0 \
	--log_level debug \
	--storage_path ./remote \
	--enable_sendmail True \
	--port 8080 \
	. &> ./server.log

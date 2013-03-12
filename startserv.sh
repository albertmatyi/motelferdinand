#!/bin/bash
dev_appserver.py \
	--debug \
	--datastore_path=GAElocal/db/ \
	--use_sqlite \
	--enable_sendmail \
	--high_replication \
	--address=0.0.0.0 \
	.

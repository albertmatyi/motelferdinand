#!/bin/bash
echo $'\n' | appcfg.py --url=http://localhost:8080/_ah/remote_api \
	--oauth2 \
	--filename="$1" \
	--email=test@example.com\
	--passin\
	upload_data
mv bulkloader* ./bulk/trash/
#	--kind=CategoryModel \

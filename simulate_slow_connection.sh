#!/bin/bash -x
if [ "$1" != '' ]; then
	iprelay "-b$1000" 8081:localhost:8080
else
	iprelay -b25000 8081:localhost:8080
fi



#!/bin/bash
if [ "$1" != "" ]; then
	find ./application/static/js/ -name "$1.js" -print0 | xargs -0 jshint
else
	find ./application/static/js/ -name "*.js" -print0 | xargs -0 jshint
fi

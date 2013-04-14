#!/bin/bash -x

# For SCSS compilation (get Ruby and its package manager)

# Install ruby 
sudo apt-get install ruby-full build-essential rubygems

# Install sass
sudo gem install sass

# For require.js compilation (get nodeJS and its package manager)

sudo apt-get install npm

sudo npm install jslint

sudo npm install requirejs

sudo mv ./node_modules /usr/local/lib

sudo ln -s /usr/bin/nodejs /usr/bin/node

sudo ln -s /usr/local/lib/node_modules/jslint/bin/jslint.js /usr/bin/jslint

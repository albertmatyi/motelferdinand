#!/bin/bash -x
# shell-expansion to loop specified files
for file in ./application/static/lib/*/*.css; do

    # replace 'temps' with 'new_folder' in the path
    # '/home/temps/abc/thumb.png' becomes '/home/new_folder/abc/thumb.png'
    new_file=${file/\.css/.scss};

    # drop '/thumb' from the path
    # '/home/new_folder/abc/thumb.png' becomes '/home/new_folder/abc.png'
    cp -f "$file" "$new_file";
done;
for file in ./application/static/lib/*/*/*.css; do

    # replace 'temps' with 'new_folder' in the path
    # '/home/temps/abc/thumb.png' becomes '/home/new_folder/abc/thumb.png'
    new_file=${file/\.css/.scss};

    # drop '/thumb' from the path
    # '/home/new_folder/abc/thumb.png' becomes '/home/new_folder/abc.png'
    cp -f "$file" "$new_file";
done;
cp -fv ./application/static/lib/bootstrap/img/* ././application/static/img/

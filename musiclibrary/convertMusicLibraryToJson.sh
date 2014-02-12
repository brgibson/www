#!/bin/sh                                                                                                                                                              

mac2unix $1

#remove the first and last line of the input file (these lines don't contain music library data)
sed '1,1d; $d' $1 > tmpFile

#replace all double quotes with single quotes (so we don't break our JSON)
tr '"' "'" < tmpFile > tmpFile1 

#replace Artist<tab>Album with ["Artist","Album"] and removes duplicates
sed 's/\([^\t]*\)\t*\(.*\)/["\1","\2"],/' tmpFile1 | uniq -i > tmpFile2

#remove the comma at the end of the last line
sed '$s/,$//' tmpFile2 > tmpFile3 

#remove all newline characters
tr -d '\n' < tmpFile3 > tmpFile4

#create the output json file
echo "var musicLibrary = [" > MusicLibrary.json
cat tmpFile4 >> MusicLibrary.json
echo "\n];\n" >> MusicLibrary.json

#remove the tmp files
rm tmpFile*
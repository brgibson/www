#!/bin/sh                                                                                                                                                              

mac2unix $1


tr '"' "'" < $1 > tmpFile
sed 's/\([^\t]*\)\t*\(.*\)/["\1","\2"],/' -u tmpFile | uniq -i > tmpFile2
tr -d '\n' < tmpFile2 > tmpFile3

echo "var musicLibrary = [" > MusicLibrary.json
cat tmpFile3 >> MusicLibrary.json
echo "\n];\n" >> MusicLibrary.json

rm tmpFile*
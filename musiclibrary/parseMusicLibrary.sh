#!/bin/sh                                                                                                                                                              

mac2unix $1
sed 's/[^\t]*\t\([^\t]*\)\t[^\t]*\t\([^\t]*\).*/\1\t\t\2/' -u $1 | uniq -i > MusicLibrary.txt

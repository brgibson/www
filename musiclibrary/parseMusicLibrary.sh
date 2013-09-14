#!/bin/sh                                                                                                                                                              

mac2unix $1

echo "<ol>" > MusicLibraryInclude.html
sed 's/[^\t]*\t\([^\t]*\)\t[^\t]*\t\([^\t]*\).*/<li><r>\1<\/r>\2<\/li>/' -u $1 | uniq -i >> MusicLibraryInclude.html
echo "</ol>" >> MusicLibraryInclude.html
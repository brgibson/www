#!/bin/bash 

curl --cookie cjar --cookie-jar cjar --form Username=$gladiatoruser --form password=$gladiatorpass --form login=Login http://www.gladiatortennis.com/login2.php --output /dev/null

curl --cookie cjar --cookie-jar cjar --data "prevSelectedGender=M&gender=M&prevSelectedYear=6&year=6&prevSelectedSeries=0&series=0&prevSelectedSeason=26&season=26&prevSelectedDivision=-Select-&division=1026" http://www.gladiatortennis.com/members/standings.php | grep Ben > standings.html

perl -pe 's|(\<table.+?\>(.+?)\<\/table\>){2}|var playerStats = [\n\2];\n|g' standings.html > standings10.txt
perl -pe 's|\<tr\>.+?\<\/tr\>((\<tr\>.+?\<\/tr\>){8})|\1|g' standings10.txt > standings9.txt
perl -pe 's|((\<tr\>.+?\<\/tr\>){7})(\<tr\>(.+?)\<\/tr\>)|\1\t{\n\4\t}\n|g' standings9.txt > standings8.txt
perl -pe 's|\<tr\>(.+?)\<\/tr\>|\t{\n\1\t},\n\n|g' standings8.txt > standings1.txt

perl -pe 's|((\<td.*?\>.+?\<\/td\>){8})\<td.*?\>(.+?)\<\/td\>\<td.*?\>(.+?)\<\/td\>|\1\t\t\],\n\t\t"totalPoints": \3,\n\t\t"rating": \4\n|g' standings1.txt > standings2.txt

perl -pe 's|((\<td.*?\>.+?\<\/td\>){7})\<td.*?\>(.+?)\<\/td\>|\1\nnocomma:\3\n|g' standings2.txt > standings25.txt
perl -pe 's|\<td.*?\>(.+?)\<\/td\>|\1\n|g' standings25.txt > standings3.txt

perl -pe 's|([0-9])\.\s(.*)|\t\t"playerId": \1,\n\t\t"playerName": "${2}",\n\t\t"matches": \[|g' standings3.txt > standings4.txt

perl -pe 's|nocomma.*vs\s([0-9])\<br\>(.*)\<br\>(.*)|\t\t\t{\n\t\t\t\t"opponent": \1,\n\t\t\t\t"scores": "${2}",\n\t\t\t\t"points": ${3}\n\t\t\t}|g' standings4.txt > standings45.txt
perl -pe 's|.*vs\s([0-9])\<br\>(.*)\<br\>(.*)|\t\t\t{\n\t\t\t\t"opponent": \1,\n\t\t\t\t"scores": "${2}",\n\t\t\t\t"points": ${3}\n\t\t\t},|g' standings45.txt > playerStats.js

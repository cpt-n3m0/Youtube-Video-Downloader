
echo "$1" "$2" 
curl "$1" -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0' -H 'Accept: */*' -H 'Accept-Language: en-GB,en;q=0.5' --compressed -H 'Referer: https://www.youtube.com/' -H 'Origin: https://www.youtube.com' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Sec-GPC: 1' > vid.temp
echo Downloading audio file
curl "$2" -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0' -H 'Accept: */*' -H 'Accept-Language: en-GB,en;q=0.5' --compressed -H 'Referer: https://www.youtube.com/' -H 'Origin: https://www.youtube.com' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Sec-GPC: 1' > audio.temp

ffmpeg -i vid.temp -i audio.temp -c:v copy -c:a aac output.mkv

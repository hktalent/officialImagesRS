# echo "xx$1ddd"
curl -s -H "Content-Type: application/json" -H "Connection: close" -H "Accept-Language: en-US,en;q=0.5" -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0" -H "Accept: application/json" -H "Search-Version: v3" -k -o- "https://hub.docker.com/api/content/v1/products/search?image_filter=&page_size=86609680&q=$1&type=image"|jq > 01-index/$1_Images.json


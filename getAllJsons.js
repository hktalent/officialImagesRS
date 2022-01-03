var http = require('https'),fs = require('fs');
var g_aData = JSON.parse(fs.readFileSync("officialImages.json")).summaries;


// curl -s -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0" -H "Accept: application/json" -H "Search-Version: v3" -k -o- 'https://hub.docker.com/api/content/v1/products/search?image_filter=official&page_size=8660785&q=&type=image'|jq > officialImages.json

// https 获取数据
function getData(option,data,fnCbk)
{
	const req = http.request(option, res => {
	  // console.log(`statusCode: ${res.statusCode}`)
	  var aD = [];
	  res.on('data', d => {
	  	aD.push(d);
	    // process.stdout.write(d)
	  });
	  res.on('end', function(){
	  	fnCbk(aD.join(''))
	  });
	});
	if(data)req.write(data);
	req.end();
}

var g_aUrls = ['/v2/repositories/library/elasticsearch/tags/?page_size=2000&page=1']

var g_aT1 = [];
// 获取指定产品所有tags的信息数据
function fnDoOne(szTag)
{
    // console.log(JSON.stringify(data))
    var option = {hostname: 'hub.docker.com',
    port: 443,
    path: '/v2/repositories/library/' + szTag + '/tags/?page_size=2000&page=1',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
      'Connection': 'close'
    }};

    if(!fs.existsSync(szTag + '.json'))
    {
        getData(option,0,function(szData){
            fs.writeFileSync(szTag + '.json',szData);
            console.log(szTag + " is ok")
            if(szTag = g_aT1.pop())
            setTimeout(function(){
                fnDoOne(szTag)
            },3);
        });
    }
    else
    {
        if(szTag = g_aT1.pop())
        var xxN = setTimeout(function(){
            clearTimeout(xxN);
            fnDoOne(szTag)
        },1);
        
    }
}


// 获取所有官方docker tags
function fnGetAllJson2()
{
    for(var k in g_aData)
    {
        var x = g_aData[k];
        if('Docker' == x.publisher.name || /Official/gmi.test(x.short_description))
        {
            g_aT1.push(x.slug);
            // console.log(x.name);
        }
    }
    fnDoOne(g_aT1.pop())
}

// fnGetAllJson2()
// 获取指定产品docker的脆弱信息
function getVuls4One(szTag,data,aTmp009)
{
    // console.log(JSON.stringify(data))
    var option = {hostname: 'hub.docker.com',
    port: 443,
    path: '/api/scan/v1/reports/snyk/docker.io/library/' + szTag,
    method: 'POST',
    headers: {
      'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0) Gecko/20100101 Firefox/95.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'X-DOCKER-API-CLIENT': 'docker-hub/1257.0.0',
      'Origin': 'https://hub.docker.com',
      'Connection': 'close',
      'Referer': 'https://hub.docker.com/_/' + szTag + '?tab=tags&page=1'
    }};
    var szFlNm1 = "vuls/" + szTag + '.json';

    if(!fs.existsSync(szFlNm1))
    {
        getData(option,JSON.stringify(data),function(szData){
            fs.writeFileSync( szFlNm1, szData);
            console.log(szTag + " is ok")
            if(a = aTmp009.pop())
            var xxN = setTimeout(function(){
                clearTimeout(xxN);
                getVuls4One(a[0],a[1],aTmp009);
            },1);
        });
    }
    else
    {
        if(a = aTmp009.pop())
        var xxN = setTimeout(function(){
            clearTimeout(xxN);
            getVuls4One(a[0],a[1],aTmp009);
        },1);
    }
}
function fnGetDir(s,fnF)
{
    var k = fs.readdirSync(s),aR = [];
    // console.log(k)
    for(var i = 0; i < k.length;i++)
    {
        if(fnF(k[i]))
        aR.push(k[i])
    }
    return aR;
}

function getVulsInfo()
{
    var a = fnGetDir(".", function(x){return /\.json$/gmi.test(x)});
    var aTmp009 = [],nCnt = 0;
    console.log("docker scan --login --token 1d0e5ffb-8d5f-452a-ab64-a40dbc14c376")
    console.log("docker login -u hktalent -p mixki0-zifgen-gimbiH");
    for(var i = 0; i < a.length;i++)
    {
        // console.log(a[i])
        var o = JSON.parse(fs.readFileSync(a[i])).results;
        // console.log(o)
        if(!o || 0 == o.length)continue;
        var oQ = {"digests":[]};
        szName = a[i].replace(/\.json$/gmi,'');
        for(var x = 0; x < o.length; x++)
        {   
            console.log("docker scan " + szName + ":" + o[x].name + " >scanRst/" + szName + "_" + o[x].name+".txt")
            var w = o[x].images;
            for(var j = 0; j < w.length; j++)
            {
                nCnt++;
                oQ.digests.push(w[j].digest);
            }
        }
        aTmp009.push([szName,oQ])
    }
    a = aTmp009.pop()
    // getVuls4One(a[0],a[1],aTmp009);
    // console.log(nCnt)
}

getVulsInfo();

var g_aObj = {};
//  通过id和产品明，获取具体版本信息
function getTagsById(s,szTag)
{
    var szRsr = 'latest'
    // console.log(szTag)
    if(!g_aObj[szTag])
        g_aObj[szTag] = JSON.parse(fs.readFileSync(szTag));
    var o = g_aObj[szTag].results;
    for(var i = 0; i < o.length; i++)
    {
        for(var j = 0; j < o[i].images.length; j++)
        {
            if(s == o[i].images[j].digest)
            {
                szRsr = o[i].name;// 不能break，不然信息不全对
            }
        }
    }
    return szRsr
}

// 提取出有脆弱的产品及颁布信息
function getVuls()
{
    var nCnt = 0;
    a = fs.readdirSync("vuls");
    for(var i in a)
    {
        if(/\.json$/gmi.test(a[i]))
        {
            var szFlNm1 = a[i],bHv = false;
            // console.log(szFlNm1)
            o = JSON.parse(fs.readFileSync("vuls/" + szFlNm1)).Reports;
            for(var k in o)
            {
                var x = o[k];
                if(x['highlights'])
                {
                    var aT = [x.repo,getTagsById(x.digest,szFlNm1)];

                    for(var i in x.highlights)
                    {
                        if(/^vulnerable$/gmi.test(x.highlights[i]))
                            bHv = true,aT.push(i);
                    }
                    if(bHv)console.log(aT.join('\t'))
                }
            }
            if(bHv)nCnt++;
        }
    }
    // console.log(nCnt);
}
// 在线提取脆弱性信息
// getVuls();

// severity vulnerability found in 
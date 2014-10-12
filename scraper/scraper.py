#!/usr/bin/env python

from lxml import html
import requests
import json
from progressbar import *
import thread
import threading
import time
import datetime
from pymongo import MongoClient

def cleanNation(n):
    stabilities = {"Brink of Collapse": -5, "Mass Protests": -4, "Rioting": -3, "Chaotic": -2, "Growing Tensions": -1, "Seemingly Calm": 1, "Quiet": 2, "Very Stable": 3, "Entrenched": 4, "Unsinkable": 5}
    
    n["Territory"] = int(n["Territory"].split(' ')[0])
    if n["Discovered Oil Reserves"][:-5] != "":
        n["Discovered Oil Reserves"] = int(n["Discovered Oil Reserves"][:-5])
    else:
        n["Discovered Oil Reserves"] = 0
    n["Gross Domestic Product"] = int(n["Gross Domestic Product"][1:-8])
    n["Last Online"] = int(0 if n["Last Online"] == "online now" else n["Last Online"][12:-10])
    n["Army Size"] = int(n["Army Size"][:-18])
    n["Official Alignment"] = n["Official Alignment"][:-1]
    if n["Oil Production"][:-15] != "":
        n["Oil Production"] = int(n["Oil Production"][:-15])
    else:
        n["Oil Production"] = 0
    n["Growth"] = int(n["Growth"][1:-18])
    n["Raw Material Production"] = int(n["Raw Material Production"][:-24])
    n["Stability"] = stabilities[n["Stability"]]
    n["Updated"] = datetime.datetime.utcnow()
    n.pop("Progress to next equipment level", None)
    n.pop("Oil Supply", None)
    n.pop("Intelligence Agency", None)
    n.pop("Raw Material", None)
    n.pop("Chemical Weapons", None)
    return n

def nation(id):
    page = requests.get('http://blocgame.com/stats.php?id=%s' % str(id))
    tree = html.fromstring(page.text)
    if len(tree.xpath('//div[@class="well"]')) == 0:
        n = {"_id": int(id)}
        n["Nation"] = tree.xpath('//p[@id="nationtitle"]/b')[0].text
        l = tree.xpath('//i[@class="lead"]/b')
        ld = tree.xpath('//font[@color="blue"]/text()')
        n["Leader"] = l[0].text if len(ld) == 0 else ld[0]
        n["Donator"] = len(ld) == 1
        n["Last Online"] = tree.xpath('//font[@size="2"]')[0].text
        stats = tree.xpath('//div[@class="accordion-group"]//tr')
        for i in stats:
            if i[0].text == None:
                continue
            k = str(i[0].text)[:-1]
            v = i[1]
            if k == "Reactor":
                p = v[0][0][0].get("style")[7:]
                n[k] = p
                continue
            if v[0].text == None:
                if v[0][0].text == None:
                    n[k] = v[0][0][0].text
                else:
                    n[k] = v[0][0].text
            else:
                n[k] = v[0].text
        return cleanNation(n)
    return None
        
def getNation(id):
    db = MongoClient('localhost', 27017)
    nations = db.bloc.nations
    n = nation(id)
    if n != None:
        nations.save(n)
    
def nationList(index, nationlist,done):
        page = requests.get('http://blocgame.com/rankings.php?page=%s' % str(index))
        tree = html.fromstring(page.text)
        nations = tree.xpath('//table/tr/td/h4/a/@href')
        if len(nations) == 0:
            done["done"] = 1
        for nation in nations:
            nationlist.append(nation[nation.find("=")+1:])

def getNationList():
    print "Getting List of Nations"
    nationlist = []
    done = {}
    index = 1
    while not "done" in done:
        threading.Thread(target=nationList, args=(index, nationlist,done,)).start()
        index += 1
        print index
        while threading.activeCount() > 8:
            time.sleep(1)
    while threading.activeCount() > 1:
        time.sleep(1)
    return nationlist
    
nations = getNationList()

numNations = len(nations)
progress = ProgressBar(maxval=numNations).start()
done = 0;

for id in nations:
    threading.Thread(target=getNation, args=(id,)).start()
    while threading.activeCount() > 8:
        time.sleep(1)
    done += 1
    progress.update(done)

while threading.activeCount() > 1:
    time.sleep(1)
    
progress.finish()    

#!/usr/bin/env python

from flask import *
from pymongo import MongoClient, ASCENDING, DESCENDING
from bson import json_util
import json
from flask.ext.cors import CORS 
import re
import datetime
import math
import unicodecsv
import io

app = Flask(__name__)
cors = CORS(app)

client = MongoClient('localhost', 27017)
db = client.bloc

def neighbouring(region):
    if region == "Mesoamerica":
        return ["Caribbean", "Mesoamerica"]
    if region == "Caribbean":
        return ["Mesoamerica", "Gran Columbia", "Caribbean"]
    if region == "Gran Columbia":
        return ["Caribbean", "Amazonia", "Gran Columbia"]
    if region == "Amazonia":
        return ["Gran Columbia", "Southern Cone", "Amazonia"]
    if region == "West Africa":
        return ["Atlas", "Guinea", "West Africa"]
    if region == "Guinea":
        return ["West Africa", "Atlas", "Egypt", "East Africa", "Guinea"]
    if region == "East Africa":
        return ["Guinea", "Egypt", "Congo", "East Africa"]
    if region == "Congo":
        return ["East Africa", "Southern Africa", "Congo"]
    if region == "Southern Africa":
        return ["Congo", "Southern Africa"]
    if region == "Atlas":
        return ["West Africa", "Guinea", "Egypt", "Atlas"]
    if region == "Egypt":
        return ["Atlas", "Arabia", "East Africa", "Guinea", "Egypt"]
    if region == "Arabia":
        return ["Egypt", "Mesopotamia", "Arabia"]
    if region == "Mesopotamia":
        return ["Arabia", "Persia", "Mesopotamia"]
    if region == "Persia":
        return ["Mesopotamia", "The Subcontinent", "Persia"]
    if region == "The Subcontinent":
        return ["Persia", "China", "Indochina", "The Subcontinent"]
    if region == "Indochina":
        return ["The Subcontinent", "China", "The East Indies", "Indochina"]
    if region == "The East Indies":
        return ["Indochina", "Pacific Rim", "The East Indies"]
    if region == "Pacific Rim":
        return ["The East Indies", "China", "Pacific Rim"]
    if region == "China":
        return ["Pacific Rim", "The Subcontinent", "Indochina", "China"]
    
    

@app.route('/api/nations')
@app.route('/api/nations/')
def nation():
    nations = db.nations
    filters = {}
    
    for k in request.args:
        regx = re.compile('^' + request.args[k], re.IGNORECASE)
        filters[k] = regx
    sort=[]
    if "Sort" and "Order" in filters:
        sort.append((str(request.args["Sort"]), int(request.args["Order"]),))
    if "Order" in filters:
        filters.pop("Order", None)
    if "Sort" in filters:
        filters.pop("Sort", None)
        
    if "Last Online" in filters:
        filters["Last Online"] = {"$gt": int(request.args["Last Online"])}
        if "Last Online Max" in filters: 
            filters["Last Online"]["$lt"] = int(request.args["Last Online Max"])
            filters.pop("Last Online Max", None)
    
    if "Neighbouring" in filters:
        filters["Region"] = {"$in": neighbouring(request.args["Neighbouring"])}
        filters.pop("Neighbouring", None)
    
    lim=100
    if "Count" in filters:
        lim=int(request.args["Count"])
        filters.pop("Count", None)
        
    if "Name" in filters:
        filters["$or"] = [{"Nation": filters["Name"]},{"Leader": filters["Name"]}]
        filters.pop("Name", None)
    
    if "GDP Bracket" in filters:
        filters["Gross Domestic Product"] = {"$lt": int(request.args["GDP Bracket"]) * 2, "$gt": int(float(request.args["GDP Bracket"]) * 0.75)}
        filters.pop("GDP Bracket", None)
    
    if "SLUT" in filters:
        filters.pop("SLUT", None)
        filters["$or"] = [{"Alliance": "None"},{"Last Online": {"$gt": 75}}]
    if "_" in filters: filters.pop("_", None)
    makeCSV = False
    
    if "CSV" in filters:
        filters.pop("CSV", None)
        makeCSV = True
        columns = ["_id", "Leader","Nation","Equipment","Discovered Oil Reserves", "Territory", "Gross Domestic Product", "Manpower", "Rebel Threat", "Economic System", "Army Size", "Approval", "Industry", "Training", "Airforce", "Quality of Life", "Region", "Official Alignment", "Reputation", "Oil Production", "Political System", "Alliance", "Stability", "Growth", "Raw Material Production", "Manufactured Goods", "Navy", "Uranium", "Updated", "Last Online", "Foreign Investment", "Reactor", "Donator"]
    
    res = nations.find(filters, sort=sort, limit=lim)
    n = []
    
    for nat in res:
        n.append(nat)
    if makeCSV:
        f = io.BytesIO()
        writer = unicodecsv.DictWriter(f, columns)
        writer.writer.writerow(columns)
        writer.writerows(n)
        return f.getvalue()
    return json.dumps(n, default=json_util.default)
    

@app.route('/api/alliances/')
def alliances():
    alliances = db.alliances.find()
    res = []
    for a in alliances:
        res.append(a)
    return json.dumps(res, default=json_util.default)
    
    
@app.route('/api/nations/<int:id>')
def nations(id):
    nations = db.nations
    return jsonify(nations.find_one({"_id": int(id)}))

#app.run(debug=True, host='0.0.0.0')

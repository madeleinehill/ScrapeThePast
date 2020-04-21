import re
import json
import math 

rules = []
# get rules from a separate text file
with open("./geoname_data/cities15000.txt") as file:
    # split the file by line into a list of strings
    lines = file.read().split('\n')

cities = [x.split("	") for x in lines if len(x)]

assert all((len(c) is 19 for c in cities))

geoData = {}
geoNames = {}

# enter all unique primary names
for ci in cities:

    # comment this line for international cities
    if (ci[8] != "US"):
        continue

    geoData[ci[0]] = {"name":         ci[2],
                        "type":          "city",
                        "latitude":     ci[4],
                        "longitude":    ci[5],
                        "country_code": ci[8],
                        "admin_code":   ci[10],
                        "population":   ci[14]}

    # filter out non alphabetical characters other than spaces
    name = "".join([x for x in ci[2].lower() if x.isalpha() or x == " "]).strip()
    
    if name not in geoNames or int(geoData[geoNames[name]]["population"]) < int(ci[14]):
        geoNames[name] = ci[0]

# use add a list of alternate names to add these to our data
with open("./geoname_data/alt.txt") as file:
    # split the file by line into a list of strings
    lines = file.read().split('\n')
    
    for li in lines:
        attrs = re.split('\t',li)
            
        # ignore empty lines
        if len(attrs) == 1:
            continue

        # skip if not english (remove or modify for other languages)
        if attrs[2] != 'en' and attrs[2] != '':
            continue

        # if this for an entity we have data for, add it to the names
        if attrs[1] in geoData.keys():

            # filter out non alphabetical characters other than spaces]
            name = "".join([x for x in attrs[3].lower() if x.isalpha() or x == " "]).strip()
            
            if name not in geoNames or int(geoData[geoNames[name]]["population"]) < int(geoData[attrs[1]]["population"]):
                geoNames[name] = attrs[1]

# use add a list of US states
with open("./geoname_data/states.txt") as file:
    # split the file by line into a list of strings
    lines = file.read().split('\n')
    
    for li in lines:
        attrs = re.split('\t',li)
            
        if len(attrs) < 3: 
            print(attrs)
            continue

        name = "".join([x for x in attrs[0].lower() if x.isalpha() or x == " "]).strip()

        geoData[name] = {"name":        attrs[0],
                        "type":          "state",
                        "latitude":     attrs[1],
                        "longitude":    attrs[2],
                        "country_code":     "US",
                        "admin_code":       "",
                        "population":       ""}
        
        # a state's proper name overrides cities
        geoNames[name] = name

# record all multi-word names into a prefix dictionary, keyed by the first word
prefixes = {}
for c in geoNames:
    if c.find(" ") > -1:

        pre = c[:c.find(" ")]
        if pre not in prefixes:
            prefixes[pre] = []

        prefixes[pre].append(c)

# use a list of the 1000 most common words in English plus assorted words to weed out some obvious non-places
with open("./geoname_data/blacklist.txt") as file:
    # split the file by line into a list of strings
    words = file.read().split('\n') + ['']
    for w in words:
        if w in geoNames:
            del geoNames[w]


# implement manual overrides i.e. ("york", "new york geo") associates 
    # york to the same entity as new york geo (NYC)
overrides = {
    ("york", "new york")
}
for o in overrides:
    geoNames[o[0]] = geoNames[o[1]]

# check that it's getting the highest population and cleaning strings 
assert geoData[geoNames["washington dc"]]["latitude"] == "38.89511"
assert geoData[geoNames["phoenix"]]["latitude"] == "33.44838"
assert geoData[geoNames["arizona"]]["type"] == "state"

print(f'Identified {len(geoData)} unique cities by name')
print(f'Ignored {len(cities) - len(set(geoNames.values()))} cities entirely from data')

# write to new file
with open("./src/utils/geonames.json", 'w+') as outfile:
    json.dump(geoNames, outfile)

with open("./src/utils/geo_data.json", 'w+') as outfile:
    json.dump(geoData, outfile)
    
with open("./src/utils/prefixes.json", 'w+') as outfile:
    json.dump(prefixes, outfile)
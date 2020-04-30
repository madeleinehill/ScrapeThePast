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
    # if (ci[8] != "US"):
    #     continue

    geoData[ci[0]] = {"name":         ci[2],
                      "type":         "city",
                      "latitude":     ci[4],
                      "longitude":    ci[5],
                      "country_code": ci[8],
                      "admin_code":   ci[10],
                      "population":   ci[14]}

    # filter out non alphabetical characters other than spaces
    name = "".join(
        [x for x in ci[2].lower() if x.isalpha() or x == " "]).strip()

    if name not in geoNames or int(geoData[geoNames[name]]["population"]) < int(ci[14]):
        geoNames[name] = ci[0]

    # add unambiguous name using admin code
    geoNames[f'{name} {ci[10].lower()}'] = ci[0]
    geoNames[f'{name} {" ".join([x for x in ci[10].lower()])}'] = ci[0]

altNames = {}
# use add a list of alternate names to add these to our data
with open("./geoname_data/alt.txt") as file:
    # split the file by line into a list of strings
    lines = file.read().split('\n')

for li in lines:
    attrs = re.split('\t', li)

    # ignore empty lines
    if len(attrs) == 1:
        continue

    # skip if not english (remove or modify for other languages)
    if attrs[2] != 'en' and attrs[2] != '':
        continue

    # if this for an entity we have data for, add it to the names
    if attrs[1] in geoData.keys():

        # filter out non alphabetical characters other than spaces]
        name = "".join([x for x in attrs[3].lower()
                        if x.isalpha() or x == " "]).strip()

        preferGeo = name not in geoNames or int(
            geoData[geoNames[name]]["population"]) < int(geoData[attrs[1]]["population"])
        preferAlt = name not in altNames or int(
            geoData[altNames[name]]["population"]) < int(geoData[attrs[1]]["population"])

        if preferGeo and preferAlt:
            altNames[name] = attrs[1]

# add a list of countries, adapted from https://www.nationmaster.com/country-info/stats/Geography/Geographic-coordinates
with open("./geoname_data/countries.txt") as file:
    # split the file by line into a list of strings
    lines = file.read().split('\n')

for li in lines:
    attrs = re.split('\t', li)

    if len(attrs) < 2:
        print(attrs)
        continue

    name = "".join([x for x in attrs[0].lower()
                    if x.isalpha() or x == " "]).strip()

    lat, lng = [x.strip() for x in attrs[1].split(',')]
    lat = f'{"-" if lat[-1]=="S" else ""}{lat}'[:-2]
    lng = f'{"-" if lng[-1]=="W" else ""}{lng}'[:-2]
    lat, lng = lat.replace(" ", "."), lng.replace(" ", ".")

    geoData[name] = {"name":         attrs[0],
                     "type":        "country",
                     "latitude":     lat,
                     "longitude":    lng,
                     "country_code":      "",
                     "admin_code":        "",
                     "population":        ""}

    # a country's proper name overrides cities
    geoNames[name] = name

    if name in altNames:
        del altNames[name]

# add a list of US states
with open("./geoname_data/states.txt") as file:
    # split the file by line into a list of strings
    lines = file.read().split('\n')

for li in lines:
    attrs = re.split('\t', li)

    if len(attrs) < 3:
        print(attrs)
        continue

    name = "".join([x for x in attrs[0].lower()
                    if x.isalpha() or x == " "]).strip()

    geoData[name] = {"name":         attrs[0],
                     "type":          "state",
                     "latitude":     attrs[1],
                     "longitude":    attrs[2],
                     "country_code":     "US",
                     "admin_code":         "",
                     "population":         ""}

    # a state's proper name overrides cities
    # (it also, in theory, overrides country names - i.e. Georgia is the state not the country)
    geoNames[name] = name

    if name in altNames:
        del altNames[name]

# use a list of the 1000 most common words in English plus assorted words to weed out some obvious non-places
with open("./geoname_data/blacklist.txt") as file:
    # split the file by line into a list of strings
    words = file.read().split('\n') + ['']
for w in words:
    if w in geoNames:
        del geoNames[w]
    if w in altNames:
        del altNames[w]


# add a list of US states
with open("./src/utils/abbreviations.json") as file:
    # split the file by line into a list of strings
    states = json.loads(file.read())

whitelist = []
# use 200 largest US cities + US states for default whitelist https://gist.github.com/Miserlou/11500b2345d3fe850c92
with open("./geoname_data/largestUSCities.txt") as file:
    # split the file by line into a list of strings
    topCities = file.read().split('\n')
    for c in topCities:
        data = c.split(',')

        if len(data) < 3:
            continue

        # break if not in top 200
        if int(data[0]) > 200:
            continue

        key = f'{data[1]} {list(states.keys())[list(states.values()).index(data[2])]}'.lower(
        )

        whitelist.append(key)

    for s in states.values():
        whitelist.append(s.lower())

# write dictionary linking country codes to country names to json file https://pkgstore.datahub.io/core/country-list/data_csv/data/d7c9d7cfb42cb69f4422dec222dbbaa8/data_csv.csv
with open("./geoname_data/country_codes.txt") as file:
    # split the file by line into a list of strings
    pairs = file.read().split('\n')

country_codes = {}
for c in pairs:
    data = c.split(',')

    country_codes[data[1]] = data[0]

# make sure we can translate any country code that appears
assert all(
    (x['country_code'] in country_codes for x in geoData.values() if x['type'] == 'city'))

# check that it's getting the highest population and cleaning strings
assert geoData[geoNames["washington dc"]]["latitude"] == "38.89511"
assert geoData[geoNames["phoenix"]]["latitude"] == "33.44838"
assert geoData[geoNames["arizona"]]["type"] == "state"

print(f'Identified {len(geoData)} unique cities by name')
print(
    f'Ignored {len(cities) - len(set(geoNames.values()))} cities entirely from data')

# write to new file
with open("./src/utils/geonames.json", 'w+') as outfile:
    json.dump(geoNames, outfile)

with open("./src/utils/altnames.json", 'w+') as outfile:
    json.dump(altNames, outfile)

with open("./src/utils/geo_data.json", 'w+') as outfile:
    json.dump(geoData, outfile)

with open("./src/utils/defaultWhitelist.json", 'w+') as outfile:
    json.dump(whitelist, outfile)

with open("./src/utils/country_abbreviations.json", 'w+') as outfile:
    json.dump(country_codes, outfile)

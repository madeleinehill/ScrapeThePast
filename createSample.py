import re
import sys
import os
from os import mkdir, listdir
from os.path import join, dirname, realpath, isdir, isfile
import time

from io import open as iopen
import json
import requests
import shutil
import time
import random
from datetime import date, timedelta


def download_pages_from_date(url, date):
    # base...{date}/ed-1/seq-{{seq}}.txt
    date_url = url.format(date=date)

    pages = []

    seq = 1

    while True:
        # base.../ed-1/seq-{seq}.txt
        url = date_url.format(seq=seq)

        # example: https://chroniclingamerica.loc.gov/lccn/sn83030431/1916-12-28/ed-1/seq-2.txt
        # print(url)

        response = get_a_page(url)
        if response is None:
            break

        else:
            seq += 1
            pages.append(response)

            # add a break to only get the front page
            break

    print(f'Received {len(pages)} pages from {date}')
    return pages


def get_a_page(url: str):
    try:
        # time.sleep(0.5)
        response = requests.get(url)

        # valid response
        if response.status_code == 200:
            return response

        # expected as indication that there are no more pages for a given date
        elif response.status_code == 404:
            print(f'no reponse from {url}')
            return None

        # busy server error
        elif response.status_code == 503:
            print('server busy, trying again')
            time.sleep(1)
            return get_a_page(url)

        # other response
        else:
            print(f'unknown status code received: {response.status_code}')
            return None

    except Exception as e:
        print(f'Exception while getting content: {str(e)}')
        return None


def write_pages_to_disk(dir_path: str, documents: list):

    sample = []

    for date in documents:
        for i, response in enumerate(documents[date]):
            sample.append({"url": f'{date.replace("-", "_")}_{str(i)}',
                           "text": str(response.content)})

    # write to new file
    with open(dir_path, 'w+') as outfile:
        json.dump(sample, outfile)


def dates_in_range(sdate, edate):

    res = []

    sdate = date(sdate[0], sdate[1], sdate[2])   # start date
    edate = date(edate[0], edate[1], edate[2])   # end date

    delta = edate - sdate       # as timedelta

    for i in range(delta.days + 1):
        day = sdate + timedelta(days=i)
        res.append(str(day))

    return res


# [{"url": "", "text":""}]
url = "https://chroniclingamerica.loc.gov/lccn/sn84026752/{date}/ed-1/seq-{{seq}}/ocr.txt"

current_dir = dirname(realpath('__file__'))
dir_path = current_dir+'/src/utils/sample.json'
start_date = (1850, 1, 3)
end_date = (1860, 3, 15)
# end_date = (1860, 3, 15)
dates = dates_in_range(start_date, end_date)
n_doc = 100


print()
num_total_pages = 0
num_dates = 0

start_time = time.time()

documents = {}
while len(dates) and len(documents.keys()) < n_doc:

    date = random.choice(dates)

    downloaded = download_pages_from_date(url, date)
    if len(downloaded):
        num_dates += 1
        documents[date] = downloaded

        num_total_pages += len(documents[date])

    t_elapsed = time.time()-start_time

    print(f'Downloaded {num_total_pages} pages from {num_dates} date(s) ' +
          f'in {t_elapsed}')
    print()

write_pages_to_disk(dir_path, documents)

print()
print(f'Downloaded {num_total_pages} pages from {num_dates} dates')
print()

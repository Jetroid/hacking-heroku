from lxml import html
import requests
import os
import json

words = {}
for x in range(5,11):
    #Get the HTML page from the UK charts for our current date
    page = requests.get('http://www.allscrabblewords.com/' + str(x) + '-letter-words/')
    tree = html.fromstring(page.content)

    #Use XPATH queries to get artists and titles from page
    words[str(x)] = tree.xpath('//ul[@class="list-inline"]//li//a//text()')

dir = os.path.dirname(os.path.abspath(__file__))
output = os.path.join(dir, "words.json")
with open(output, 'w+') as outfile:
    outfile.write(json.dumps(words))

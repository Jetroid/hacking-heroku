from lxml import html
import requests
import os
import json

words = {}
for x in range(5,11):
    #Get the HTML page from the page for our word length
    page = requests.get('http://www.allscrabblewords.com/' + str(x) + '-letter-words/')
    tree = html.fromstring(page.content)

    #Use XPATH queries to get words from page
    words[str(x)] = tree.xpath('//ul[@class="list-inline"]//li//a//text()')
    words[str(x)] = [word.upper() for word in words[str(x)]]

dir = os.path.dirname(os.path.abspath(__file__))
output = os.path.join(dir, "words.json")
with open(output, 'w+') as outfile:
    outfile.write(json.dumps(words))

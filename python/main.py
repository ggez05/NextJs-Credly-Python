import json

import requests

if __name__ == '__main__':
    base_url = 'https://raw.githubusercontent.com/ggez05/python-credly-scrapper/main/data/badges.json'
    response = requests.get(base_url + "index.json")
    badges = []
    for file in response.json():
        print(file)
        response = requests.get(base_url + file).json()
        if response and type(response) is dict:
            if response.values():
                for badge in response.values():
                    badges.append({
                        'name': badge['name'],
                        'description': badge['description'],
                        'image': badge['image'],
                        'id': badge['id'],
                        'level': badge['level'],
                        'type_category': badge['type_category'],
                        'earn_this_badge_url': badge['earn_this_badge_url']
                    })
    with open('../public/badges.json', 'w') as outfile:
        json.dump(badges, outfile)

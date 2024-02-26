import datetime
import json
import urllib.request

def url_builder(lat, lon):
    user_api = '0b79e1f2d4b0f7155277e38559c83cb4' 
    unit = 'metric'
    return ('http://api.openweathermap.org/data/2.5/weather'
            '?units=' + unit +
            '&APPID=' + user_api +
            '&lat=' + str(lat) +
            '&lon=' + str(lon))

def fetch_data(full_api_url):
    url = urllib.request.urlopen(full_api_url) 
    output = url.read().decode('utf-8') 
    return json.loads(output)

def time_converter(timestamp):
    return datetime.datetime.fromtimestamp(timestamp).strftime('%d %b %I:%M %p')

lat = 55.147872
lon = -6.675298
json_data = fetch_data(url_builder(lat, lon))
temperature = str(json_data['main']['temp'])
timestamp = time_converter(json_data['dt'])
description = json_data['weather'][0]['description']

print("Current weather")
print(timestamp + " : " + temperature + " : " + description)

import requests
import json
url = "https://eu-west-2.aws.data.mongodb-api.com/app/data-mubng/endpoint/data/v1/action/findOne"

payload = json.dumps({
    "collection": "<COLLECTION_NAME>",
    "database": "<DATABASE_NAME>",
    "dataSource": "Cluster42",
    "projection": {
        "_id": 1
    }
})
headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': '*',
  'api-key': '6krKSvhK7DMxC5weEr6z4ncN77aEErLs8KMwvJEaBevKMEqnF5T9q6CGE3a904J7',
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

from dateutil import parser
expiry_date = '2021-07-13T00:00:00.000Z'
expiry = parser.parse(expiry_date)
orderdate = '2021-06-23T00:00:00.000Z'
order_date = parser.parse(orderdate)

item_1 = {
  "Description": "Description 1",
  "Notes": "Example Note 1",
  "Status": "To do",
  "Hidden": "TRUE"
}

item_2 = {
  "Description": "Description 2",
  "Notes": "Example Note 2",
  "Status": "In progress",
  "Hidden": "TRUE"
}

item_3 = {
  "Description": "Description 3",
  "Notes": "Example Note 3",
  "Status": "Done",
  "Hidden": "TRUE"
}

item_4 = {
  "Description": "Description 4",
  "Notes": "Example Note 4",
  "Status": "To do",
  "Hidden": "TRUE"
}

item_5 = {
  "Description": "Description 5",
  "Notes": "Example Note 5",
  "Status": "In progress",
  "Hidden": "TRUE"
}

item_6 = {
  "Description": "Description 6",
  "Notes": "Example Note 6",
  "Status": "Done",
  "Hidden": "FALSE"
}

item_7 = {
  "Description": "Description 7",
  "Notes": "Example Note 7",
  "Status": "To do",
  "Hidden": "FALSE"
}

item_8 = {
  "Description": "Description 8",
  "Notes": "Example Note 8",
  "Status": "In progress",
  "Hidden": "FALSE"
}

item_9 = {
  "Description": "Description 9",
  "Notes": "Example Note 9",
  "Status": "Done",
  "Hidden": "FALSE"
}

item_10 = {
  "Description": "Description 10",
  "Notes": "Example Note 10",
  "Status": "To do",
  "Hidden": "FALSE"
}

# Insert all the documents at once
from Get_Database import get_database
dbname = get_database()
dbname["Tasks"].insert_many([item_1,item_2,item_3,item_4,item_5,item_6,item_7,item_8,item_9,item_10])
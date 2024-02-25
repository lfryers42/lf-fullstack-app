# Get the database using the method we defined in pymongo_test_insert file
from pandas import DataFrame
from Get_Database import get_database
dbname = get_database()
 
# Retrieve a collection named "user_1_items" from database
collection_name = dbname["Tasks"]
 
item_details = collection_name.find()
items_df = DataFrame(item_details)

# see the magic
print(items_df)
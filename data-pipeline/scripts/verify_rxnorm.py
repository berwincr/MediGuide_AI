from pymongo import MongoClient

MONGO_URI = "YOUR_WORKING_MONGODB_CONNECTION_STRING"

client = MongoClient(MONGO_URI)

db = client["mediguide"]
collection = db["medicines"]

# Count documents
total = collection.count_documents({})

print("Total medicines:", total)

print("\nFirst 10 medicines:\n")

for medicine in collection.find().limit(10):
    print(medicine)

# Search example
print("\nSearch for acetaminophen:")

result = collection.find_one(
    {"name": {"$regex": "^acetaminophen$", "$options": "i"}}
)

print(result)

client.close()
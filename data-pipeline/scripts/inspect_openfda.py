from pathlib import Path
import zipfile
import json


BASE_DIR = Path(__file__).resolve().parent.parent

zip_file = (
    BASE_DIR
    / "raw"
    / "openfda"
    / "drug-label-0001-of-0014.json.zip"
)


with zipfile.ZipFile(zip_file, "r") as z:

    print("Files inside ZIP:")
    for name in z.namelist():
        print(" -", name)

    # Get the first JSON file
    json_files = [
        name for name in z.namelist()
        if name.endswith(".json")
    ]

    if not json_files:
        print("No JSON file found.")
        exit()

    json_file = json_files[0]

    print("\nReading:", json_file)

    with z.open(json_file) as file:

        data = json.load(file)


print("\nTop-level keys:")
print(data.keys())

print("\nNumber of results:")
print(len(data.get("results", [])))


if data.get("results"):

    first_record = data["results"][0]

    print("\nFirst record fields:")

    for key in first_record.keys():
        print(" -", key)
import requests
import json


rx_cui = "161"
medicine_name = "acetaminophen"

url = "https://connect.medlineplus.gov/service"

params = {
    "mainSearchCriteria.v.c": rx_cui,
    "mainSearchCriteria.v.cs": "2.16.840.1.113883.6.88",
    "mainSearchCriteria.v.dn": medicine_name,
    "knowledgeResponseType": "application/json",
    "informationRecipient.languageCode.c": "en"
}


print("Requesting MedlinePlus...")

response = requests.get(
    url,
    params=params,
    timeout=30
)

response.raise_for_status()

data = response.json()

feed = data.get("feed", {})

entries = feed.get("entry", [])

print("\nNumber of MedlinePlus results:", len(entries))


parsed_entries = []

for entry in entries:

    title = (
        entry
        .get("title", {})
        .get("_value")
    )

    summary = (
        entry
        .get("summary", {})
        .get("_value")
    )

    updated = (
        entry
        .get("updated", {})
        .get("_value")
    )

    links = entry.get("link", [])

    medicine_url = None

    if links:
        medicine_url = links[0].get("href")

    parsed_entries.append({
        "title": title,
        "summary": summary,
        "url": medicine_url,
        "updated": updated
    })


result = {
    "rx_cui": rx_cui,
    "name": medicine_name,
    "source": "MedlinePlus",
    "entries": parsed_entries
}


print("\nPARSED RESULT")
print("=" * 60)

print(
    json.dumps(
        result,
        indent=4,
        ensure_ascii=False
    )
)
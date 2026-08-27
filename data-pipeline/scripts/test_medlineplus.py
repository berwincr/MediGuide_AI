import requests


rx_cui = "161"

url = "https://connect.medlineplus.gov/service"

params = {
    "mainSearchCriteria.v.c": rx_cui,
    "mainSearchCriteria.v.cs": "2.16.840.1.113883.6.88",
    "mainSearchCriteria.v.dn": "acetaminophen",
    "knowledgeResponseType": "application/json",
    "informationRecipient.languageCode.c": "en"
}


print("Requesting MedlinePlus information...")

response = requests.get(
    url,
    params=params,
    timeout=30
)

print("Status code:", response.status_code)

print("\nResponse:")
print(response.text)
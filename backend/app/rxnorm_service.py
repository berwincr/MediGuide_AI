import requests


RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST"


def find_rxnorm_rxcui(medicine_name: str):
    url = f"{RXNORM_BASE_URL}/approximateTerm.json"

    response = requests.get(
        url,
        params={
            "term": medicine_name,
            "maxEntries": 5,
            "option": 0
        },
        timeout=5
    )

    response.raise_for_status()

    data = response.json()

    candidates = (
        data.get("approximateGroup", {})
        .get("candidate", [])
    )

    if not candidates:
        return None

    return candidates[0].get("rxcui")
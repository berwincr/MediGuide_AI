import requests


NODE_PUSH_URL = "http://127.0.0.1:3001/send"


def send_push_notification(
    subscription,
    title,
    body,
    data=None
):
    payload = {
        "subscription": subscription,
        "title": title,
        "body": body,
        "data": data or {}
    }

    try:
        response = requests.post(
            NODE_PUSH_URL,
            json=payload,
            timeout=10
        )

        if response.ok:
            print("Push notification sent successfully")
            return True

        print("Node push service failed:")
        print("Status:", response.status_code)
        print("Response:", response.text)

        return False

    except requests.RequestException as e:
        print("Could not connect to Node push service:")
        print(e)
        return False
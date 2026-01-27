import requests
import json
import datetime

BASE_URL = "http://localhost:5000/api"

def run():
    # 1. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": "demo@example.com", "password": "password"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        exit(1)

    token = resp.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    print("Logged in.")

    # 2. Get Equipment to find an ID
    print("Fetching equipment...")
    resp = requests.get(f"{BASE_URL}/equipment", headers=headers)
    equipment = resp.json()
    if not equipment:
        print("No equipment found.")
        exit(1)

    equip_id = equipment[0]['id']
    equip_name = equipment[0]['name']
    print(f"Found equipment: {equip_name} (ID: {equip_id})")

    # 3. Create a Booking
    print("Creating booking...")
    start_time = (datetime.datetime.now() + datetime.timedelta(days=10)).isoformat()
    end_time = (datetime.datetime.now() + datetime.timedelta(days=10, hours=4)).isoformat()

    booking_data = {
        "client_name": "API Test Client",
        "client_phone": "555-0199",
        "event_type": "Corporate",
        "start_time": start_time,
        "end_time": end_time,
        "location": "Office HQ",
        "status": "Confirmed",
        "equipment_ids": [equip_id]
    }

    resp = requests.post(f"{BASE_URL}/bookings", headers=headers, json=booking_data)
    if resp.status_code != 201:
        print(f"Failed to create booking: {resp.text}")
        exit(1)

    booking_id = resp.json()['id']
    print(f"Booking created (ID: {booking_id})")

    # 4. Try to create overlapping booking with same equipment (Should Fail)
    print("Attempting double booking...")
    resp = requests.post(f"{BASE_URL}/bookings", headers=headers, json=booking_data)

    if resp.status_code == 409:
        print("Success: Double booking prevented!")
        print(f"Error message: {resp.json().get('error')}")
    else:
        print(f"Failed: Double booking NOT prevented. Status: {resp.status_code}")
        exit(1)

    # 5. Fetch Bookings
    print("Fetching bookings list...")
    resp = requests.get(f"{BASE_URL}/bookings", headers=headers)
    bookings = resp.json()
    found = any(b['id'] == booking_id for b in bookings)

    if found:
        print("Verified booking in list.")
    else:
        print("Booking not found in list.")
        exit(1)

    print("API Verification Complete.")

if __name__ == "__main__":
    run()

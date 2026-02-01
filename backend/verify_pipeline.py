import requests
import json
import time

BASE_URL = "http://localhost:8000"
PHONE = f"138{int(time.time())}" # Unique phone
PASSWORD = "password123"

def print_step(msg):
    print(f"\n[STEP] {msg}")

def test_pipeline():
    # 1. Register
    print_step("Registering User...")
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "phone": PHONE,
        "password": PASSWORD
    })
    if resp.status_code != 201:
        print(f"Register failed: {resp.text}")
        return
    print("User registered.")

    # 2. Login
    print_step("Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", data={
        "username": PHONE,
        "password": PASSWORD
    })
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Logged in. Token: {token[:10]}...")

    # 3. Get User Profile
    print_step("Fetching Profile...")
    resp = requests.get(f"{BASE_URL}/users/me", headers=headers)
    print(f"User: {resp.json()['phone']}")

    # 4. Get Presets
    print_step("Fetching Presets...")
    resp = requests.get(f"{BASE_URL}/materials/presets?category=model", headers=headers)
    models = resp.json()
    print(f"Found {len(models)} models.")
    if not models:
        print("No models found! Seeding might be needed.")
        return
    model_id = models[0]["_id"] or models[0]["id"]
    
    resp = requests.get(f"{BASE_URL}/materials/presets?category=scene", headers=headers)
    scenes = resp.json()
    print(f"Found {len(scenes)} scenes.")
    scene_id = scenes[0]["_id"] or scenes[0]["id"]

    # 5. Upload Garment (Mock)
    # We create a dummy file
    print_step("Uploading Garment...")
    files = {'file': ('test_garment.jpg', b'fake_image_content', 'image/jpeg')}
    data = {'type': 'garment'}
    resp = requests.post(f"{BASE_URL}/materials/upload", headers=headers, files=files, data=data)
    if resp.status_code != 200:
        print(f"Upload failed: {resp.text}")
        return
    garment = resp.json()
    garment_url = garment["url"]
    print(f"Uploaded garment: {garment_url}")

    # 6. Generate Image
    print_step("Creating Generation Task...")
    payload = {
        "garment_url": garment_url,
        "model_id": model_id,
        "scene_id": scene_id,
        "prompt": "Test generation"
    }
    resp = requests.post(f"{BASE_URL}/generate/", headers=headers, json=payload)
    if resp.status_code != 200:
        print(f"Generation failed: {resp.text}")
        return
    task = resp.json()
    task_id = task["_id"] or task["id"]
    print(f"Task started: {task_id}")

    # 7. Poll Status
    print_step("Polling Status...")
    for _ in range(60):
        resp = requests.get(f"{BASE_URL}/generate/{task_id}", headers=headers)
        status = resp.json()["status"]
        print(f"Status: {status}")
        if status in ["COMPLETED", "FAILED"]:
            break
        time.sleep(1)
    
    if status == "COMPLETED":
        print("Integration Test PASSED!")
    else:
        print("Integration Test FAILED or TIMED OUT.")

if __name__ == "__main__":
    try:
        test_pipeline()
    except Exception as e:
        print(f"Error: {e}")

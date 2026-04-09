import requests
import json

file_path = 'backend.zip'
with open(file_path, 'rb') as f:
    response = requests.post('https://file.io', files={'file': f})
    
if response.status_code == 200:
    data = response.json()
    print(data['link'])
else:
    print(f"Error: {response.status_code}")
    print(response.text)

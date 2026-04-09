import base64
import os

zip_path = r'c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat\backend.zip'
output_path = r'c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat\backend_zip_b64.txt'

with open(zip_path, 'rb') as f:
    encoded = base64.b64encode(f.read()).decode('ascii')

with open(output_path, 'w') as f:
    f.write(encoded)

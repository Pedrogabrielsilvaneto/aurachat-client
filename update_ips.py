import os

new_ip = "34.19.0.191"
old_ip = "136.118.48.181"
directory = r"c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat"

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith((".js", ".jsx", ".md", ".txt", ".sh", ".ps1", ".env", ".json")):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if old_ip in content:
                    print(f"Updating {path}")
                    new_content = content.replace(old_ip, new_ip)
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
            except Exception as e:
                print(f"Error processing {path}: {e}")

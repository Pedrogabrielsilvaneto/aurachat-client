import zipfile
import os

def zipdir(path, ziph, exclude_dirs=['node_modules', '.git', '.vercel', 'dist']):
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            ziph.write(os.path.join(root, file), 
                       os.path.relpath(os.path.join(root, file), 
                       os.path.join(path, '..')))

zipf = zipfile.ZipFile('aura_completo.zip', 'w', zipfile.ZIP_DEFLATED)
zipdir('backend', zipf)
zipdir('frontend', zipf)
for f in ['setup-gcp.sh', 'start-gcp.sh']:
    if os.path.exists(f): zipf.write(f)
zipf.close()
print("Zip created successfully: aura_completo.zip")

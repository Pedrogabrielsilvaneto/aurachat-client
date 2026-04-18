import shutil, os

src = r"c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat\backend"
out = r"c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat\backend.zip"
tmp = r"c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat\_tmp_deploy"

if os.path.exists(tmp): shutil.rmtree(tmp)
shutil.copytree(src, tmp, ignore=shutil.ignore_patterns('node_modules', 'auth_info', '*.log'))

# Scripts de setup
for f in ['setup-gcp.sh', 'start-gcp.sh']:
    src_f = r"c:\Users\Pedro Neto\.gemini\antigravity\scratch\aurachat" + f"\{f}"
    if os.path.exists(src_f): shutil.copy2(src_f, tmp)

shutil.make_archive(out.replace('.zip',''), 'zip', tmp)
shutil.rmtree(tmp)
size = os.path.getsize(out) // 1024
print(f"OK: backend.zip criado ({size} KB)")

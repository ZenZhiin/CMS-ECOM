import os
import shutil

base_path = "apps/web/src/app/dashboard/content"
for item in os.listdir(base_path):
    full_path = os.path.join(base_path, item)
    if os.path.isdir(full_path) and ("[" in item or "]" in item):
        print(f"Removing corrupted directory: {full_path}")
        shutil.rmtree(full_path)

# Recreate correct ones
os.makedirs(os.path.join(base_path, "[typeId]", "new"), exist_ok=True)
os.makedirs(os.path.join(base_path, "[typeId]", "[entryId]"), exist_ok=True)
print("Restored clean directory structure.")

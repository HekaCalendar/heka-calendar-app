#!/usr/bin/env python3
"""
Fix Play Store screenshots to exact aspect ratio and dimensions.
Drag PNG/JPEG files onto this script or run: python fix-screenshots.py *.png
"""
import sys
from PIL import Image
import os

TARGETS = {
    "phone": (1080, 1920),      # 9:16 portrait
    "tablet7": (1200, 1920),    # 9:16 portrait (7-inch)
    "tablet10": (1600, 2560),   # 9:16 portrait (10-inch)
    "chromebook": (1920, 1080), # 16:9 landscape
}

def fix_image(path, target_w, target_h):
    img = Image.open(path)
    w, h = img.size
    target_ratio = target_w / target_h
    current_ratio = w / h

    # Center crop to exact target ratio
    if current_ratio > target_ratio:
        # Too wide, crop width
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        # Too tall, crop height
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))

    # Resize to exact target
    img = img.resize((target_w, target_h), Image.LANCZOS)

    # Save as JPEG (smaller, Play Store accepts it)
    out_path = path.rsplit(".", 1)[0] + "_fixed.jpg"
    img.save(out_path, "JPEG", quality=92)
    print(f"✓ {path} → {out_path} ({target_w}x{target_h})")
    return out_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix-screenshots.py <image files...>")
        print("\nTargets:")
        for name, (w, h) in TARGETS.items():
            ratio = "16:9" if w > h else "9:16"
            print(f"  {name}: {w}x{h} ({ratio})")
        sys.exit(1)

    print("\nPick target format:")
    for i, (name, (w, h)) in enumerate(TARGETS.items(), 1):
        ratio = "16:9" if w > h else "9:16"
        print(f"  {i}. {name} ({w}x{h}, {ratio})")

    choice = input("\nEnter number: ").strip()
    target = list(TARGETS.values())[int(choice) - 1]

    for path in sys.argv[1:]:
        if os.path.exists(path):
            fix_image(path, *target)
        else:
            print(f"✗ Not found: {path}")

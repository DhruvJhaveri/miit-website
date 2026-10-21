"""Stacks contact sheets into labelled boards (8 clips per board) for quick visual review."""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

src = Path(sys.argv[1])
out = Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
sheets = sorted(src.glob("*.jpg"))
per = 8
for b in range(0, len(sheets), per):
    group = sheets[b : b + per]
    imgs = [Image.open(p) for p in group]
    w = max(i.width for i in imgs)
    h = sum(i.height + 22 for i in imgs)
    board = Image.new("RGB", (w, h), (20, 20, 20))
    d = ImageDraw.Draw(board)
    y = 0
    for p, i in zip(group, imgs):
        d.text((6, y + 4), p.stem, fill=(185, 237, 113))
        board.paste(i, (0, y + 22))
        y += i.height + 22
    board.save(out / f"board-{b // per + 1}.jpg", quality=85)
    print(out / f"board-{b // per + 1}.jpg")

"""
Downloads every source clip referenced by build_media.py from Mixkit into
media-src/raw/<id>.mp4 (1080p where Mixkit offers it for free, otherwise 720p).

Usage:  python scripts/media/fetch_sources.py
Standard library only. Re-runs skip files that already exist.
"""
import sys
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from build_media import FILM, LOOPS, RAW, STILLS  # noqa: E402

UA = {"User-Agent": "Mozilla/5.0 (MIIT media pipeline)"}


def ids():
    out = {s["id"] for s in FILM}
    for shots in LOOPS.values():
        out |= {s["id"] for s in shots}
    out |= {v[0] for v in STILLS.values()}
    return sorted(out, key=int)


def fetch(clip_id: str) -> str:
    dest = RAW / f"{clip_id}.mp4"
    if dest.exists():
        return "cached"
    for res in ("1080", "720"):
        url = f"https://assets.mixkit.co/videos/{clip_id}/{clip_id}-{res}.mp4"
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=300) as r:
                dest.write_bytes(r.read())
            return res
        except urllib.error.HTTPError:
            continue
    return "FAILED"


if __name__ == "__main__":
    RAW.mkdir(parents=True, exist_ok=True)
    for cid in ids():
        print(cid, fetch(cid), flush=True)

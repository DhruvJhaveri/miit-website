"""
MIIT CORPORATION — cinematic media pipeline.

Turns licensed real-world source footage (Mixkit Free License, see docs/ASSETS.md)
into the website's media:

  1. Scroll film: an edited, colour-graded multi-shot sequence exported as numbered
     WebP frame sequences (desktop 16:9 + mobile 9:16) for canvas scroll-scrubbing.
  2. Posters for the film (first frame), desktop and mobile.
  3. Two short ambient loops (product macro, logistics) as WebM (VP9) + MP4 (H.264).
  4. Graded stills for product categories, industries and editorial sections.

Usage:  python scripts/media/build_media.py [film|loops|stills|all]
Requires ffmpeg on disk (path resolved below) and source clips in media-src/raw/<id>.mp4.
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "media-src" / "raw"
WORK = ROOT / "media-src" / "work"
PUBLIC = ROOT / "public" / "media"

FFMPEG = next((Path.home() / ".tools" / "ffmpeg").rglob("ffmpeg.exe"), None) or shutil.which("ffmpeg")

# One shared grade so footage from different shoots reads as a single film:
# restrained saturation, cool steel-blue shadows (from the MIIT logo blue), warm
# molten highlights, filmic toe/shoulder and a soft vignette. Grain is added in CSS,
# not baked into frames, to keep the WebP sequence small.
GRADE = (
    "eq=contrast=1.07:saturation=0.82:gamma=0.97,"
    "colorbalance=rs=-0.035:gs=0.0:bs=0.035:rm=-0.01:gm=0:bm=0.01:rh=0.035:gh=0.01:bh=-0.035,"
    "curves=all='0/0.025 0.22/0.18 0.5/0.49 0.82/0.86 1/0.96',"
    "vignette=angle=PI/5"
)

FPS = 24
FADE = 0.5

# Edit decision list for the scroll film. Each shot: source id, in point, duration,
# push-in amount (fractional zoom over the shot), mobile crop centre (0..1),
# optional per-shot exposure trim, and transition into the shot.
FILM = [
    # ACT I — dark, atmospheric industrial hall, slow push
    dict(id="17897", ss=3.5, d=4.6, push=0.10, mx=0.55, trim="eq=brightness=-0.03", tr="fade"),
    dict(id="1675", ss=5.0, d=2.6, push=0.05, mx=0.45, tr="fadeblack"),
    # ACT II — precision macro: machining, drilling, cutting, fasteners, chain
    dict(id="2252", ss=1.5, d=2.6, push=0.06, mx=0.55, trim="eq=brightness=-0.04", tr="fadeblack"),
    dict(id="2247", ss=6.0, d=2.2, push=0.04, mx=0.45, tr="fade"),
    dict(id="46082", ss=5.5, d=2.4, push=0.05, mx=0.55, tr="fade"),
    dict(id="21045", ss=0.8, d=2.2, push=0.05, mx=0.30, tr="fade"),
    dict(id="32822", ss=0.4, d=2.2, push=0.04, mx=0.45, trim="eq=brightness=-0.10:gamma=0.92", tr="fade"),
    dict(id="47641", ss=9.0, d=2.2, push=0.03, mx=0.50, tr="fade"),
    # ACT III — scale and capability: process plant, refinery
    dict(id="32824", ss=1.0, d=2.4, push=0.05, mx=0.50, trim="eq=brightness=-0.05", tr="fadeblack"),
    dict(id="22194", ss=2.0, d=2.8, push=0.04, mx=0.62, trim="eq=brightness=-0.09:gamma=0.9:saturation=0.78", tr="fade"),
    # ACT IV — wide night port, hold for identity + CTA
    dict(id="36318", ss=0.5, d=4.6, push=0.07, mx=0.50, tr="fadeblack"),
]

LOOPS = {
    "product-macro": [
        dict(id="2236", ss=2.0, d=2.4), dict(id="34740", ss=14.0, d=2.4), dict(id="47641", ss=11.0, d=2.4),
        dict(id="2242", ss=3.0, d=2.4), dict(id="30756", ss=2.0, d=2.4), dict(id="12341", ss=4.0, d=2.4),
    ],
    "logistics": [
        dict(id="4705", ss=2.0, d=2.6), dict(id="45848", ss=6.0, d=2.6), dict(id="23011", ss=1.0, d=2.6),
        dict(id="31019", ss=2.0, d=2.6), dict(id="30955", ss=1.0, d=2.6),
    ],
}

# name -> (source id, timestamp seconds, horizontal focus 0..1, optional trim)
STILLS = {
    # product categories
    "cat-metals-structural": ("40723", 1.0, 0.5, ""),
    "cat-pipes-valves-fittings": ("32824", 3.0, 0.5, "eq=brightness=-0.04"),
    "cat-cutting-grinding": ("46082", 9.0, 0.5, ""),
    "cat-engineering-tools": ("2247", 8.5, 0.5, ""),
    "cat-fasteners-hardware": ("32822", 2.2, 0.5, "eq=brightness=-0.06"),
    "cat-bearings-mechanical": ("47641", 12.0, 0.5, ""),
    "cat-pneumatics-instrumentation": ("32825", 3.5, 0.65, ""),
    "cat-safety-maintenance": ("47290", 8.0, 0.5, ""),
    "cat-aluminium-materials": ("2252", 3.0, 0.5, ""),
    # industries
    "ind-manufacturing": ("14631", 10.0, 0.5, ""),
    "ind-foundries": ("20906", 3.0, 0.5, ""),
    "ind-exports": ("30955", 3.0, 0.5, ""),
    "ind-cnc-vmc": ("2230", 3.0, 0.5, ""),
    "ind-construction": ("31450", 5.0, 0.4, ""),
    "ind-contractors": ("47293", 1.6, 0.5, ""),
    "ind-epc-turnkey": ("28073", 4.0, 0.5, "eq=brightness=-0.04"),
    "ind-infrastructure": ("11212", 5.0, 0.5, "eq=brightness=-0.04"),
    "ind-automobile-engineering": ("65", 4.0, 0.5, ""),
    "ind-oil-gas": ("4360", 8.0, 0.5, ""),
    # editorial
    "ed-heritage-drill": ("2248", 5.0, 0.5, ""),
    "ed-inventory": ("4705", 6.0, 0.5, ""),
    "ed-port-night": ("36318", 4.0, 0.5, ""),
    "ed-port-cranes": ("4012", 10.0, 0.5, ""),
    "ed-steel-hall": ("26467", 40.0, 0.5, ""),
    "ed-refinery-night": ("4359", 6.0, 0.5, ""),
    "ed-lathe": ("24984", 4.0, 0.5, ""),
    "ed-gears": ("12342", 8.0, 0.5, ""),
    "ed-forklift": ("45848", 10.0, 0.5, ""),
    "ed-grinding": ("34739", 10.0, 0.4, ""),
    "ed-warehouse-engineer": ("23010", 4.0, 0.5, ""),
}


def run(args: list[str]) -> None:
    subprocess.run([str(FFMPEG), "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def shot_filter(shot: dict, orient: str) -> str:
    w, h = (1280, 720) if orient == "landscape" else (540, 960)
    frames = max(int(shot["d"] * FPS), 1)
    push = shot.get("push", 0)
    parts = []
    if orient == "portrait":
        # crop a 9:16 window from the 16:9 source around the shot's subject
        parts.append(f"crop=ih*9/16:ih:(iw-ow)*{shot.get('mx', 0.5)}:0")
    parts.append(f"scale={w * 2}:{h * 2}:force_original_aspect_ratio=increase,crop={w * 2}:{h * 2}")
    parts.append(f"fps={FPS}")
    if push:
        # upscaled zoompan with d=1 gives a smooth, jitter-free dolly-in
        parts.append(
            f"zoompan=z='1+{push}*on/{frames}':d=1:s={w}x{h}:fps={FPS}"
            ":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        )
    else:
        parts.append(f"scale={w}:{h}")
    if shot.get("trim"):
        parts.append(shot["trim"])
    parts.append(GRADE)
    parts.append("format=yuv420p,setsar=1")
    return ",".join(parts)


def render_shots(shots: list[dict], orient: str, tag: str) -> list[Path]:
    out = []
    for i, s in enumerate(shots):
        p = WORK / f"{tag}-{orient}-{i:02d}.mp4"
        run(["-ss", str(s["ss"]), "-t", str(s["d"]), "-i", str(RAW / f"{s['id']}.mp4"), "-an",
             "-vf", shot_filter(s, orient), "-c:v", "libx264", "-crf", "12", "-preset", "medium", str(p)])
        out.append(p)
    return out


def join(parts: list[Path], shots: list[dict], dest: Path, extra_args: list[str]) -> float:
    """Cross-fades rendered shots into one sequence; returns total duration."""
    inputs: list[str] = []
    for p in parts:
        inputs += ["-i", str(p)]
    chain, last, t = [], "[0:v]", shots[0]["d"]
    for i in range(1, len(parts)):
        tr = shots[i].get("tr", "fade")
        offset = t - FADE
        label = f"[v{i}]"
        chain.append(f"{last}[{i}:v]xfade=transition={tr}:duration={FADE}:offset={offset:.3f}{label}")
        last, t = label, t + shots[i]["d"] - FADE
    graph = ";".join(chain) if chain else "[0:v]null[v0]"
    out_label = last if chain else "[v0]"
    run([*inputs, "-filter_complex", graph, "-map", out_label, "-an", *extra_args, str(dest)])
    return t


def export_frames(master: Path, dest: Path, count: int, size: str, quality: int, duration: float) -> int:
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    rate = count / duration
    run(["-i", str(master), "-vf", f"fps={rate:.5f},scale={size}:flags=lanczos",
         "-c:v", "libwebp", "-quality", str(quality), "-compression_level", "6",
         "-start_number", "0", str(dest / "%04d.webp")])
    return len(list(dest.glob("*.webp")))


def build_film() -> None:
    meta = {}
    for orient, size, count, q, folder in (
        ("landscape", "1280:720", 240, 72, "desktop"),
        ("portrait", "540:960", 160, 70, "mobile"),
    ):
        parts = render_shots(FILM, orient, "film")
        master = WORK / f"film-{orient}-master.mp4"
        dur = join(parts, FILM, master, ["-c:v", "libx264", "-crf", "13", "-preset", "slow", "-pix_fmt", "yuv420p"])
        n = export_frames(master, PUBLIC / "film" / folder, count, size, q, dur)
        # posters: first frame at higher quality, WebP + JPEG fallback
        first = PUBLIC / "film" / folder / "0000.webp"
        run(["-i", str(first), "-q:v", "3", str(PUBLIC / "film" / f"poster-{folder}.jpg")])
        shutil.copy(first, PUBLIC / "film" / f"poster-{folder}.webp")
        # a watchable H.264 cut of the film (reference / social use; the site scrubs frames)
        run(["-i", str(master), "-vf", "null",
             "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-movflags", "+faststart",
             "-pix_fmt", "yuv420p", str(PUBLIC / "film" / f"miit-film-{folder}.mp4")])
        meta[folder] = {"frames": n, "duration": round(dur, 3), "ext": "webp",
                        "width": int(size.split(":")[0]), "height": int(size.split(":")[1])}
    (PUBLIC / "film" / "manifest.json").write_text(json.dumps(meta, indent=2))
    print("film", meta)


def build_loops() -> None:
    for name, shots in LOOPS.items():
        for s in shots:
            s.setdefault("push", 0.03)
        parts = render_shots(shots, "landscape", f"loop-{name}")
        master = WORK / f"loop-{name}.mp4"
        join(parts, shots, master, ["-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p"])
        dest = PUBLIC / "loops"
        dest.mkdir(parents=True, exist_ok=True)
        run(["-i", str(master), "-vf", "scale=1280:-2", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38",
             "-row-mt", "1", "-deadline", "good", str(dest / f"{name}.webm")])
        run(["-i", str(master), "-vf", "scale=1280:-2", "-c:v", "libx264", "-crf", "26", "-preset", "slow",
             "-movflags", "+faststart", "-pix_fmt", "yuv420p", str(dest / f"{name}.mp4")])
        run(["-ss", "0.2", "-i", str(master), "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "4",
             str(dest / f"{name}-poster.jpg")])
        print("loop", name)


def build_stills() -> None:
    dest = PUBLIC / "stills"
    dest.mkdir(parents=True, exist_ok=True)
    for name, (sid, ts, fx, trim) in STILLS.items():
        vf = f"crop=iw*0.9:ih:(iw-ow)*{fx}:0,scale=1440:-2:flags=lanczos"
        if trim:
            vf += "," + trim
        vf += "," + GRADE
        run(["-ss", str(ts), "-i", str(RAW / f"{sid}.mp4"), "-frames:v", "1", "-vf", vf, "-q:v", "2",
             str(dest / f"{name}.jpg")])
        print("still", name)


if __name__ == "__main__":
    if FFMPEG is None:
        sys.exit("ffmpeg not found")
    WORK.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    if target in ("film", "all"):
        build_film()
    if target in ("loops", "all"):
        build_loops()
    if target in ("stills", "all"):
        build_stills()

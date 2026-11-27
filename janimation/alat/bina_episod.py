#!/usr/bin/env python3
"""Bina 04_storyboard.md dan 05_prompt-video.md daripada adegan.json satu episod.

Blok [GAYA], [WATAK], [LATAR], [PENCAHAYAAN] dan [NEGATIF] dibaca terus daripada fail
bible, watak dan lokasi, lalu disalin TEPAT ke dalam setiap prompt. Ini menjamin
konsistensi rupa watak antara semua scene. Jangan sunting dua fail output secara manual:
ubah adegan.json (atau blok kunci) dan jalankan semula.

Guna:  python3 janimation/alat/bina_episod.py janimation/03_episod/EP001_janda-satu-malaysia
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CODE = re.compile(r"```\n(.*?)\n```", re.S)


def _first_code_after(text: str, marker: str, path: Path) -> str:
    start = text.find(marker)
    if start < 0:
        sys.exit(f"RALAT: '{marker}' tiada dalam {path.relative_to(ROOT)}")
    match = CODE.search(text, start)
    if not match:
        sys.exit(f"RALAT: tiada blok kod selepas '{marker}' dalam {path.relative_to(ROOT)}")
    return match.group(1).strip()


OWNER: dict[str, str] = {}  # ID blok -> nama fail watak (untuk folder imej rujukan)


def _blocks() -> dict[str, str]:
    """Semua Blok Kunci Rupa / Varian / Latar, dikunci mengikut ID."""
    found: dict[str, str] = {}

    def add(key: str, block: str, path: Path) -> None:
        OWNER[key] = path.stem
        if not block.startswith(f"{key}:"):
            sys.exit(f"RALAT: blok {key} dalam {path.name} mesti bermula dengan '{key}:'")
        if key in found:
            sys.exit(f"RALAT: ID {key} ditakrif dua kali")
        found[key] = block

    for path in sorted((ROOT / "01_watak").glob("*.md")):
        if path.name.startswith("_") or path.name == "senarai-watak.md":
            continue
        text = path.read_text(encoding="utf-8")
        if "## Blok Kunci Rupa" in text:
            add(path.stem, _first_code_after(text, "## Blok Kunci Rupa", path), path)
        for key in re.findall(r"^### Blok Varian ([A-Z0-9-]+)\s*$", text, re.M):
            add(key, _first_code_after(text, f"### Blok Varian {key}", path), path)
    lokasi = ROOT / "02_lokasi" / "senarai-lokasi.md"
    text = lokasi.read_text(encoding="utf-8")
    for key in re.findall(r"^### (LOK-[A-Z0-9-]+)\s*$", text, re.M):
        add(key, _first_code_after(text, f"### {key}", lokasi), lokasi)
    for path in sorted((ROOT / "02_lokasi").glob("LOK-*.md")):
        add(path.stem, _first_code_after(path.read_text(encoding="utf-8"), "## Blok Kunci Latar", path), path)
    return found


def _fmt(t: float) -> str:
    return f"{int(t // 60):02d}:{t % 60:04.1f}"


def main(ep_dir: Path) -> None:
    data = json.loads((ep_dir / "adegan.json").read_text(encoding="utf-8"))
    blocks = _blocks()
    gaya_path = ROOT / "04_prompt" / "prompt-gaya-asas.md"
    gaya_text = gaya_path.read_text(encoding="utf-8")
    gaya = _first_code_after(gaya_text, "## [GAYA] — utama", gaya_path)
    mods = {m: _first_code_after(gaya_text, f"**{m.capitalize()}**", gaya_path) for m in ("komedi", "misteri", "mewah")}
    neg_path = ROOT / "04_prompt" / "prompt-negatif.md"
    negatif = CODE.search(neg_path.read_text(encoding="utf-8")).group(1).strip()

    scenes = data["scene"]
    errors = []
    prev_end = 0.0
    for sc in scenes:
        for key in [*sc["watak"], sc["lokasi"]]:
            if key not in blocks:
                errors.append(f"{sc['id']}: blok '{key}' tiada (tambah fail watak/lokasi dahulu)")
        if abs(sc["mula"] - prev_end) > 0.011:
            errors.append(f"{sc['id']}: mula {sc['mula']} tidak bersambung dengan scene sebelumnya ({prev_end})")
        dur = sc["tamat"] - sc["mula"]
        if not 2.0 <= dur <= 8.0:
            errors.append(f"{sc['id']}: durasi {dur:.2f} s di luar 2–8 s")
        if sc["mod"] not in mods:
            errors.append(f"{sc['id']}: mod '{sc['mod']}' tidak dikenali")
        prev_end = sc["tamat"]
    total = prev_end
    if not 60 <= total <= 120:
        errors.append(f"jumlah durasi {total:.1f} s di luar 60–120 s")
    if errors:
        sys.exit("RALAT:\n- " + "\n- ".join(errors))

    ep = data["episod"]
    head = f"# {ep['kod']} — {ep['tajuk']}"
    note = "> Dijana oleh `alat/bina_episod.py` daripada `adegan.json`. Jangan sunting manual."

    # ---------- Storyboard ----------
    sb = [f"{head} · Storyboard", "", "> Peranan: Storyboard Artist · Status: **MENUNGGU KELULUSAN**", note, "",
          f"**Jumlah durasi:** {total:.1f} s · **Bilangan scene:** {len(scenes)} · "
          f"**Audio:** `{ep['audio']}` ({ep['durasi_audio']:.1f} s)", "",
          "## Ringkasan", "",
          "| SC | Masa | Durasi | Babak | Lokasi | Watak | Kamera | Sari kata |",
          "|---|---|---|---|---|---|---|---|"]
    for sc in scenes:
        sb.append(f"| {sc['id'][2:]} | {_fmt(sc['mula'])}–{_fmt(sc['tamat'])} | {sc['tamat'] - sc['mula']:.1f} s | "
                  f"{sc['babak']} | {sc['lokasi']} | {', '.join(sc['watak'])} | {sc['sudut']} | {sc['sari_kata']} |")
    sb += ["", "---", "", "## Butiran scene", ""]
    for sc in scenes:
        dur = sc["tamat"] - sc["mula"]
        sb += [f"### {sc['id']} — {sc['tajuk']} ({_fmt(sc['mula'])}–{_fmt(sc['tamat'])}, {dur:.1f} s)",
               f"- Babak: {sc['babak']}",
               f"- Lokasi: {sc['lokasi']}",
               f"- Watak: {', '.join(sc['watak'])}",
               f"- Visual: {sc['visual']}",
               f"- Gerakan watak: {sc['gerakan']}",
               f"- Ekspresi: {sc['ekspresi']}",
               f"- Dialog: {sc['dialog']}",
               f"- Sudut kamera: {sc['sudut']}",
               f"- Gerakan kamera: {sc['gerak_kamera']}",
               f"- Teknik animasi: {sc['teknik']}",
               f"- Bunyi/SFX: {sc['sfx']}",
               f"- Sari kata: {sc['sari_kata']}",
               f"- Cap masa suara: {sc['cap_suara']}",
               f"- Nota suntingan: {sc['nota_sunting']}",
               f"- Prompt animasi: `05_prompt-video.md` → {sc['id']}", ""]
    (ep_dir / "04_storyboard.md").write_text("\n".join(sb), encoding="utf-8")

    # ---------- Prompt ----------
    pr = [f"{head} · Prompt Video AI", "", "> Peranan: Pakar Prompt AI Video · Status: **MENUNGGU KELULUSAN**", note,
          "> Salin satu blok kod = satu klip. Jana satu scene, semak, barulah scene seterusnya.", "",
          "## Imej rujukan yang perlu dimuat naik ke alat AI", "",
          "| Watak | Scene | Fail rujukan |", "|---|---|---|"]
    used: dict[str, list[str]] = {}
    for sc in scenes:
        for w in sc["watak"]:
            used.setdefault(w, []).append(sc["id"][2:])
    for w, ids in used.items():
        pr.append(f"| `{w}` | {', '.join(ids)} | `05_aset/watak/{OWNER[w]}/` |")
    pr += ["", "---", ""]
    for sc in scenes:
        dur = sc["tamat"] - sc["mula"]
        watak = "\n\n".join(blocks[w] for w in sc["watak"])
        pencahayaan = mods[sc["mod"]] + (f" {sc['cahaya']}" if sc.get("cahaya") else "")
        bercakap = "ya" if sc["bercakap"] else "tidak (narasi luar skrin)"
        pr += [f"### {sc['id']} — {sc['tajuk']} ({dur:.1f} s · {_fmt(sc['mula'])}–{_fmt(sc['tamat'])})", "", "```",
               gaya, "",
               f"[WATAK]\n{watak}", "",
               f"[LATAR] {blocks[sc['lokasi']]}", "",
               f"[AKSI] {sc['visual']} {sc['gerakan']}", "",
               f"[EKSPRESI] {sc['ekspresi']}", "",
               f"[KAMERA] {sc['sudut']}. {sc['gerak_kamera']}. Teknik: {sc['teknik']}.", "",
               f"[PENCAHAYAAN] {pencahayaan}", "",
               f"[TEKNIKAL] Menegak 9:16, {dur:.1f} saat (jana 5 saat, potong semasa suntingan), subjek di tengah "
               f"bingkai, bahagian bawah dan kanan bingkai kosong daripada butiran penting, mulut bercakap: {bercakap}, "
               "tiada teks atau huruf dalam visual.", "",
               negatif, "```", "",
               f"**Suntingan:** suara {sc['cap_suara']} · SFX: {sc['sfx']} · Sari kata: {sc['sari_kata']} · {sc['nota_sunting']}",
               "", "| Versi | Alat | Keputusan | Catatan |", "|---|---|---|---|", "| v1 | | ✅ / ❌ | |", "", "---", ""]
    (ep_dir / "05_prompt-video.md").write_text("\n".join(pr), encoding="utf-8")
    print(f"OK: {len(scenes)} scene, {total:.1f} s → 04_storyboard.md, 05_prompt-video.md")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]).resolve())

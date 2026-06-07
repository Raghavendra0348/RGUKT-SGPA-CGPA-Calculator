#!/usr/bin/env python3
"""
Extract subject/grade data from all calculator HTML files
and produce subjects.json for the unified calculator template.
"""

import re, json, glob, os

BASE = os.path.dirname(__file__)

# Map filenames → (branch, year, sem, title)
FILE_MAP = {
    "cse_e1s1.html":       ("cse",      1, 1, "CSE E-01 SEM-01"),
    "cse(e1s2).html":      ("cse",      1, 2, "CSE E-01 SEM-02"),
    "cse(e2s1).html":      ("cse",      2, 1, "CSE E-02 SEM-01"),
    "cse(e2s2).html":      ("cse",      2, 2, "CSE E-02 SEM-02"),
    "cse(e3s1).html":      ("cse",      3, 1, "CSE E-03 SEM-01"),
    "cse(e3s2).html":      ("cse",      3, 2, "CSE E-03 SEM-02"),
    "cse(e4s1).html":      ("cse",      4, 1, "CSE E-04 SEM-01"),
    "cse(e4s2).html":      ("cse",      4, 2, "CSE E-04 SEM-02"),
    "ece(e1s1).html":      ("ece",      1, 1, "ECE E-01 SEM-01"),
    "ece(e1s2).html":      ("ece",      1, 2, "ECE E-01 SEM-02"),
    "ece(e2s1).html":      ("ece",      2, 1, "ECE E-02 SEM-01"),
    "ece(e2s2).html":      ("ece",      2, 2, "ECE E-02 SEM-02"),
    "ece(e3s1).html":      ("ece",      3, 1, "ECE E-03 SEM-01"),
    "ece(e3s2).html":      ("ece",      3, 2, "ECE E-03 SEM-02"),
    "ece(e4s1).html":      ("ece",      4, 1, "ECE E-04 SEM-01"),
    "ece(e4s2).html":      ("ece",      4, 2, "ECE E-04 SEM-02"),
    "eee(e1s1).html":      ("eee",      1, 1, "EEE E-01 SEM-01"),
    "eee(e1s2).html":      ("eee",      1, 2, "EEE E-01 SEM-02"),
    "eee(e2s1).html":      ("eee",      2, 1, "EEE E-02 SEM-01"),
    "eee(e2s2).html":      ("eee",      2, 2, "EEE E-02 SEM-02"),
    "eee(e3s1).html":      ("eee",      3, 1, "EEE E-03 SEM-01"),
    "eee(e3s2).html":      ("eee",      3, 2, "EEE E-03 SEM-02"),
    "eee(e4s1).html":      ("eee",      4, 1, "EEE E-04 SEM-01"),
    "eee(e4s2).html":      ("eee",      4, 2, "EEE E-04 SEM-02"),
    "civil(e1s1).html":    ("civil",    1, 1, "CIVIL E-01 SEM-01"),
    "civil(e1s2).html":    ("civil",    1, 2, "CIVIL E-01 SEM-02"),
    "civil(e2s1).html":    ("civil",    2, 1, "CIVIL E-02 SEM-01"),
    "civil(e2s2).html":    ("civil",    2, 2, "CIVIL E-02 SEM-02"),
    "civil(e3s1).html":    ("civil",    3, 1, "CIVIL E-03 SEM-01"),
    "civil(e3s2).html":    ("civil",    3, 2, "CIVIL E-03 SEM-02"),
    "civil(e4s1).html":    ("civil",    4, 1, "CIVIL E-04 SEM-01"),
    "civil(e4s2).html":    ("civil",    4, 2, "CIVIL E-04 SEM-02"),
    "mech(e1s1).html":     ("mech",     1, 1, "MECH E-01 SEM-01"),
    "mech(e1s2).html":     ("mech",     1, 2, "MECH E-01 SEM-02"),
    "mech(e2s1).html":     ("mech",     2, 1, "MECH E-02 SEM-01"),
    "mech(e2s2).html":     ("mech",     2, 2, "MECH E-02 SEM-02"),
    "mech(e3s1).html":     ("mech",     3, 1, "MECH E-03 SEM-01"),
    "mech(e3s2).html":     ("mech",     3, 2, "MECH E-03 SEM-02"),
    "mech(e4s1).html":     ("mech",     4, 1, "MECH E-04 SEM-01"),
    "mech(e4s2).html":     ("mech",     4, 2, "MECH E-04 SEM-02"),
    "mme(e1s1).html":      ("mme",      1, 1, "MME E-01 SEM-01"),
    "mme(e1s2).html":      ("mme",      1, 2, "MME E-01 SEM-02"),
    "mme(e2s1).html":      ("mme",      2, 1, "MME E-02 SEM-01"),
    "mme(e2s2).html":      ("mme",      2, 2, "MME E-02 SEM-02"),
    "mme(e3s1).html":      ("mme",      3, 1, "MME E-03 SEM-01"),
    "mme(e3s2).html":      ("mme",      3, 2, "MME E-03 SEM-02"),
    "mme(e4s1).html":      ("mme",      4, 1, "MME E-04 SEM-01"),
    "mme(e4s2).html":      ("mme",      4, 2, "MME E-04 SEM-02"),
    "chemical(e1s1).html": ("chemical", 1, 1, "CHEMICAL E-01 SEM-01"),
    "chemical(e1s2).html": ("chemical", 1, 2, "CHEMICAL E-01 SEM-02"),
    "chemical(e2s1).html": ("chemical", 2, 1, "CHEMICAL E-02 SEM-01"),
    "chemical(e2s2).html": ("chemical", 2, 2, "CHEMICAL E-02 SEM-02"),
    "chemical(e3s1).html": ("chemical", 3, 1, "CHEMICAL E-03 SEM-01"),
    "chemical(e3s2).html": ("chemical", 3, 2, "CHEMICAL E-03 SEM-02"),
    "chemical(e4s1).html": ("chemical", 4, 1, "CHEMICAL E-04 SEM-01"),
    "chemical(e4s2).html": ("chemical", 4, 2, "CHEMICAL E-04 SEM-02"),
}

GRADE_LETTERS = ["EX", "A", "B", "C", "D", "E"]

def parse_file(filepath):
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    # Find all <select> elements
    select_pattern = re.compile(
        r'<select[^>]*\s+id=["\']([^"\']+)["\'][^>]*>(.*?)</select>',
        re.DOTALL | re.IGNORECASE
    )
    option_pattern = re.compile(
        r'<option[^>]*\s+value=["\']([^"\']+)["\'][^>]*>([^<]+)</option>',
        re.IGNORECASE
    )
    label_pattern = re.compile(
        r'<label[^>]*\s+for=["\']([^"\']+)["\'][^>]*>([^<]+)</label>',
        re.IGNORECASE
    )

    # Build label map: {id -> label_text}
    labels = {}
    for m in label_pattern.finditer(content):
        lid, ltext = m.group(1).strip(), m.group(2).strip()
        labels[lid] = ltext

    subjects = []
    seen_ids = set()

    for sm in select_pattern.finditer(content):
        sid = sm.group(1).strip()
        # Skip CGPA semester inputs and duplicate IDs
        if sid.startswith("Sem") or sid in seen_ids:
            continue
        seen_ids.add(sid)

        options = []
        for om in option_pattern.finditer(sm.group(2)):
            val_str = om.group(1).strip()
            opt_text = om.group(2).strip()
            try:
                val = float(val_str)
            except ValueError:
                continue
            options.append({"grade": opt_text, "value": val})

        if not options:
            continue

        # Deduce credits: value of grade "A" (first non-zero option)
        # For the credit-loss model: A = 1*credits, B = 2*credits...
        # Find the first option with grade letter A or value == min non-zero
        non_zero = [o for o in options if o["value"] != 0 and o["grade"] not in ("REM",)]
        if not non_zero:
            credits = 0
        else:
            # credits = value of A option (which is credits * 1)
            a_options = [o for o in non_zero if o["grade"] == "A"]
            credits = a_options[0]["value"] if a_options else non_zero[0]["value"]

        label = labels.get(sid, sid)
        # Clean label: remove trailing "Grade" word
        label = re.sub(r'\s+Grade\s*$', '', label, flags=re.IGNORECASE).strip()

        subjects.append({
            "id": sid,
            "name": label,
            "credits": credits
        })

    # Extract the SGPA formula denominator from the calculate function
    # Pattern: (NNN - sum) / NN.N  OR  (NNN - sum) / NNN
    formula_match = re.search(
        r'\(\s*(\d+(?:\.\d+)?)\s*-\s*sum\s*\)\s*/\s*(\d+(?:\.\d+)?)',
        content
    )
    if formula_match:
        max_points = float(formula_match.group(1))
        divisor = float(formula_match.group(2))
    else:
        # Fallback: compute from subjects
        total_credits = sum(s["credits"] for s in subjects)
        max_points = total_credits * 10
        divisor = total_credits

    # Detect how many CGPA semesters this file shows
    cgpa_sem_matches = re.findall(r'id=["\']Sem(\d+)["\']', content)
    max_cgpa_sem = max((int(x) for x in cgpa_sem_matches), default=0)

    return {
        "subjects": subjects,
        "maxPoints": max_points,
        "divisor": divisor,
        "cgpaSemesters": max_cgpa_sem
    }


result = {}

for fname, (branch, year, sem, title) in FILE_MAP.items():
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f"MISSING: {fname}")
        continue

    data = parse_file(fpath)
    key = f"{branch}_e{year}s{sem}"

    result[key] = {
        "branch": branch.upper(),
        "year": year,
        "sem": sem,
        "title": title,
        "subjects": data["subjects"],
        "maxPoints": data["maxPoints"],
        "divisor": data["divisor"],
        "cgpaSemesters": data["cgpaSemesters"]
    }
    print(f"OK  {fname:30s}  subjects={len(data['subjects'])}  formula=({data['maxPoints']}-sum)/{data['divisor']}  cgpa_sems={data['cgpaSemesters']}")

out_path = os.path.join(BASE, "subjects.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"\nWrote {len(result)} entries to subjects.json")

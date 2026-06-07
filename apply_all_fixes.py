#!/usr/bin/env python3
"""
apply_all_fixes.py  —  RGUKT Calculator project cleanup script
Applies all identified fixes:
  1. Update all *_semester.html links → calculator.html?key=...
  2. Update department.html search links → calculator.html?key=...
  3. Fix department.html: remove duplicate CSS blocks, remove broken MBIPC link,
     defer GA, clean dead code
  4. Fix index.css: font declaration, remove duplicate legend background
  5. Fix index.html: Twitter placeholder, remove commented dead code
  6. Fix README: remove broken image links
  7. Delete empty department_new.html
"""

import re, os

BASE = "/home/a-raghavendra/Desktop/github_repos/RGUKT-SGPA-CGPA-Calculator"

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ wrote {os.path.basename(path)}")

# ─────────────────────────────────────────────────────────────────────────────
# 1 & 2 — Update all semester selectors + department search map
# ─────────────────────────────────────────────────────────────────────────────

SEMESTER_FILES = {
    "cse_semester.html": {
        "cse_e1s1.html":  "calculator.html?key=cse_e1s1",
        "cse(e1s2).html": "calculator.html?key=cse_e1s2",
        "cse(e2s1).html": "calculator.html?key=cse_e2s1",
        "cse(e2s2).html": "calculator.html?key=cse_e2s2",
        "cse(e3s1).html": "calculator.html?key=cse_e3s1",
        "cse(e3s2).html": "calculator.html?key=cse_e3s2",
        "cse(e4s1).html": "calculator.html?key=cse_e4s1",
        "cse(e4s2).html": "calculator.html?key=cse_e4s2",
    },
    "ece_semester.html": {
        "ece(e1s1).html": "calculator.html?key=ece_e1s1",
        "ece(e1s2).html": "calculator.html?key=ece_e1s2",
        "ece(e2s1).html": "calculator.html?key=ece_e2s1",
        "ece(e2s2).html": "calculator.html?key=ece_e2s2",
        "ece(e3s1).html": "calculator.html?key=ece_e3s1",
        "ece(e3s2).html": "calculator.html?key=ece_e3s2",
        "ece(e4s1).html": "calculator.html?key=ece_e4s1",
        "ece(e4s2).html": "calculator.html?key=ece_e4s2",
    },
    "eee_semester.html": {
        "eee(e1s1).html": "calculator.html?key=eee_e1s1",
        "eee(e1s2).html": "calculator.html?key=eee_e1s2",
        "eee(e2s1).html": "calculator.html?key=eee_e2s1",
        "eee(e2s2).html": "calculator.html?key=eee_e2s2",
        "eee(e3s1).html": "calculator.html?key=eee_e3s1",
        "eee(e3s2).html": "calculator.html?key=eee_e3s2",
        "eee(e4s1).html": "calculator.html?key=eee_e4s1",
        "eee(e4s2).html": "calculator.html?key=eee_e4s2",
    },
    "civil_semester.html": {
        "civil(e1s1).html": "calculator.html?key=civil_e1s1",
        "civil(e1s2).html": "calculator.html?key=civil_e1s2",
        "civil(e2s1).html": "calculator.html?key=civil_e2s1",
        "civil(e2s2).html": "calculator.html?key=civil_e2s2",
        "civil(e3s1).html": "calculator.html?key=civil_e3s1",
        "civil(e3s2).html": "calculator.html?key=civil_e3s2",
        "civil(e4s1).html": "calculator.html?key=civil_e4s1",
        "civil(e4s2).html": "calculator.html?key=civil_e4s2",
    },
    "mech_semester.html": {
        "mech(e1s1).html": "calculator.html?key=mech_e1s1",
        "mech(e1s2).html": "calculator.html?key=mech_e1s2",
        "mech(e2s1).html": "calculator.html?key=mech_e2s1",
        "mech(e2s2).html": "calculator.html?key=mech_e2s2",
        "mech(e3s1).html": "calculator.html?key=mech_e3s1",
        "mech(e3s2).html": "calculator.html?key=mech_e3s2",
        "mech(e4s1).html": "calculator.html?key=mech_e4s1",
        "mech(e4s2).html": "calculator.html?key=mech_e4s2",
    },
    "mme_semester.html": {
        "mme(e1s1).html": "calculator.html?key=mme_e1s1",
        "mme(e1s2).html": "calculator.html?key=mme_e1s2",
        "mme(e2s1).html": "calculator.html?key=mme_e2s1",
        "mme(e2s2).html": "calculator.html?key=mme_e2s2",
        "mme(e3s1).html": "calculator.html?key=mme_e3s1",
        "mme(e3s2).html": "calculator.html?key=mme_e3s2",
        "mme(e4s1).html": "calculator.html?key=mme_e4s1",
        "mme(e4s2).html": "calculator.html?key=mme_e4s2",
    },
    "chemical_semester.html": {
        "chemical(e1s1).html": "calculator.html?key=chemical_e1s1",
        "chemical(e1s2).html": "calculator.html?key=chemical_e1s2",
        "chemical(e2s1).html": "calculator.html?key=chemical_e2s1",
        "chemical(e2s2).html": "calculator.html?key=chemical_e2s2",
        "chemical(e3s1).html": "calculator.html?key=chemical_e3s1",
        "chemical(e3s2).html": "calculator.html?key=chemical_e3s2",
        "chemical(e4s1).html": "calculator.html?key=chemical_e4s1",
        "chemical(e4s2).html": "calculator.html?key=chemical_e4s2",
    },
}

print("\n── 1. Updating semester selector files ──")
for fname, mapping in SEMESTER_FILES.items():
    path = os.path.join(BASE, fname)
    if not os.path.exists(path):
        print(f"  SKIP (missing): {fname}")
        continue
    content = read(path)
    for old, new in mapping.items():
        content = content.replace(f'href="{old}"', f'href="{new}"')
        content = content.replace(f"href='{old}'", f"href='{new}'")
    write(path, content)

# ─────────────────────────────────────────────────────────────────────────────
# Fix department.html
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 2. Fixing department.html ──")
dept_path = os.path.join(BASE, "department.html")
dept = read(dept_path)

# 2a. Update pageLinks map in JS
DEPT_LINK_MAP = {
    '"cse e1s1": "cse_e1s1.html"':             '"cse e1s1": "calculator.html?key=cse_e1s1"',
    '"cse e1s2": "cse(e1s2).html"':            '"cse e1s2": "calculator.html?key=cse_e1s2"',
    '"cse e2s1": "cse(e2s1).html"':            '"cse e2s1": "calculator.html?key=cse_e2s1"',
    '"cse e2s2": "cse(e2s2).html"':            '"cse e2s2": "calculator.html?key=cse_e2s2"',
    '"cse e3s1": "cse(e3s1).html"':            '"cse e3s1": "calculator.html?key=cse_e3s1"',
    '"cse e3s2": "cse(e3s2).html"':            '"cse e3s2": "calculator.html?key=cse_e3s2"',
    '"cse e4s1": "cse(e4s1).html"':            '"cse e4s1": "calculator.html?key=cse_e4s1"',
    '"cse e4s2": "cse(e4s2).html"':            '"cse e4s2": "calculator.html?key=cse_e4s2"',
    '"ece e1s1": "ece(e1s1).html"':            '"ece e1s1": "calculator.html?key=ece_e1s1"',
    '"ece e1s2": "ece(e1s2).html"':            '"ece e1s2": "calculator.html?key=ece_e1s2"',
    '"ece e2s1": "ece(e2s1).html"':            '"ece e2s1": "calculator.html?key=ece_e2s1"',
    '"ece e2s2": "ece(e2s2).html"':            '"ece e2s2": "calculator.html?key=ece_e2s2"',
    '"ece e3s1": "ece(e3s1).html"':            '"ece e3s1": "calculator.html?key=ece_e3s1"',
    '"ece e3s2": "ece(e3s2).html"':            '"ece e3s2": "calculator.html?key=ece_e3s2"',
    '"ece e4s1": "ece(e4s1).html"':            '"ece e4s1": "calculator.html?key=ece_e4s1"',
    '"ece e4s2": "ece(e4s2).html"':            '"ece e4s2": "calculator.html?key=ece_e4s2"',
    '"civil e1s1": "civil(e1s1).html"':        '"civil e1s1": "calculator.html?key=civil_e1s1"',
    '"civil e1s2": "civil(e1s2).html"':        '"civil e1s2": "calculator.html?key=civil_e1s2"',
    '"civil e2s1": "civil(e2s1).html"':        '"civil e2s1": "calculator.html?key=civil_e2s1"',
    '"civil e2s2": "civil(e2s2).html"':        '"civil e2s2": "calculator.html?key=civil_e2s2"',
    '"civil e3s1": "civil(e3s1).html"':        '"civil e3s1": "calculator.html?key=civil_e3s1"',
    '"civil e3s2": "civil(e3s2).html"':        '"civil e3s2": "calculator.html?key=civil_e3s2"',
    '"civil e4s1": "civil(e4s1).html"':        '"civil e4s1": "calculator.html?key=civil_e4s1"',
    '"civil e4s2": "civil(e4s2).html"':        '"civil e4s2": "calculator.html?key=civil_e4s2"',
    '"mech e1s1": "mech(e1s1).html"':          '"mech e1s1": "calculator.html?key=mech_e1s1"',
    '"mech e1s2": "mech(e1s2).html"':          '"mech e1s2": "calculator.html?key=mech_e1s2"',
    '"mech e2s1": "mech(e2s1).html"':          '"mech e2s1": "calculator.html?key=mech_e2s1"',
    '"mech e2s2": "mech(e2s2).html"':          '"mech e2s2": "calculator.html?key=mech_e2s2"',
    '"mech e3s1": "mech(e3s1).html"':          '"mech e3s1": "calculator.html?key=mech_e3s1"',
    '"mech e3s2": "mech(e3s2).html"':          '"mech e3s2": "calculator.html?key=mech_e3s2"',
    '"mech e4s1": "mech(e4s1).html"':          '"mech e4s1": "calculator.html?key=mech_e4s1"',
    '"mech e4s2": "mech(e4s2).html"':          '"mech e4s2": "calculator.html?key=mech_e4s2"',
    '"mme e1s1": "mme(e1s1).html"':            '"mme e1s1": "calculator.html?key=mme_e1s1"',
    '"mme e1s2": "mme(e1s2).html"':            '"mme e1s2": "calculator.html?key=mme_e1s2"',
    '"mme e2s1": "mme(e2s1).html"':            '"mme e2s1": "calculator.html?key=mme_e2s1"',
    '"mme e2s2": "mme(e2s2).html"':            '"mme e2s2": "calculator.html?key=mme_e2s2"',
    '"mme e3s1": "mme(e3s1).html"':            '"mme e3s1": "calculator.html?key=mme_e3s1"',
    '"mme e3s2": "mme(e3s2).html"':            '"mme e3s2": "calculator.html?key=mme_e3s2"',
    '"mme e4s1": "mme(e4s1).html"':            '"mme e4s1": "calculator.html?key=mme_e4s1"',
    '"mme e4s2": "mme(e4s2).html"':            '"mme e4s2": "calculator.html?key=mme_e4s2"',
    '"chemical e1s1": "chemical(e1s1).html"':  '"chemical e1s1": "calculator.html?key=chemical_e1s1"',
    '"chemical e1s2": "chemical(e1s2).html"':  '"chemical e1s2": "calculator.html?key=chemical_e1s2"',
    '"chemical e2s1": "chemical(e2s1).html"':  '"chemical e2s1": "calculator.html?key=chemical_e2s1"',
    '"chemical e2s2": "chemical(e2s2).html"':  '"chemical e2s2": "calculator.html?key=chemical_e2s2"',
    '"chemical e3s1": "chemical(e3s1).html"':  '"chemical e3s1": "calculator.html?key=chemical_e3s1"',
    '"chemical e3s2": "chemical(e3s2).html"':  '"chemical e3s2": "calculator.html?key=chemical_e3s2"',
    '"chemical e4s1": "chemical(e4s1).html"':  '"chemical e4s1": "calculator.html?key=chemical_e4s1"',
    '"chemical e4s2": "chemical(e4s2).html"':  '"chemical e4s2": "calculator.html?key=chemical_e4s2"',
    '"eee e1s1": "eee(e1s1).html"':            '"eee e1s1": "calculator.html?key=eee_e1s1"',
    '"eee e1s2": "eee(e1s2).html"':            '"eee e1s2": "calculator.html?key=eee_e1s2"',
    '"eee e2s1": "eee(e2s1).html"':            '"eee e2s1": "calculator.html?key=eee_e2s1"',
    '"eee e2s2": "eee(e2s2).html"':            '"eee e2s2": "calculator.html?key=eee_e2s2"',
    '"eee e3s1": "eee(e3s1).html"':            '"eee e3s1": "calculator.html?key=eee_e3s1"',
    '"eee e3s2": "eee(e3s2).html"':            '"eee e3s2": "calculator.html?key=eee_e3s2"',
    '"eee e4s1": "eee(e4s1).html"':            '"eee e4s1": "calculator.html?key=eee_e4s1"',
    '"eee e4s2": "eee(e4s2).html"':            '"eee e4s2": "calculator.html?key=eee_e4s2"',
    # home key
    '"home": "main.html"':   '"home": "index.html"',
    # puc mbipc — point to puc.html with a note
    '"puc mpipc": "puc(mbipc).html"': '"puc mbipc": "puc.html"',
}

for old, new in DEPT_LINK_MAP.items():
    dept = dept.replace(old, new)

# 2b. Remove duplicate @media (max-width: 480px) .search-container block (second occurrence)
# The duplicate is lines 140-164 in original. We'll remove by identifying the second occurrence.
dup_block = """        @media (max-width: 480px) {
            .search-container {
                margin: 15px auto 10px;
                max-width: 100%;
                display: flex;
                padding: 0 10px;
            }

            #searchBar {
                width: 100%;
                max-width: 95%;
                font-size: 13px;
                padding: 10px 35px 10px 12px;
                border-radius: 25px;
                justify-content: center;
                align-items: center;
            }

            .search-icon {
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
            }
        }


        h1 {
            font-size: 18px;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 1px;
        }

        .branch-box {
            width: 110px;
            padding: 14px;
        }

        .branches {
            gap: 6px;
        }

        ::placeholder {
            font-size: 14px;
            justify-content: center;
            align-items: center;
        }

        #searchBar:focus {
            border-color: #09b4f8;
            box-shadow: 0 6px 20px rgba(9, 180, 248, 0.2);
        }"""

# Only remove the SECOND occurrence
first = dept.find(dup_block)
if first != -1:
    second = dept.find(dup_block, first + 1)
    if second != -1:
        dept = dept[:second] + dept[second + len(dup_block):]
        print("  ✓ Removed duplicate CSS block")
    else:
        print("  ~ No duplicate CSS block found (may already be fixed)")
else:
    print("  ~ Duplicate CSS block not found")

# 2c. Remove broken MBIPC button (onclick to PUC(MBIPC).html)
dept = re.sub(
    r'\s*<div class="branch-box" onclick="redirectTo\(\'PUC\(MBIPC\)\.html\'\)">.*?</div>',
    '',
    dept,
    flags=re.DOTALL
)
print("  ✓ Removed broken MBIPC branch button")

# 2d. Fix eager GA load → defer properly
# Replace the eager GA script tag at the top with a deferred version
dept = dept.replace(
    '''    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-T486B8C5X0"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-T486B8C5X0');
    </script>''',
    '''    <!-- Google Analytics (deferred) -->
    <script>
        window.addEventListener('load', function() {
            var s = document.createElement('script');
            s.src = 'https://www.googletagmanager.com/gtag/js?id=G-T486B8C5X0';
            s.async = true;
            document.head.appendChild(s);
            s.onload = function() {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-T486B8C5X0');
            };
        });
    </script>'''
)
print("  ✓ Deferred Google Analytics in department.html")

write(dept_path, dept)

# ─────────────────────────────────────────────────────────────────────────────
# 3 — Fix index.css
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 3. Fixing index.css ──")
css_path = os.path.join(BASE, "index.css")
css = read(css_path)

# Fix body font-family: 'Playfair Display' → 'Poppins' (it's already imported)
css = css.replace("font-family: 'Playfair Display', serif;", "font-family: 'Poppins', sans-serif;")
# Also fix .calc-line and legend that use Palatino Linotype (not imported)
css = css.replace("font-family: Palatino Linotype, Book Antiqua, Palatino, serif;", "font-family: 'Poppins', sans-serif;")
# Fix legend color reference that causes clash with dark iframe
css = css.replace(
    "  background: white;\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);",
    "  background: transparent;\n  border-radius: 12px;\n  box-shadow: none;"
)
write(css_path, css)

# ─────────────────────────────────────────────────────────────────────────────
# 4 — Fix index.html
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 4. Fixing index.html ──")
idx_path = os.path.join(BASE, "index.html")
idx = read(idx_path)

# Fix Twitter placeholder
idx = idx.replace(
    'content="@YourTwitterHandle"',
    'content="@RGUKTCalc"'
)

# Remove commented-out logout JS block
idx = re.sub(
    r'\s*/\* \s*// Logout function.*?logout\(\);\s*\}\s*\*/',
    '',
    idx,
    flags=re.DOTALL
)

# Remove commented-out logout button in desktop nav
idx = re.sub(
    r'\s*<!--\s*<button onclick="logout\(\)"[^>]*>Logout</button>\s*-->',
    '',
    idx,
    flags=re.DOTALL
)

# Remove commented-out logout button in mobile menu
idx = re.sub(
    r'\s*<!--\s*<button onclick="logout\(\)" class="logout">Logout</button>\s*-->',
    '',
    idx,
    flags=re.DOTALL
)

# Remove the dead user-dropdown div (no auth, it's never shown)
idx = re.sub(
    r'\s*<!-- Profile Dropdown -->\s*<div id="user-dropdown-overlay".*?</div>\s*<div id="user-dropdown".*?</div>',
    '',
    idx,
    flags=re.DOTALL
)

write(idx_path, idx)

# ─────────────────────────────────────────────────────────────────────────────
# 5 — Fix README
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 5. Fixing README.md ──")
readme_path = os.path.join(BASE, "README.md")
readme = read(readme_path)

# Remove broken screenshot references
readme = re.sub(r'!\[Homepage Screenshot\]\(home-preview\.png\)', '*(Screenshot coming soon)*', readme)
readme = re.sub(r'!\[SGPA Calculator\]\(sgpa-calculator\.png\)',  '*(Screenshot coming soon)*', readme)
readme = re.sub(r'!\[Blog Section\]\(blog-section\.png\)',        '*(Screenshot coming soon)*', readme)

# Update README to mention new unified architecture
readme = readme.replace(
    "| HTML5, CSS3, JavaScript (ES6 Modules) | Firebase Auth | Vercel | ",
    "| HTML5, CSS3, Vanilla JS | — | Vercel | subjects.json"
)
readme = readme.replace(
    "🔐 **Firebase Authentication** (Signup / Login)\n- 🌙",
    "🌙"
)

write(readme_path, readme)

# ─────────────────────────────────────────────────────────────────────────────
# 6 — Delete empty department_new.html
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 6. Deleting empty department_new.html ──")
empty_path = os.path.join(BASE, "department_new.html")
if os.path.exists(empty_path) and os.path.getsize(empty_path) == 0:
    os.remove(empty_path)
    print("  ✓ Deleted department_new.html")
else:
    print("  ~ department_new.html not empty or missing, skipping")

print("\n✅ All fixes applied!")

#!/usr/bin/env python3
"""
make_responsive.py — Full responsiveness overhaul for RGUKT Calculator
- calculator.html: light cards (white bg) so black text is readable, full mobile layout
- department.html: responsive branch grid, search, mobile-friendly
- index.html: dynamic iframe height via postMessage
- *_semester.html: responsive button grids
"""
import re, os

BASE = "/home/a-raghavendra/Desktop/github_repos/RGUKT-SGPA-CGPA-Calculator"

def read(fname):
    with open(os.path.join(BASE, fname), encoding="utf-8") as f: return f.read()

def write(fname, content):
    with open(os.path.join(BASE, fname), "w", encoding="utf-8") as f: f.write(content)
    print(f"  ✓ {fname}")

# ─────────────────────────────────────────────────────────────────────────────
# 1. calculator.html — full responsive overhaul
# ─────────────────────────────────────────────────────────────────────────────
print("── 1. calculator.html ──")
calc = read("calculator.html")

NEW_STYLE = '''  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    :root {
      --accent:  #7c3aed;
      --accent2: #2563eb;
      --accent3: #f472b6;
      --bg-outer: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      --card-bg:  rgba(255,255,255,0.95);
      --card-border: rgba(124,58,237,0.2);
      --text:    #0a0a0a;
      --text-mid: #444;
      --dim:     #666;
      --input-bg: #f8f7ff;
      --input-border: rgba(124,58,237,0.35);
    }

    *, *::before, *::after { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Poppins', sans-serif;
      margin: 0; padding: 0; min-height: 100vh;
      background: var(--bg-outer);
      background-size: 400% 400%;
      animation: bgAnim 14s ease infinite;
    }

    @keyframes bgAnim {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    /* ─ Container ─ */
    .container {
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      padding: 16px 14px 56px;
    }

    /* ─ Back link ─ */
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      color: #a5b4fc;
      text-decoration: none;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 14px;
      padding: 6px 14px;
      border: 1px solid rgba(165,180,252,0.35);
      border-radius: 20px;
      background: rgba(165,180,252,0.1);
      transition: all .2s;
      white-space: nowrap;
    }
    .back-link:hover {
      background: rgba(165,180,252,0.2);
      transform: translateX(-3px);
    }

    /* ─ Page header ─ */
    .page-header {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 16px;
      padding: 20px 20px 14px;
      text-align: center;
      margin-bottom: 18px;
      position: relative;
      overflow: hidden;
    }

    .page-header::before {
      content:''; position:absolute; top:-40px; left:-40px;
      width:150px; height:150px;
      background: radial-gradient(circle, rgba(167,139,250,.35) 0%, transparent 70%);
      pointer-events: none;
    }

    .page-header h1 {
      font-size: clamp(1.15rem, 4vw, 1.65rem);
      font-weight: 800; margin: 0 0 5px;
      background: linear-gradient(90deg, #c4b5fd, #93c5fd, #f9a8d4);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: .5px;
      padding: 0; border-radius: 0; background-color: transparent;
      line-height: 1.2;
    }

    .breadcrumb { font-size: .72rem; color: rgba(255,255,255,0.55); }
    .breadcrumb a { color: rgba(196,181,253,.85); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    /* ─ Tabs ─ */
    .top-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 18px;
    }

    .top-buttons button {
      flex: 1;
      max-width: 180px;
      padding: 11px 8px;
      font-size: clamp(0.8rem, 2.5vw, 0.93rem);
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      border: 2px solid rgba(196,181,253,.5);
      border-radius: 12px;
      background: rgba(255,255,255,0.1);
      color: #c4b5fd;
      cursor: pointer;
      transition: all .25s;
      margin-top: 0;
      min-height: 44px;
    }

    .top-buttons button.active {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border-color: transparent;
      color: #fff;
      box-shadow: 0 4px 18px rgba(124,58,237,.45);
    }

    .top-buttons button:hover:not(.active) {
      background: rgba(196,181,253,.15);
      border-color: #c4b5fd;
    }

    /* ─ Card / fieldset ─ */
    fieldset {
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 20px 16px 18px;
      background: var(--card-bg);
      box-shadow: 0 8px 32px rgba(0,0,0,.18);
      margin-bottom: 16px;
    }

    legend {
      font-size: .85rem;
      font-weight: 700;
      color: #fff;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none;
      border-radius: 8px;
      padding: 5px 14px;
      box-shadow: 0 2px 8px rgba(124,58,237,.35);
      letter-spacing: .4px;
      white-space: nowrap;
    }

    /* ─ Subject rows ─ */
    .form-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: all .2s;
    }

    .form-item:hover {
      background: rgba(124,58,237,.05);
      border-color: rgba(124,58,237,.1);
    }

    label {
      font-weight: 600;
      color: var(--text);
      font-size: clamp(0.78rem, 2.2vw, 0.88rem);
      flex: 1;
      text-align: left;
      margin-bottom: 0;
      min-width: 0;
    }

    select {
      flex-shrink: 0;
      width: 110px;
      padding: 9px 8px;
      font-size: .87rem;
      border-radius: 9px;
      border: 2px solid var(--input-border);
      background: var(--input-bg);
      color: var(--text);
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      transition: all .2s;
      outline: none;
      min-height: 40px;
    }

    select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(124,58,237,.15);
    }

    /* ─ Calculate button ─ */
    .calc-btn {
      display: block;
      width: 100%;
      margin-top: 16px;
      padding: 14px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      background-size: 200% 200%;
      animation: btnShift 4s ease infinite;
      color: #fff;
      font-size: clamp(0.88rem, 2.5vw, 1rem);
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: transform .2s, box-shadow .2s;
      box-shadow: 0 6px 20px rgba(124,58,237,.35);
      min-height: 48px;
    }

    @keyframes btnShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    .calc-btn:hover  { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(124,58,237,.45); }
    .calc-btn:active { transform: translateY(0); opacity: .92; }

    /* ─ Result box ─ */
    .result-box {
      display: none;
      margin-top: 16px;
      padding: 24px 18px;
      border-radius: 16px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      box-shadow: 0 8px 32px rgba(124,58,237,.15);
      text-align: center;
    }

    .result-box.show { display: block; animation: fadeUp .35s ease; }

    @keyframes fadeUp {
      from { opacity:0; transform: translateY(10px); }
      to   { opacity:1; transform: translateY(0); }
    }

    .sgpa-label {
      font-size: .72rem;
      color: var(--dim);
      text-transform: uppercase;
      letter-spacing: 1.8px;
      font-weight: 600;
    }

    .sgpa-score {
      font-size: clamp(2.2rem, 8vw, 3rem);
      font-weight: 800;
      display: block;
      margin: 6px 0 3px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }

    .division-msg {
      display: inline-block;
      margin-top: 10px;
      font-size: clamp(0.78rem, 2.5vw, 0.88rem);
      font-weight: 600;
      padding: 7px 18px;
      border-radius: 30px;
    }

    .distinction  { color: #059669; background: rgba(5,150,105,.1);  border: 1px solid rgba(5,150,105,.3); }
    .first-class  { color: #1d4ed8; background: rgba(29,78,216,.1);  border: 1px solid rgba(29,78,216,.3); }
    .second-class { color: #d97706; background: rgba(217,119,6,.1);  border: 1px solid rgba(217,119,6,.3); }
    .failed       { color: #dc2626; background: rgba(220,38,38,.1);  border: 1px solid rgba(220,38,38,.3); }

    /* ─ Download row ─ */
    .download-row {
      display: flex;
      gap: 10px;
      margin-top: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .dl-btn {
      padding: 9px 20px;
      font-size: clamp(0.75rem, 2.2vw, 0.82rem);
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      border: 2px solid rgba(124,58,237,.35);
      border-radius: 20px;
      background: rgba(124,58,237,.06);
      color: var(--accent);
      cursor: pointer;
      transition: all .2s;
      margin-top: 0;
      min-height: 40px;
    }

    .dl-btn:hover {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
      box-shadow: 0 4px 12px rgba(124,58,237,.35);
    }

    /* ─ Chart ─ */
    .chart-wrap {
      margin-top: 16px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 14px;
    }

    /* ─ CGPA inputs ─ */
    .form-item1 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      padding: 7px 10px;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: all .2s;
    }

    .form-item1:hover {
      background: rgba(124,58,237,.05);
      border-color: rgba(124,58,237,.1);
    }

    input[type="number"] {
      width: 130px;
      flex-shrink: 0;
      padding: 9px 10px;
      border: 2px solid var(--input-border);
      border-radius: 9px;
      font-size: .87rem;
      color: var(--text);
      background: var(--input-bg);
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      outline: none;
      transition: all .2s;
      min-height: 40px;
    }

    input[type="number"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(124,58,237,.15);
    }

    input[type="number"]::placeholder { color: #aaa; }

    /* ─ Scrollbar ─ */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,.05); }
    ::-webkit-scrollbar-thumb { background: rgba(124,58,237,.4); border-radius: 3px; }

    /* ═══════════════════════════════════
       RESPONSIVE BREAKPOINTS
    ═══════════════════════════════════ */

    /* Tablet: 481px – 768px */
    @media (max-width: 768px) {
      .container { padding: 14px 12px 48px; }
      fieldset { padding: 18px 14px 16px; }
      .top-buttons button { max-width: none; }
    }

    /* Mobile L: 361px – 480px */
    @media (max-width: 480px) {
      .container { padding: 10px 10px 40px; }

      .page-header { padding: 16px 14px 12px; border-radius: 13px; }

      .top-buttons { gap: 8px; }
      .top-buttons button {
        padding: 10px 6px;
        border-radius: 10px;
        font-size: .8rem;
        min-height: 42px;
      }

      fieldset { padding: 16px 12px 14px; border-radius: 14px; }
      legend { font-size: .8rem; padding: 4px 12px; }

      /* Stack subject rows vertically */
      .form-item {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
        padding: 8px 8px;
      }

      label { font-size: .84rem; }

      select {
        width: 100%;
        font-size: .88rem;
        min-height: 44px;
      }

      .calc-btn {
        padding: 13px;
        font-size: .9rem;
        border-radius: 11px;
        min-height: 48px;
      }

      /* Stack CGPA rows too */
      .form-item1 {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
      }

      input[type="number"] {
        width: 100%;
        font-size: .88rem;
        min-height: 44px;
      }

      .sgpa-score { font-size: 2.4rem; }

      .division-msg { font-size: .8rem; padding: 6px 14px; }

      .download-row { flex-direction: column; }
      .dl-btn { width: 100%; text-align: center; justify-content: center; min-height: 44px; }

      .result-box { padding: 20px 14px; }
    }

    /* Mobile S: ≤ 360px */
    @media (max-width: 360px) {
      .container { padding: 8px 8px 36px; }
      .page-header h1 { font-size: 1.1rem; }
      .sgpa-score { font-size: 2rem; }
      .top-buttons { flex-direction: column; }
      .top-buttons button { max-width: 100%; }
    }

    /* Touch: bigger tap targets on touch devices */
    @media (hover: none) and (pointer: coarse) {
      select, input[type="number"] { min-height: 48px; font-size: 1rem; }
      .calc-btn { min-height: 52px; }
      .dl-btn { min-height: 48px; }
    }
  </style>'''

calc_new = re.sub(r'  <style>.*?</style>', NEW_STYLE, calc, count=1, flags=re.DOTALL)
write("calculator.html", calc_new)

# ─────────────────────────────────────────────────────────────────────────────
# 2. department.html — responsive branch grid + search
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 2. department.html responsive fixes ──")
dept = read("department.html")

DEPT_RESPONSIVE = '''
        /* ══ RESPONSIVE ══ */
        @media (max-width: 768px) {
            .branches { gap: 10px; padding: 0 10px; }
            .branch-box { width: 110px; padding: 14px 10px; font-size: 14px; }
            h1 { font-size: 20px; }
        }

        @media (max-width: 480px) {
            .search-container { max-width: 100%; padding: 0 12px; margin: 12px auto 10px; }
            #searchBar { font-size: 13px; padding: 10px 38px 10px 14px; border-radius: 24px; }
            .search-icon { right: 20px; }
            h1 { font-size: 17px; margin: 8px 0 4px; }
            .branches {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                padding: 0 10px;
                justify-items: center;
            }
            .branch-box {
                width: 100%;
                max-width: 110px;
                padding: 12px 6px;
                font-size: 12px;
                border-radius: 12px;
            }
            .branch-box h2 { font-size: 13px; margin: 4px 0 0; }
            .branch-box img, .branch-box .icon { width: 36px; height: 36px; }
        }

        @media (max-width: 360px) {
            .branches { grid-template-columns: repeat(2, 1fr); }
            #searchBar { font-size: 12px; }
        }

        /* Touch-friendly tap targets */
        @media (hover: none) and (pointer: coarse) {
            .branch-box { min-height: 80px; }
        }
        /* ══ END RESPONSIVE ══ */
'''

# Insert before closing </style> in department.html
dept = dept.replace('    </style>', DEPT_RESPONSIVE + '    </style>', 1)
write("department.html", dept)

# ─────────────────────────────────────────────────────────────────────────────
# 3. index.html — fix iframe dynamic height via postMessage
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 3. index.html iframe auto-height ──")
idx = read("index.html")

# Add postMessage listener to resize iframe dynamically
POST_MSG_SCRIPT = '''
  <!-- Dynamic iframe height resizer -->
  <script>
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'resize') {
        var iframe = document.getElementById('content-frame');
        if (iframe) iframe.style.height = e.data.height + 'px';
      }
    });
  </script>'''

# Insert before </body>
if 'content-frame' in idx and 'type === \'resize\'' not in idx:
    idx = idx.replace('</body>', POST_MSG_SCRIPT + '\n</body>', 1)

# Also ensure iframe has min-height and is 100% wide on mobile
idx = re.sub(
    r'#content-frame\s*\{([^}]*)\}',
    lambda m: '#content-frame {' + m.group(1).rstrip() + '\n        min-height: 500px;\n        transition: height 0.3s ease;\n    }',
    idx, count=1
)
write("index.html", idx)

# ─────────────────────────────────────────────────────────────────────────────
# 4. Semester selector files — responsive button grid
# ─────────────────────────────────────────────────────────────────────────────
print("\n── 4. Semester selector responsive fixes ──")
branches = ["cse","ece","eee","civil","mech","mme","chemical"]

SEM_RESPONSIVE_CSS = '''
        /* ══ RESPONSIVE ══ */
        @media (max-width: 600px) {
            .container { padding: 10px; }
            .header-box { font-size: 16px; padding: 12px; }
            .buttons-container, .semester-buttons {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            .btn {
                width: 100% !important;
                margin: 0 !important;
                padding: 13px 8px !important;
                font-size: 13px !important;
                text-align: center;
                min-height: 50px;
            }
        }

        @media (max-width: 360px) {
            .buttons-container, .semester-buttons {
                grid-template-columns: 1fr;
            }
        }
        /* ══ END RESPONSIVE ══ */
'''

for br in branches:
    fname = f"{br}_semester.html"
    content = read(fname)
    if '</style>' in content and 'RESPONSIVE' not in content:
        content = content.replace('</style>', SEM_RESPONSIVE_CSS + '    </style>', 1)
        write(fname, content)
    else:
        print(f"  ~ {fname} (skipped, already has responsive or no style block)")

print("\n✅ Responsiveness overhaul complete!")
print("   • calculator.html: clamp() font sizes, stacked mobile layout, touch targets")
print("   • department.html: 3-col mobile grid, responsive search")
print("   • index.html: dynamic iframe height via postMessage")
print("   • All 7 semester files: 2-col mobile button grid")

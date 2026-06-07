#!/usr/bin/env python3
"""Replace the <style> block in calculator.html with a vibrant premium design."""
import re, os

BASE = "/home/a-raghavendra/Desktop/github_repos/RGUKT-SGPA-CGPA-Calculator"
path = os.path.join(BASE, "calculator.html")

with open(path, encoding="utf-8") as f:
    content = f.read()

NEW_STYLE = '''  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    :root {
      --accent:  #a78bfa;
      --accent2: #38bdf8;
      --accent3: #f472b6;
      --glass:   rgba(255,255,255,0.07);
      --gborder: rgba(255,255,255,0.14);
      --text:    #e2e8f0;
      --dim:     rgba(255,255,255,0.48);
    }

    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      font-family: 'Poppins', sans-serif;
      margin: 0; padding: 0; min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      background-size: 400% 400%;
      animation: bgAnim 14s ease infinite;
      color: var(--text);
    }
    @keyframes bgAnim {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }

    .container { max-width: 700px; margin: 0 auto; padding: 20px 16px 48px; }

    /* ─ Back link ─ */
    .back-link {
      display: inline-flex; align-items: center; gap: 7px;
      color: var(--accent2); text-decoration: none;
      font-size: 0.82rem; font-weight: 600;
      margin-bottom: 16px; padding: 6px 14px;
      border: 1px solid rgba(56,189,248,.35);
      border-radius: 20px; background: rgba(56,189,248,.08);
      transition: all .2s;
    }
    .back-link:hover { background: rgba(56,189,248,.18); transform: translateX(-3px); }

    /* ─ Page header ─ */
    .page-header {
      background: linear-gradient(135deg, rgba(167,139,250,.18), rgba(56,189,248,.12));
      border: 1px solid var(--gborder); border-radius: 18px;
      padding: 22px 24px 16px; text-align: center; margin-bottom: 22px;
      backdrop-filter: blur(12px); position: relative; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,.3);
    }
    .page-header::before {
      content:''; position:absolute; top:-50px; left:-50px;
      width:180px; height:180px;
      background: radial-gradient(circle, rgba(167,139,250,.3) 0%, transparent 70%);
      pointer-events: none;
    }
    .page-header::after {
      content:''; position:absolute; bottom:-50px; right:-50px;
      width:180px; height:180px;
      background: radial-gradient(circle, rgba(244,114,182,.25) 0%, transparent 70%);
      pointer-events: none;
    }
    .page-header h1 {
      font-size: 1.7em; font-weight: 800; margin: 0 0 6px;
      background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; letter-spacing: .5px;
      padding: 0; border-radius: 0; background-color: transparent;
    }
    .breadcrumb { font-size: .76rem; color: var(--dim); }
    .breadcrumb a { color: rgba(167,139,250,.85); text-decoration: none; transition: color .2s; }
    .breadcrumb a:hover { color: var(--accent); }

    /* ─ Tabs ─ */
    .top-buttons { display: flex; gap: 12px; justify-content: center; margin-bottom: 22px; }
    .top-buttons button {
      flex: 1; max-width: 175px; padding: 12px 0;
      font-size: .93rem; font-weight: 700; font-family: 'Poppins', sans-serif;
      border: 2px solid rgba(167,139,250,.4); border-radius: 12px;
      background: var(--glass); color: var(--accent);
      cursor: pointer; transition: all .25s; margin-top: 0;
    }
    .top-buttons button.active {
      background: linear-gradient(135deg, #7c3aed, #6366f1);
      border-color: transparent; color: #fff;
      box-shadow: 0 4px 20px rgba(124,58,237,.45); transform: translateY(-2px);
    }
    .top-buttons button:hover:not(.active) {
      background: rgba(167,139,250,.15); border-color: var(--accent); transform: translateY(-1px);
    }

    /* ─ Card / fieldset ─ */
    fieldset {
      border: 1px solid var(--gborder); border-radius: 18px;
      padding: 24px 20px 20px;
      background: var(--glass); backdrop-filter: blur(12px);
      margin-bottom: 18px; box-shadow: 0 8px 32px rgba(0,0,0,.25);
    }
    legend {
      font-size: .88rem; font-weight: 700; color: #fff;
      background: linear-gradient(135deg, #7c3aed, #2563eb);
      border: none; border-radius: 8px; padding: 5px 16px;
      box-shadow: 0 2px 10px rgba(124,58,237,.4); letter-spacing: .5px;
    }

    /* ─ Subject rows ─ */
    .form-item {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 8px; gap: 12px; padding: 8px 10px; border-radius: 10px;
      transition: background .2s;
    }
    .form-item:hover { background: rgba(255,255,255,.05); }

    label {
      font-weight: 600; color: var(--text); font-size: .88rem;
      flex: 1; text-align: left; margin-bottom: 0;
    }

    select {
      flex-basis: 110px; flex-shrink: 0; padding: 9px 10px;
      font-size: .88rem; border-radius: 10px;
      border: 2px solid rgba(167,139,250,.35);
      background: rgba(15,12,41,.75); color: #e2e8f0;
      cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 600;
      transition: all .2s; outline: none;
    }
    select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(167,139,250,.22);
    }
    select option { background: #1e1b4b; color: #e2e8f0; }
    select option.rem { color: #f87171; }

    /* ─ Calculate button ─ */
    .calc-btn {
      display: block; width: 100%; margin-top: 18px; padding: 14px;
      background: linear-gradient(135deg, #7c3aed, #2563eb, #0891b2);
      background-size: 200% 200%; animation: btnAnim 4s ease infinite;
      color: #fff; font-size: 1rem; font-weight: 700;
      font-family: 'Poppins', sans-serif; border: none; border-radius: 12px;
      cursor: pointer; transition: transform .2s, box-shadow .2s;
      box-shadow: 0 6px 24px rgba(124,58,237,.4); letter-spacing: .5px;
    }
    @keyframes btnAnim {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    .calc-btn:hover  { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(124,58,237,.5); }
    .calc-btn:active { transform: translateY(0); opacity: .9; }

    /* ─ Result box ─ */
    .result-box {
      display: none; margin-top: 18px; padding: 28px 20px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(124,58,237,.18), rgba(37,99,235,.14));
      border: 1px solid rgba(167,139,250,.35);
      backdrop-filter: blur(12px); text-align: center;
      box-shadow: 0 8px 32px rgba(124,58,237,.22);
    }
    .result-box.show { display: block; animation: fadeUp .4s ease; }
    @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }

    .sgpa-label { font-size: .74rem; color: var(--dim); text-transform: uppercase; letter-spacing: 1.8px; font-weight: 600; }
    .sgpa-score {
      font-size: 3.2rem; font-weight: 800; display: block; margin: 8px 0 4px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .division-msg {
      display: inline-block; margin-top: 12px; font-size: .88rem; font-weight: 600;
      padding: 7px 20px; border-radius: 30px;
    }
    .distinction  { color: #34d399; background: rgba(52,211,153,.12); border: 1px solid rgba(52,211,153,.3); }
    .first-class  { color: #60a5fa; background: rgba(96,165,250,.12); border: 1px solid rgba(96,165,250,.3); }
    .second-class { color: #fbbf24; background: rgba(251,191,36,.12); border: 1px solid rgba(251,191,36,.3); }
    .failed       { color: #f87171; background: rgba(248,113,113,.12); border: 1px solid rgba(248,113,113,.3); }

    /* ─ Download buttons ─ */
    .download-row { display: flex; gap: 10px; margin-top: 16px; justify-content: center; }
    .dl-btn {
      padding: 8px 22px; font-size: .8rem; font-weight: 600;
      font-family: 'Poppins', sans-serif;
      border: 1px solid rgba(167,139,250,.4); border-radius: 20px;
      background: rgba(167,139,250,.1); color: var(--accent);
      cursor: pointer; transition: all .2s; margin-top: 0;
    }
    .dl-btn:hover { background: var(--accent); color: #fff; box-shadow: 0 4px 12px rgba(167,139,250,.35); }

    /* ─ Chart ─ */
    .chart-wrap {
      margin-top: 18px; background: var(--glass);
      border: 1px solid var(--gborder); border-radius: 14px;
      padding: 14px; backdrop-filter: blur(8px);
    }

    /* ─ CGPA inputs ─ */
    .form-item1 {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; margin-bottom: 8px; padding: 8px 10px;
      border-radius: 10px; transition: background .2s;
    }
    .form-item1:hover { background: rgba(255,255,255,.05); }

    input[type="number"] {
      width: 120px; padding: 9px 12px;
      border: 2px solid rgba(167,139,250,.35); border-radius: 10px;
      font-size: .88rem; color: #e2e8f0;
      background: rgba(15,12,41,.75);
      font-family: 'Poppins', sans-serif; font-weight: 600; outline: none;
      transition: all .2s;
    }
    input[type="number"]:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(167,139,250,.22); }
    input[type="number"]::placeholder { color: rgba(255,255,255,.28); }

    /* ─ Scrollbar ─ */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: rgba(255,255,255,.04); }
    ::-webkit-scrollbar-thumb { background: rgba(167,139,250,.4); border-radius: 3px; }

    /* ─ Responsive ─ */
    @media (max-width: 600px) {
      .form-item, .form-item1 { flex-direction: column; align-items: flex-start; }
      label { flex: none; }
      select, input[type="number"] { width: 100%; flex-basis: 100%; }
    }
    @media (max-width: 480px) {
      .container { padding: 12px 10px 32px; }
      .page-header h1 { font-size: 1.35em; }
      .sgpa-score { font-size: 2.5rem; }
    }
  </style>'''

# Replace <style>…</style> block
content = re.sub(r'  <style>.*?</style>', NEW_STYLE, content, count=1, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ Style block replaced successfully")
print(f"   New size: {len(content)} bytes")

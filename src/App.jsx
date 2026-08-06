@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--p:#5b4dc7;--p-light:#ede9ff;--p-dark:#3d2e99;--s:#764ba2;--g:#40c463;--g-light:#dcffe4;--r:#e5534b;--r-light:#fbe5e5;--bg:#f7f7fb;--card:#fff;--border:#e4e4ec;--text:#1a1a2e;--muted:#6b6b80;--amber:#d97706;--amber-light:#fef3c7;--radius:12px;--shadow:0 1px 3px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06)}
body{font-family:'DM Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}
.app{max-width:1100px;margin:0 auto;padding:16px 20px}

/* === NAVBAR === */
.navbar{background:var(--card);padding:14px 24px;border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;box-shadow:var(--shadow);position:sticky;top:12px;z-index:100;border:1px solid var(--border)}
.logo{color:var(--p);font-size:18px;font-weight:700;letter-spacing:-.3px}
.nav-right{display:flex;gap:10px;align-items:center}
.btn-profile{width:36px;height:36px;border-radius:50%;background:var(--p);color:#fff;border:none;cursor:pointer;font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;transition:.2s}
.btn-profile:hover{background:var(--p-dark);transform:scale(1.05)}
.btn-logout{padding:8px 14px;background:none;color:var(--muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;transition:.2s}
.btn-logout:hover{border-color:var(--r);color:var(--r)}

/* === MAIN CARD === */
.main-card{background:var(--card);border-radius:var(--radius);padding:32px;box-shadow:var(--shadow);border:1px solid var(--border)}
.main-card h2{color:var(--text);font-size:22px;margin-bottom:6px;font-weight:700;letter-spacing:-.3px}
.hero{margin-bottom:28px}
.subtitle{color:var(--muted);font-size:13px;margin-bottom:20px;font-weight:400}

/* === SECTION GRID === */
.section-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.section-card{background:var(--bg);padding:16px 18px;border-radius:10px;cursor:pointer;border:1px solid var(--border);transition:.15s;position:relative;overflow:hidden}
.section-card:hover{border-color:var(--p);box-shadow:0 4px 16px rgba(91,77,199,.1);transform:translateY(-2px)}
.section-card--special{border-left:3px solid var(--amber)}
.section-card__tag{font-size:11px;font-weight:600;color:var(--p);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.section-card h3{font-size:14px;margin-bottom:3px;color:var(--text);font-weight:600;line-height:1.3}
.section-card p{font-size:11px;color:var(--muted)}

/* === TABS === */
.btn-back{background:none;border:none;color:var(--p);font-weight:600;cursor:pointer;margin-bottom:16px;font-size:13px}
.btn-back:hover{text-decoration:underline}
.tab-bar{display:flex;gap:0;border-bottom:1px solid var(--border);margin:20px 0;overflow-x:auto}
.tab{padding:10px 20px;background:none;border:none;cursor:pointer;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;font-size:13px;transition:.15s;white-space:nowrap}
.tab:hover{color:var(--p)}
.tab.active{color:var(--p);border-bottom-color:var(--p)}

/* === CHEATSHEET CONCEPTS === */
.cheatsheet{max-width:860px;line-height:1.7}
.cs-bar{background:var(--p);color:#fff;padding:10px 16px;border-radius:8px;font-weight:700;font-size:14px;margin:20px 0 10px}
.cs-bar.green{background:#2e7d5b}
.cs-bar.amber{background:var(--amber)}
.cs-flow{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:12px 0;padding:16px;background:var(--p-light);border-radius:10px}
.cs-node{background:var(--p);color:#fff;padding:8px 14px;border-radius:6px;font-size:12px;font-weight:600;text-align:center}
.cs-node.green{background:#2e7d5b}
.cs-node.amber{background:var(--amber)}
.cs-node.red{background:var(--r)}
.cs-arrow{color:var(--p);font-size:16px;font-weight:700}
.cs-table{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px;border-radius:8px;overflow:hidden}
.cs-table th{background:var(--p);color:#fff;padding:10px 14px;text-align:left;font-size:12px;font-weight:600}
.cs-table td{padding:9px 14px;border-bottom:1px solid var(--border)}
.cs-table tr:nth-child(even){background:var(--bg)}
.cs-trap{background:var(--r-light);border-left:3px solid var(--r);padding:16px 20px;border-radius:10px;margin:16px 0}
.cs-trap h4{color:var(--r);font-size:13px;margin-bottom:8px;font-weight:700}
.cs-trap p,.cs-tip p,.cs-key p{font-size:12.5px;color:#555;margin-bottom:5px;line-height:1.6}
.cs-tip{background:var(--g-light);border-left:3px solid var(--g);padding:16px 20px;border-radius:10px;margin:16px 0}
.cs-tip h4{color:#2e7d5b;font-size:13px;margin-bottom:8px;font-weight:700}
.cs-key{background:var(--p-light);border-left:3px solid var(--p);padding:16px 20px;border-radius:10px;margin:16px 0}
.cs-key h4{color:var(--p);font-size:13px;margin-bottom:8px;font-weight:700}
.cs-section{margin-bottom:20px}
.cs-section h3{color:var(--p);font-size:15px;margin-bottom:8px;font-weight:700}
.cs-section p{font-size:13px;color:#444;margin-bottom:6px}

/* === CONCEPT BOXES (fallback) === */
.concepts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
.concept-box{background:var(--bg);padding:18px;border-radius:10px;border-left:3px solid var(--p)}
.concept-box h4{color:var(--p);font-size:14px;margin-bottom:8px;font-weight:600}
.concept-box p{font-size:13px;line-height:1.6;color:#555}

/* === REFERENCE === */
.ref-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.ref-item{background:var(--bg);padding:12px 14px;border-radius:8px;border-left:3px solid var(--p);display:flex;flex-direction:column;gap:3px}
.ref-item strong{color:var(--p);font-size:13px;font-family:'JetBrains Mono',monospace}
.ref-item span{font-size:12px;color:var(--muted)}
.section-header{color:var(--p);font-size:16px;margin-bottom:12px;font-weight:700}

/* === QUIZ === */
.level-toggle{display:flex;gap:8px;margin-bottom:20px}
.lvl-btn{flex:1;padding:11px;border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:600;background:var(--card);transition:.15s;font-size:13px}
.lvl-btn.active{background:var(--p);color:#fff;border-color:var(--p)}
.quiz-q{background:var(--bg);padding:20px;border-radius:10px;margin-bottom:14px;border:1px solid var(--border)}
.q-num{color:var(--p);font-weight:700;font-size:13px;margin-bottom:3px}
.q-text{font-size:14px;font-weight:600;margin-bottom:12px;line-height:1.5}
.options{display:flex;flex-direction:column;gap:7px}
.option{padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:13px;transition:.15s}
.option:hover{border-color:var(--p);background:var(--p-light)}
.option.selected{background:var(--p);color:#fff;border-color:var(--p)}
.option.correct{background:var(--g-light);border-color:var(--g);color:#155724}
.option.wrong{background:var(--r-light);border-color:var(--r);color:#721c24}
.explanation{background:var(--p-light);padding:14px;border-radius:8px;margin-top:10px;font-size:13px;border-left:3px solid var(--p);line-height:1.5}
.btn-submit{width:100%;padding:13px;background:var(--p);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;margin-top:14px;transition:.15s}
.btn-submit:hover{background:var(--p-dark)}
.btn-submit:disabled{opacity:.4;cursor:not-allowed}
.score-banner{text-align:center;padding:20px;background:var(--p);color:#fff;border-radius:10px;font-size:20px;font-weight:700;margin-top:14px}

/* === RESULTS === */
.results-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.result-card{background:var(--bg);padding:18px;border-radius:10px;border:1px solid var(--border);text-align:center}
.result-score{font-size:30px;font-weight:700;color:var(--p)}
.result-meta{font-size:11px;color:var(--muted);margin-top:6px}
.empty{text-align:center;padding:40px;color:var(--muted);font-size:14px}

/* === FEEDBACK === */
.feedback-form{background:var(--bg);padding:24px;border-radius:10px;max-width:560px;display:flex;flex-direction:column;gap:14px;border:1px solid var(--border)}
.feedback-form h3{color:var(--text);margin-bottom:4px;font-size:16px}
.feedback-form label{display:flex;flex-direction:column;gap:5px;font-weight:600;font-size:13px;color:var(--muted)}
.feedback-form select,.feedback-form textarea{padding:10px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--card)}
.feedback-form textarea{min-height:90px;resize:vertical}
.feedback-form select:focus,.feedback-form textarea:focus{outline:none;border-color:var(--p);box-shadow:0 0 0 3px rgba(91,77,199,.08)}

/* === AUTH === */
.auth-screen{display:flex;justify-content:center;align-items:center;min-height:100vh;background:var(--p);padding:20px}
.auth-box{background:var(--card);padding:36px;border-radius:16px;max-width:420px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.2)}
.auth-box h1{color:var(--p);font-size:24px;margin-bottom:4px;font-weight:700}
.auth-toggle{display:flex;gap:0;margin:18px 0;border-bottom:1px solid var(--border)}
.auth-toggle button{flex:1;padding:10px;background:none;border:none;cursor:pointer;font-weight:600;color:var(--muted);border-bottom:2px solid transparent;font-size:13px;transition:.15s}
.auth-toggle button.active{color:var(--p);border-bottom-color:var(--p)}
.auth-box form{display:flex;flex-direction:column;gap:10px}
.auth-box input,.auth-box select{padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;width:100%;background:var(--bg);font-family:inherit}
.auth-box input:focus,.auth-box select:focus{outline:none;border-color:var(--p);background:var(--card)}
.auth-box select,.auth-box input[type="date"]{color:var(--muted)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.btn-auth{padding:12px;background:var(--p);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;margin-top:4px;transition:.15s}
.btn-auth:hover{background:var(--p-dark)}
.btn-auth:disabled{opacity:.4}
.auth-divider{display:flex;align-items:center;gap:10px;margin:16px 0;color:var(--muted);font-size:12px}
.auth-divider:before,.auth-divider:after{content:'';flex:1;height:1px;background:var(--border)}
.btn-google{width:100%;padding:11px;background:#fff;color:var(--text);border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:.15s}
.btn-google:hover{background:var(--bg);border-color:#ccc}
.btn-google:disabled{opacity:.5;cursor:not-allowed}

/* === PROFILE === */
.profile-card{max-width:700px}
.profile-header{display:flex;align-items:center;gap:18px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border)}
.profile-avatar{width:56px;height:56px;border-radius:50%;background:var(--p);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700}
.profile-section{margin-bottom:24px}
.profile-section h3{font-size:15px;color:var(--text);margin-bottom:14px;font-weight:700}
.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.profile-field{display:flex;flex-direction:column;gap:3px}
.profile-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;font-weight:600}
.profile-value{font-size:14px;color:var(--text);font-weight:500}
.profile-edit{display:flex;flex-direction:column;gap:12px;max-width:400px}
.profile-edit label{display:flex;flex-direction:column;gap:5px;font-weight:600;font-size:13px;color:var(--muted)}
.profile-edit input{padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:var(--bg);font-family:inherit}
.profile-edit input:focus{outline:none;border-color:var(--p);background:var(--card)}
.btn-edit{padding:10px 18px;background:var(--bg);color:var(--p);border:1px solid var(--p);border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;margin-top:8px;transition:.15s;width:fit-content}
.btn-edit:hover{background:var(--p-light)}
.btn-row{display:flex;gap:8px;margin-top:4px}
.btn-cancel{padding:10px 18px;background:var(--bg);color:var(--muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:600;font-size:13px;transition:.15s}
.btn-cancel:hover{border-color:var(--r);color:var(--r)}

/* === TOAST === */
.toast{position:fixed;bottom:20px;right:20px;background:var(--text);color:#fff;padding:12px 20px;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.15);font-weight:500;font-size:13px;z-index:9000;animation:slideUp .3s}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
/* === QUESTION BANK === */
.qb-card{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px 20px;margin-bottom:10px;cursor:pointer;transition:.15s}
.qb-card:hover{border-color:var(--p);box-shadow:0 2px 8px rgba(91,77,199,.08)}
.qb-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.qb-badge{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:4px;color:#fff}
.qb-badge--conceptual{background:var(--p)}
.qb-badge--scenario{background:var(--amber)}
.qb-badge--troubleshooting{background:var(--r)}
.qb-num{font-size:11px;color:var(--muted);font-weight:600}
.qb-expand{margin-left:auto;color:var(--muted);font-size:12px}
.qb-question{font-size:14px;font-weight:600;line-height:1.5;color:var(--text)}
.qb-answer{margin-top:12px;padding-top:12px;border-top:1px solid var(--border);font-size:13px;line-height:1.7;color:#444}

/* === ADMIN === */
.btn-admin-link{background:none;border:1px solid var(--border);color:var(--muted);padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;transition:.15s}
.btn-admin-link:hover{border-color:var(--p);color:var(--p)}
.admin-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px}
.admin-stat-card{background:var(--bg);padding:20px;border-radius:10px;text-align:center;border:1px solid var(--border)}
.admin-stat-num{font-size:28px;font-weight:700;color:var(--p)}
.admin-stat-label{font-size:12px;color:var(--muted);margin-top:4px;font-weight:600}

/* === TOGGLE SWITCH === */
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border)}
.toggle-row:last-child{border-bottom:none}
.toggle-row-text{display:flex;flex-direction:column;gap:2px}
.toggle-row-title{font-size:13px;font-weight:600;color:var(--text)}
.toggle-row-desc{font-size:11px;color:var(--muted)}
.switch{position:relative;width:44px;height:24px;flex-shrink:0;cursor:pointer}
.switch input{opacity:0;width:0;height:0}
.switch-track{position:absolute;inset:0;background:var(--border);border-radius:24px;transition:.2s}
.switch-track:before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.switch input:checked + .switch-track{background:var(--p)}
.switch input:checked + .switch-track:before{transform:translateX(20px)}
.qn-subfields{display:flex;gap:12px;margin-top:10px;padding-top:10px;flex-wrap:wrap}
.qn-subfield{display:flex;flex-direction:column;gap:4px;flex:1;min-width:140px}
.qn-subfield label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.3px}
.qn-subfield select{padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;background:var(--card);font-family:inherit}
.qn-subfield select:disabled{background:var(--bg);color:var(--muted)}

/* === TODAY'S QUESTION CARD === */
.today-q-card{background:linear-gradient(135deg,var(--p-light),#fff);border:1px solid var(--p);border-radius:12px;padding:18px 22px;margin-bottom:24px;cursor:pointer;transition:.15s}
.today-q-card:hover{box-shadow:0 4px 16px rgba(91,77,199,.12)}
.today-q-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.today-q-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--p)}
.today-q-diff{font-size:10px;font-weight:700;text-transform:uppercase;padding:2px 8px;border-radius:4px;color:#fff;background:var(--amber)}
.today-q-diff--easy{background:var(--g)}
.today-q-diff--medium{background:var(--amber)}
.today-q-diff--hard{background:var(--r)}
.today-q-module{font-size:10px;color:var(--muted);font-weight:600}
.today-q-text{font-size:14px;font-weight:600;color:var(--text);line-height:1.5}
.today-q-answer{margin-top:12px;padding-top:12px;border-top:1px solid rgba(91,77,199,.2);font-size:13px;line-height:1.7;color:#444}
.today-q-hint{font-size:11px;color:var(--muted);margin-top:8px;font-style:italic}

@media(max-width:768px){.navbar{flex-direction:column;gap:10px}.section-grid{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}.level-toggle{flex-direction:column}.profile-grid{grid-template-columns:1fr}.cs-flow{flex-direction:column}.admin-stats{grid-template-columns:1fr 1fr}.qn-subfields{flex-direction:column}}

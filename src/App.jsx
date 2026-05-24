import { useState } from "react";

const API = 'https://tulime-backend-6ndn.onrender.com';

const COLORS = {
  green: "#1D9E75", greenDark: "#0F6E56", greenLight: "#E1F5EE",
  amber: "#F5A623", amberLight: "#FAEEDA", bg: "#F7F5F0",
  text: "#2C2C2A", muted: "#73726C", border: "#E2DDD6",
  red: "#E24B4A", redLight: "#FCEBEB",
};

const DISTRICTS = [
  "Choma","Kalomo","Mazabuka","Monze","Namwala",
  "Chipata","Lundazi","Petauke","Katete","Chadiza",
  "Lusaka","Kafue","Chongwe","Luangwa",
  "Kabwe","Kapiri Mposhi","Mkushi","Serenje",
  "Solwezi","Mwinilunga","Kasempa","Livingstone","Kazungula","Senanga",
];

const CROPS = ["Maize", "Soybean", "Groundnut"];
const SEEDS = {
  Maize: ["ZMS 402 (Early maturing)", "ZMS 616 (Medium maturing)", "PAN 53 (Medium maturing)"],
  Soybean: ["Lukanga Soya", "Magoye Soya"],
  Groundnut: ["MGV 4", "Baka"],
};

const ADVISORIES = [
  { risk: "moderate", icon: "⚠️", title: "Delayed planting recommended", message: "ZMD indicates a 68% probability of below-normal rainfall in your district over the next 10 days. Consider delaying planting by 7–10 days to preserve seed viability.", action: "Check again in 5 days" },
  { risk: "low", icon: "✅", title: "Conditions favourable for planting", message: "Rainfall onset is on track for your area. ZMD forecasts 75mm over the next 14 days — well within optimal range for ZMS 402. Optimal planting window: now through the next 12 days.", action: "Begin field preparation" },
  { risk: "high", icon: "🚨", title: "Drought warning — hold planting", message: "ZMD has issued a dry spell advisory for Southern Province. Probability of adequate rainfall in the next 21 days is below 30%. Do not plant until conditions improve.", action: "Report local conditions" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body,#root{font-family:'DM Sans',sans-serif;background:#F7F5F0;color:#2C2C2A;min-height:100vh;}
  .app{max-width:420px;margin:0 auto;min-height:100vh;background:#F7F5F0;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .fu{animation:fadeUp .5s ease forwards}
  .fu2{animation:fadeUp .5s .1s ease both}
  .fu3{animation:fadeUp .5s .2s ease both}
  .fu4{animation:fadeUp .5s .3s ease both}
  .fu5{animation:fadeUp .5s .4s ease both}
  .si{animation:slideIn .4s ease forwards}
  .screen{min-height:100vh;display:flex;flex-direction:column;}

  .splash{background:#0F6E56;justify-content:center;align-items:center;gap:24px;text-align:center;padding:40px 32px;}
  .splash-logo{width:80px;height:80px;background:rgba(255,255,255,.12);border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:36px;animation:pulse 3s ease-in-out infinite;}
  .splash-title{font-family:'DM Serif Display',serif;font-size:52px;color:white;letter-spacing:-1px;line-height:1;}
  .splash-tag{font-size:15px;color:rgba(255,255,255,.7);line-height:1.6;max-width:280px;}
  .splash-btn{background:#F5A623;color:#2C2C2A;border:none;border-radius:16px;padding:16px 40px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;cursor:pointer;margin-top:8px;width:100%;max-width:280px;transition:transform .15s;}
  .splash-btn:hover{transform:translateY(-2px);}
  .splash-link{font-size:14px;color:rgba(255,255,255,.6);cursor:pointer;text-decoration:underline;background:none;border:none;font-family:'DM Sans',sans-serif;}
  .splash-link:hover{color:white;}

  .reg-head{background:#0F6E56;padding:56px 24px 32px;position:relative;}
  .back-btn{position:absolute;top:20px;left:20px;background:rgba(255,255,255,.15);border:none;border-radius:10px;color:white;cursor:pointer;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;}
  .reg-head h2{font-family:'DM Serif Display',serif;font-size:28px;color:white;}
  .reg-head p{font-size:14px;color:rgba(255,255,255,.7);margin-top:6px;}
  .progress{display:flex;gap:6px;margin-top:20px;}
  .dot{height:4px;border-radius:2px;flex:1;background:rgba(255,255,255,.25);transition:background .3s;}
  .dot.on{background:#F5A623;}
  .reg-body{padding:28px 20px;flex:1;}
  .lbl{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#73726C;margin-bottom:8px;display:block;}
  .inp{width:100%;padding:14px 16px;border:1.5px solid #E2DDD6;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:15px;color:#2C2C2A;background:white;outline:none;transition:border-color .2s;-webkit-appearance:none;margin-bottom:20px;}
  .inp:focus{border-color:#1D9E75;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;}
  .opt{padding:12px 14px;border:1.5px solid #E2DDD6;border-radius:12px;background:white;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;color:#2C2C2A;text-align:left;transition:all .2s;}
  .opt.sel{border-color:#1D9E75;background:#E1F5EE;color:#0F6E56;font-weight:500;}
  .opt-full{grid-column:1/-1;font-size:13px;}
  .btn{width:100%;background:#1D9E75;color:white;border:none;border-radius:14px;padding:16px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:600;cursor:pointer;margin-top:8px;transition:background .2s;}
  .btn:hover{background:#0F6E56;}
  .btn:disabled{background:#ccc;cursor:not-allowed;}

  .dash-head{background:#0F6E56;padding:48px 20px 24px;}
  .dash-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
  .greet{font-size:13px;color:rgba(255,255,255,.65);}
  .dname{font-family:'DM Serif Display',serif;font-size:24px;color:white;margin-top:2px;}
  .avatar{width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:20px;}
  .wcard{background:rgba(255,255,255,.1);border-radius:16px;padding:16px;display:flex;justify-content:space-between;align-items:center;border:1px solid rgba(255,255,255,.15);}
  .wtemp{font-family:'DM Serif Display',serif;font-size:42px;color:white;line-height:1;}
  .wdesc{font-size:13px;color:rgba(255,255,255,.7);margin-top:4px;}
  .wloc{font-size:12px;color:rgba(255,255,255,.5);margin-top:2px;}
  .wstats{display:flex;gap:16px;margin-top:14px;}
  .wstat{font-size:12px;color:rgba(255,255,255,.65);}
  .wicon{font-size:52px;}

  .dbody{padding:20px;}
  .sec{font-size:12px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:#73726C;margin-bottom:12px;}
  .adv{border-radius:16px;padding:18px;margin-bottom:20px;border:1.5px solid transparent;}
  .adv.low{background:#E1F5EE;border-color:#9FE1CB;}
  .adv.moderate{background:#FAEEDA;border-color:#FAC775;}
  .adv.high{background:#FCEBEB;border-color:#F7C1C1;}
  .adv-top{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;}
  .adv-icon{font-size:22px;line-height:1;margin-top:1px;}
  .adv-title{font-size:15px;font-weight:600;color:#2C2C2A;line-height:1.3;}
  .adv-risk{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-top:2px;}
  .adv-risk.low{color:#0F6E56;}.adv-risk.moderate{color:#854F0B;}.adv-risk.high{color:#A32D2D;}
  .adv-msg{font-size:13px;color:#73726C;line-height:1.6;margin-bottom:14px;}
  .adv-act{font-size:13px;font-weight:600;color:#0F6E56;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0;}

  .sgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
  .scard{background:white;border-radius:14px;padding:14px;border:1.5px solid #E2DDD6;}
  .slbl{font-size:11px;color:#73726C;font-weight:500;}
  .sval{font-family:'DM Serif Display',serif;font-size:22px;color:#2C2C2A;margin-top:4px;line-height:1;}
  .ssub{font-size:11px;color:#73726C;margin-top:2px;}

  .calcard{background:white;border-radius:16px;padding:16px;margin-bottom:20px;border:1.5px solid #E2DDD6;}
  .calrow{display:flex;gap:6px;margin-top:12px;}
  .calm{flex:1;text-align:center;}
  .calm-lbl{font-size:10px;color:#73726C;margin-bottom:4px;font-weight:500;}
  .calbar{height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:white;}
  .calbar.plant{background:#1D9E75;}.calbar.grow{background:#9FE1CB;color:#0F6E56;}.calbar.harvest{background:#F5A623;color:#4A2A00;}.calbar.empty{background:#E2DDD6;}
  .calleg{display:flex;gap:14px;margin-top:10px;}
  .calleg-i{display:flex;align-items:center;gap:5px;font-size:11px;color:#73726C;}
  .caldot{width:8px;height:8px;border-radius:2px;}

  .rpbtn{width:100%;background:white;border:1.5px solid #E2DDD6;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:12px;transition:border-color .2s;text-align:left;}
  .rpbtn:hover{border-color:#1D9E75;}
  .rpbtn-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .rpbtn-txt{font-size:14px;font-weight:500;color:#2C2C2A;}
  .rpbtn-sub{font-size:12px;color:#73726C;}
  .rpbtn-arr{margin-left:auto;font-size:16px;color:#73726C;}

  .bnav{position:sticky;bottom:0;background:white;border-top:1px solid #E2DDD6;display:flex;padding:10px 0 20px;}
  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 0;background:none;border:none;font-family:'DM Sans',sans-serif;}
  .ni-icon{font-size:20px;}
  .ni-lbl{font-size:10px;font-weight:500;color:#73726C;}
  .ni.act .ni-lbl{color:#1D9E75;}

  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;z-index:100;animation:fadeIn .2s ease;}
  .sheet{background:white;border-radius:24px 24px 0 0;padding:24px 20px 40px;width:100%;max-width:420px;margin:0 auto;animation:fadeUp .3s ease;}
  .handle{width:40px;height:4px;background:#E2DDD6;border-radius:2px;margin:0 auto 20px;}
  .sh-title{font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:6px;}
  .sh-sub{font-size:14px;color:#73726C;margin-bottom:20px;}
  .rtgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
  .rtbtn{padding:14px;border:1.5px solid #E2DDD6;border-radius:12px;background:white;cursor:pointer;font-family:'DM Sans',sans-serif;text-align:center;transition:all .2s;}
  .rtbtn.sel{border-color:#1D9E75;background:#E1F5EE;}
  .rtbtn-icon{font-size:24px;margin-bottom:6px;}
  .rtbtn-lbl{font-size:13px;font-weight:500;color:#2C2C2A;}
  .ta{width:100%;padding:12px 14px;border:1.5px solid #E2DDD6;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;color:#2C2C2A;resize:none;outline:none;transition:border-color .2s;min-height:80px;margin-bottom:16px;}
  .ta:focus{border-color:#1D9E75;}
  .toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#0F6E56;color:white;border-radius:12px;padding:12px 20px;font-size:14px;font-weight:500;z-index:200;animation:fadeUp .3s ease;white-space:nowrap;}
`;

export default function TulimeApp() {
  const [screen, setScreen] = useState("splash");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", district: "", crop: "", seed: "" });
  const [advisory] = useState(ADVISORIES[1]);
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportNote, setReportNote] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const registerFarmer = async () => {
    try {
      const res = await fetch(`${API}/farmers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      console.log('Registered:', data);
      showToast("✓ Profile saved successfully!");
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const submitReport = async () => {
    try {
      await fetch(`${API}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reportType, note: reportNote })
      });
    } catch (err) { console.log(err); }
    setShowReport(false); setReportType(""); setReportNote("");
    showToast("✓ Report submitted to extension officer");
  };

  const canNext = () => {
    if (step === 1) return form.name.trim() && form.phone.trim();
    if (step === 2) return form.district;
    if (step === 3) return form.crop && form.seed;
    return true;
  };

  const calData = [
    { month: "Oct", type: "empty" }, { month: "Nov", type: "plant" },
    { month: "Dec", type: "grow" }, { month: "Jan", type: "grow" },
    { month: "Feb", type: "grow" }, { month: "Mar", type: "harvest" },
    { month: "Apr", type: "harvest" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {toast && <div className="toast">{toast}</div>}

        {/* SPLASH */}
        {screen === "splash" && (
          <div className="screen splash">
            <div className="splash-logo fu">🌱</div>
            <div className="splash-title fu2">Tulime</div>
            <p className="splash-tag fu3">Climate-smart farming decisions for Zambian smallholder farmers</p>
            <button className="splash-btn fu4" onClick={() => setScreen("register")}>Get started — it's free</button>
            <button className="splash-link fu5" onClick={() => setScreen("dashboard")}>Already registered? Sign in</button>
          </div>
        )}

        {/* REGISTER */}
        {screen === "register" && (
          <div className="screen si">
            <div className="reg-head">
              <button className="back-btn" onClick={() => step > 1 ? setStep(s => s - 1) : setScreen("splash")}>←</button>
              <h2>{step === 1 ? "Create your profile" : step === 2 ? "Your location" : "Your crop"}</h2>
              <p>{step === 1 ? "Tell us about yourself" : step === 2 ? "We use this for local weather data" : "We'll tailor advice to your seed"}</p>
              <div className="progress">{[1,2,3].map(i => <div key={i} className={`dot ${i <= step ? "on" : ""}`}/>)}</div>
            </div>
            <div className="reg-body">
              {step === 1 && (
                <div className="fu">
                  <label className="lbl">Full name</label>
                  <input className="inp" placeholder="e.g. Mary Phiri" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}/>
                  <label className="lbl">Phone number</label>
                  <input className="inp" placeholder="e.g. 0977 000 000" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} type="tel"/>
                </div>
              )}
              {step === 2 && (
                <div className="fu">
                  <label className="lbl">Select your district</label>
                  <select className="inp" value={form.district} onChange={e => setForm(f => ({...f, district: e.target.value}))}>
                    <option value="">Choose district...</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              {step === 3 && (
                <div className="fu">
                  <label className="lbl">Crop type</label>
                  <div className="grid2">
                    {CROPS.map(c => (
                      <button key={c} className={`opt ${form.crop === c ? "sel" : ""}`} onClick={() => setForm(f => ({...f, crop: c, seed: ""}))}>
                        {c === "Maize" ? "🌽" : c === "Soybean" ? "🫘" : "🥜"} {c}
                      </button>
                    ))}
                  </div>
                  {form.crop && (
                    <div>
                      <label className="lbl">Seed variety</label>
                      <div className="grid2">
                        {SEEDS[form.crop].map(s => (
                          <button key={s} className={`opt opt-full ${form.seed === s ? "sel" : ""}`} onClick={() => setForm(f => ({...f, seed: s}))}>{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button className="btn" disabled={!canNext()} onClick={() => step < 3 ? setStep(s => s + 1) : (registerFarmer(), setScreen("dashboard"))}>
                {step < 3 ? "Continue →" : "View my dashboard →"}
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {screen === "dashboard" && (
          <div className="screen si">
            <div className="dash-head">
              <div className="dash-top">
                <div>
                  <div className="greet">Good morning,</div>
                  <div className="dname">{form.name || "Farmer"} 👋</div>
                </div>
                <div className="avatar">👤</div>
              </div>
              <div className="wcard fu">
                <div>
                  <div className="wtemp">28°</div>
                  <div className="wdesc">Partly cloudy</div>
                  <div className="wloc">📍 {form.district || "Southern Province"}</div>
                  <div className="wstats">
                    <span className="wstat">💧 62% humidity</span>
                    <span className="wstat" style={{marginLeft:12}}>🌬 14 km/h</span>
                  </div>
                </div>
                <div className="wicon">⛅</div>
              </div>
            </div>

            <div className="dbody">
              <p className="sec fu">Today's advisory</p>
              <div className={`adv ${advisory.risk} fu2`}>
                <div className="adv-top">
                  <span className="adv-icon">{advisory.icon}</span>
                  <div>
                    <div className="adv-title">{advisory.title}</div>
                    <div className={`adv-risk ${advisory.risk}`}>{advisory.risk} risk</div>
                  </div>
                </div>
                <p className="adv-msg">{advisory.message}</p>
                <button className="adv-act">{advisory.action} →</button>
              </div>

              <p className="sec fu2">Season overview</p>
              <div className="sgrid fu3">
                <div className="scard"><div className="slbl">Crop</div><div className="sval">{form.crop || "Maize"}</div><div className="ssub">{form.seed ? form.seed.split(" ")[0] : "ZMS 402"}</div></div>
                <div className="scard"><div className="slbl">Rainfall (14 days)</div><div className="sval">75mm</div><div className="ssub">Forecast ZMD</div></div>
                <div className="scard"><div className="slbl">Days to planting</div><div className="sval">12</div><div className="ssub">Optimal window</div></div>
                <div className="scard"><div className="slbl">Season risk</div><div className="sval" style={{color:"#1D9E75"}}>Low</div><div className="ssub">Based on ZMD</div></div>
              </div>

              <p className="sec fu3">Crop calendar</p>
              <div className="calcard fu4">
                <div style={{fontSize:13,fontWeight:500}}>{form.crop || "Maize"} — 2025/2026 season</div>
                <div className="calrow">
                  {calData.map(({month, type}) => (
                    <div className="calm" key={month}>
                      <div className="calm-lbl">{month}</div>
                      <div className={`calbar ${type}`}>{type !== "empty" ? type[0].toUpperCase() : ""}</div>
                    </div>
                  ))}
                </div>
                <div className="calleg">
                  {[["#1D9E75","Plant"],["#9FE1CB","Grow"],["#F5A623","Harvest"]].map(([c,l]) => (
                    <div className="calleg-i" key={l}><div className="caldot" style={{background:c}}/><span>{l}</span></div>
                  ))}
                </div>
              </div>

              <p className="sec fu4">Report & feedback</p>
              {[
                {icon:"🐛", bg:"#FCEBEB", label:"Report pest sighting", sub:"Fall armyworm, aphids, etc."},
                {icon:"🌦", bg:"#E6F1FB", label:"Report unusual weather", sub:"Drought, flooding, hail"},
              ].map(({icon,bg,label,sub}) => (
                <button key={label} className="rpbtn fu5" onClick={() => setShowReport(true)}>
                  <div className="rpbtn-icon" style={{background:bg}}>{icon}</div>
                  <div><div className="rpbtn-txt">{label}</div><div className="rpbtn-sub">{sub}</div></div>
                  <span className="rpbtn-arr">›</span>
                </button>
              ))}
            </div>

            <div className="bnav">
              {[["🏠","Home"],["📅","Calendar"],["📡","Advisory"],["👤","Profile"]].map(([icon,label]) => (
                <button key={label} className={`ni ${label==="Home"?"act":""}`}>
                  <span className="ni-icon">{icon}</span>
                  <span className="ni-lbl">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
        {showReport && (
          <div className="overlay" onClick={e => e.target===e.currentTarget && setShowReport(false)}>
            <div className="sheet">
              <div className="handle"/>
              <div className="sh-title">Submit a report</div>
              <p className="sh-sub">Your report goes to the extension officer and helps other farmers.</p>
              <label className="lbl">Type of issue</label>
              <div className="rtgrid">
                {[{icon:"🐛",label:"Pest"},{icon:"🌧",label:"Flooding"},{icon:"☀️",label:"Drought"},{icon:"🍂",label:"Crop damage"}].map(({icon,label}) => (
                  <button key={label} className={`rtbtn ${reportType===label?"sel":""}`} onClick={() => setReportType(label)}>
                    <div className="rtbtn-icon">{icon}</div>
                    <div className="rtbtn-lbl">{label}</div>
                  </button>
                ))}
              </div>
              <label className="lbl">Additional details (optional)</label>
              <textarea className="ta" placeholder="Describe what you observed..." value={reportNote} onChange={e => setReportNote(e.target.value)}/>
              <button className="btn" disabled={!reportType} onClick={submitReport}>Submit report →</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

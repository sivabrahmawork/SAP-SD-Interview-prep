import React,{useState,useEffect,useCallback} from 'react';
import {SECTIONS,TCODES,SE16N,ADVANCED,FINAL_TEST,CHEATSHEETS} from './data/sections';
import QUESTION_BANK from './data/questionBankIndex';
import {FICO_SECTIONS,FICO_CHEATSHEETS} from './data/sectionsFico';
import QUESTION_BANK_FICO from './data/questionBankFico';
import {RAR_SECTIONS,RAR_CHEATSHEETS} from './data/sectionsRar';
import QUESTION_BANK_RAR from './data/questionBankRar';
import {signUp,signIn,signOut,saveResult,getResults,saveFeedback,updateProfile,changePassword,adminGetAllUsers,adminGetAllResults,adminGetAllFeedback,isLocalMode,checkIsAdmin,signInWithGoogle,getCurrentUser,subscribeAuthChanges} from './lib/storage';

const ADMIN_PIN='SD2025hub';

// ===========================================================================
// MODULE REGISTRY
// Each module supplies the same seven slots the single-module build used.
// SD is the only module with reference/special tabs today; FICO and RAR
// leave those slots empty rather than rendering blank tabs.
// ===========================================================================
const MODULES={
  sd:{
    key:'sd',label:'SAP SD',rotationDays:14,
    blurb:'Sales & Distribution — order to cash, pricing, deliveries, billing',
    sections:SECTIONS,
    questionBank:QUESTION_BANK,
    cheatsheets:CHEATSHEETS,
    tcodes:TCODES,
    se16n:SE16N,
    advanced:ADVANCED,
    finalTest:FINAL_TEST,
  },
  fico:{
    key:'fico',label:'SAP FICO',rotationDays:18,
    blurb:'Financial Accounting & Controlling — FI, CO and cross-module integration',
    sections:FICO_SECTIONS,
    questionBank:QUESTION_BANK_FICO,
    cheatsheets:FICO_CHEATSHEETS,
    tcodes:null,se16n:null,advanced:null,finalTest:null,
  },
  rar:{
    key:'rar',label:'SAP RAR',rotationDays:7,
    blurb:'Revenue Accounting & Reporting — IFRS 15, performance obligations, contracts',
    sections:RAR_SECTIONS,
    questionBank:QUESTION_BANK_RAR,
    cheatsheets:RAR_CHEATSHEETS,
    tcodes:null,se16n:null,advanced:null,finalTest:null,
  },
};
const MODULE_KEYS=Object.keys(MODULES);

// ===========================================================================
// SHAPE NORMALIZERS
// The three data sets were authored at different times and drifted apart.
// These adapt at render time so no data file has to be rewritten.
// ===========================================================================

// SD/FICO cheatsheets are HTML strings. RAR cheatsheets are {title, content}
// objects holding plain text. Return {html} or {plain,title} accordingly.
function normalizeCheatsheet(raw){
  if(!raw) return null;
  if(typeof raw==='string') return {html:raw};
  if(typeof raw==='object'&&typeof raw.content==='string'){
    return {plain:raw.content,title:raw.title||''};
  }
  return null;
}

// SD/FICO question banks store {q,a,type} for reading.
// RAR stores {q,opts,ans,type} (MCQ). Surface an answer string either way.
function normalizeQBItem(item){
  if(!item) return null;
  if(typeof item.a==='string'&&item.a.length>0){
    return {q:item.q,a:item.a,type:item.type||'conceptual'};
  }
  if(Array.isArray(item.opts)&&typeof item.ans==='number'){
    const correct=item.opts[item.ans];
    const exp=typeof item.exp==='string'&&item.exp.length>0?' — '+item.exp:'';
    return {q:item.q,a:(correct!==undefined?correct:'(answer unavailable)')+exp,type:item.type||'conceptual'};
  }
  return {q:item.q||'(question unavailable)',a:'(answer unavailable)',type:item.type||'conceptual'};
}

function hasItems(arr){return Array.isArray(arr)&&arr.length>0;}

// Deterministic daily pick: same user + same day + same module = same question.
function simpleHash(str){
  let h=0;
  for(let i=0;i<str.length;i++){h=((h<<5)-h+str.charCodeAt(i))|0;}
  return Math.abs(h);
}
function getTodaysQuestion(user,moduleKey){
  if(!user?.questionNotifEnabled) return null;
  const mod=MODULES[moduleKey]||MODULES.sd;
  const bank=mod.questionBank;
  if(!bank||typeof bank!=='object') return null;
  const diff=user.questionNotifDifficulty||'easy';
  const pool=[];
  Object.entries(bank).forEach(([sectionId,qb])=>{
    if(!qb) return;
    const levelArr = diff==='hard' ? qb.senior : diff==='medium' ? [...(qb.junior||[]),...(qb.senior||[])] : qb.junior;
    (levelArr||[]).forEach(raw=>{
      const item=normalizeQBItem(raw);
      if(!item) return;
      if(item.type==='scenario'||item.type==='troubleshooting'||diff==='easy'){
        pool.push({...item,sectionId});
      }
    });
  });
  if(pool.length===0) return null;
  const today=new Date().toISOString().slice(0,10);
  const idx=simpleHash((user.id||'')+today+moduleKey)%pool.length;
  return pool[idx];
}

// Special tabs exist only where the module supplies the backing data.
function buildSpecialTabs(mod){
  const tabs=[];
  if(hasItems(mod.tcodes)||hasItems(mod.se16n))
    tabs.push({id:'tcodes',title:'T-Codes & SE16N',subtitle:'Reference Tables',hasConcepts:true,hasQuiz:false,hasResults:false,hasFeedback:true,hasQB:false});
  if(hasItems(mod.advanced))
    tabs.push({id:'advanced',title:'Advanced Scenario',subtitle:'Edge-Case Questions',hasConcepts:false,hasQuiz:true,hasResults:true,hasFeedback:true,hasQB:false});
  if(hasItems(mod.finalTest))
    tabs.push({id:'finaltest',title:'Final Test',subtitle:'All Topics',hasConcepts:false,hasQuiz:true,hasResults:true,hasFeedback:true,hasQB:false});
  // Final Feedback is always available — it needs no module data.
  tabs.push({id:'finalfeedback',title:'Final Feedback',subtitle:'Overall Platform Feedback',hasConcepts:false,hasQuiz:false,hasResults:false,hasFeedback:true,hasQB:false});
  return tabs;
}

export default function App(){
  const[user,setUser]=useState(null);
  const[checkingSession,setCheckingSession]=useState(true);
  const[activeModule,setActiveModule]=useState(null); // null = welcome screen
  const[showModulePicker,setShowModulePicker]=useState(false);
  const[section,setSection]=useState(null);
  const[tab,setTab]=useState('concepts');
  const[level,setLevel]=useState('junior');
  const[answers,setAnswers]=useState({});
  const[submitted,setSubmitted]=useState(false);
  const[results,setResults]=useState([]);
  const[toast,setToast]=useState('');
  const[showProfile,setShowProfile]=useState(false);
  const[showAdmin,setShowAdmin]=useState(false);
  const[todayQExpanded,setTodayQExpanded]=useState(false);
  const[qbLevel,setQbLevel]=useState('junior');
  const[expandedQ,setExpandedQ]=useState({});

  useEffect(()=>{
    let active=true;
    getCurrentUser().then(u=>{
      if(active){setUser(u);setCheckingSession(false);}
    }).catch(()=>{if(active)setCheckingSession(false);});
    const unsubscribe=subscribeAuthChanges(u=>{
      if(active)setUser(u);
    });
    return ()=>{active=false;unsubscribe();};
  },[]);

  const showToast=useCallback((msg)=>{setToast(msg);setTimeout(()=>setToast(''),3000);},[]);
  const loadResults=useCallback(async(sid)=>{
    if(!user)return;
    try{const r=await getResults(user.id,sid);setResults(r);}catch(e){setResults([]);}
  },[user]);
  useEffect(()=>{if(section)loadResults(section);},[section,loadResults]);

  const resetToWelcome=()=>{
    setActiveModule(null);setSection(null);setShowProfile(false);
    setShowAdmin(false);setShowModulePicker(false);
    setSubmitted(false);setAnswers({});setExpandedQ({});
  };

  const chooseModule=async(key)=>{
    setActiveModule(key);
    setShowModulePicker(false);
    setSection(null);setSubmitted(false);setAnswers({});setExpandedQ({});
    setLevel('junior');setQbLevel('junior');
    if(user){
      try{
        await updateProfile(user.id,{activeModule:key});
        setUser(u=>({...u,activeModule:key}));
      }catch(e){/* selection still works for this session */}
    }
  };

  if(checkingSession) return <div className="app" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><p style={{color:'#6b6b80',fontSize:14}}>Loading...</p></div>;
  if(!user) return <AuthScreen onLogin={setUser} showToast={showToast} toast={toast}/>;
  if(showAdmin) return <AdminScreen user={user} onBack={()=>setShowAdmin(false)} toast={toast}/>;
  if(showProfile) return <ProfileScreen user={user} setUser={setUser} onBack={()=>setShowProfile(false)} showToast={showToast} toast={toast}/>;

  const navBar=(
    <nav className="navbar">
      <h1 className="logo" onClick={resetToWelcome} style={{cursor:'pointer'}}>SAP Interview Hub</h1>
      <div className="nav-right">
        <button className="btn-module" onClick={()=>setShowModulePicker(p=>!p)}>
          SAP Module{activeModule?': '+MODULES[activeModule].label:''}
        </button>
        <button className="btn-profile" onClick={()=>setShowProfile(true)} title="Profile">{user.fullName?.charAt(0)||'U'}</button>
        <button className="btn-logout" onClick={()=>{signOut();setUser(null);resetToWelcome();}}>Sign Out</button>
      </div>
    </nav>
  );

  const modulePicker=showModulePicker&&(
    <div className="main-card">
      <h2>Choose a Module</h2>
      <p className="subtitle">Each module has its own topics, question bank and rotation.</p>
      <div className="section-grid">
        {MODULE_KEYS.map(k=>{
          const m=MODULES[k];
          return(
            <div key={k} className={`section-card ${activeModule===k?'section-card--special':''}`} onClick={()=>chooseModule(k)}>
              <div className="section-card__tag">{m.rotationDays}-day rotation</div>
              <h3>{m.label}</h3>
              <p>{m.blurb}</p>
            </div>
          );
        })}
      </div>
      {activeModule&&<div style={{textAlign:'center',marginTop:20}}>
        <button className="btn-cancel" onClick={()=>setShowModulePicker(false)}>Cancel</button>
      </div>}
    </div>
  );

  // ---- WELCOME SCREEN: no module chosen yet ----
  if(!activeModule){
    return(
      <div className="app">
        {navBar}
        {showModulePicker?modulePicker:(
          <div className="main-card">
            <div className="hero">
              <h2>Welcome to SAP Interview Hub</h2>
              <p className="subtitle">
                {user.fullName?user.fullName.split(' ')[0]+', pick':'Pick'} a module from the SAP Module menu to start studying concepts, working through the question bank, and taking quizzes.
              </p>
            </div>
            <div style={{textAlign:'center',marginTop:28}}>
              <button className="btn-submit" onClick={()=>setShowModulePicker(true)}>Choose a Module</button>
            </div>
            <div style={{textAlign:'center',marginTop:28}}>
              <button className="btn-admin-link" onClick={()=>setShowAdmin(true)}>Admin Console</button>
            </div>
          </div>
        )}
        {toast&&<div className="toast">{toast}</div>}
      </div>
    );
  }

  const mod=MODULES[activeModule];
  const modSections=mod.sections||[];
  const modBank=mod.questionBank||{};
  const modCheats=mod.cheatsheets||{};
  const specialTabs=buildSpecialTabs(mod);

  const allTabs=[
    ...modSections.map(s=>({
      ...s,
      hasConcepts:true,
      hasQuiz:hasItems(s.junior)||hasItems(s.senior),
      hasResults:hasItems(s.junior)||hasItems(s.senior),
      hasFeedback:true,
      hasQB:!!modBank[s.id],
    })),
    ...specialTabs,
  ];
  const current=allTabs.find(t=>t.id===section);
  const sectionData=modSections.find(s=>s.id===section);

  const getQuizData=()=>{
    if(section==='advanced')return mod.advanced||[];
    if(section==='finaltest')return mod.finalTest||[];
    if(!sectionData)return[];
    const arr=level==='junior'?sectionData.junior:sectionData.senior;
    return Array.isArray(arr)?arr:[];
  };

  // Some RAR tabs have no senior set. Only offer levels that exist.
  const availableLevels=(()=>{
    if(!sectionData)return[];
    const out=[];
    if(hasItems(sectionData.junior))out.push('junior');
    if(hasItems(sectionData.senior))out.push('senior');
    return out;
  })();

  const openSection=(t)=>{
    setSection(t.id);
    const firstLevel=hasItems(t.junior)?'junior':hasItems(t.senior)?'senior':'junior';
    setLevel(firstLevel);
    setQbLevel(hasItems(modBank[t.id]?.junior)?'junior':'senior');
    setTab(t.hasConcepts?'concepts':t.hasQB?'questionbank':'quiz');
    setSubmitted(false);setAnswers({});setExpandedQ({});
  };

  const handleSubmitQuiz=async()=>{
    const qs=getQuizData();
    if(qs.length===0){showToast('No questions available for this level');return;}
    let score=0;
    qs.forEach((q,i)=>{if(answers[i]===q.ans)score++;});
    const pct=Math.round((score/qs.length)*100);
    setSubmitted(true);
    try{
      await saveResult({userId:user.id,sectionId:section,level,score,total:qs.length,percentage:pct,answers});
      showToast(`Score: ${score}/${qs.length} (${pct}%)`);
      loadResults(section);
    }catch(e){showToast('Error saving result');}
  };

  const handleFeedback=async(e)=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    try{
      await saveFeedback({userId:user.id,sectionId:section||'final',difficulty:fd.get('difficulty'),clarity:fd.get('clarity'),suggestion:fd.get('suggestion')});
      showToast('Feedback submitted!');
      e.target.reset();
    }catch(err){showToast('Error saving feedback');}
  };

  const toggleQ=(i)=>setExpandedQ(p=>({...p,[i]:!p[i]}));
  const qbData=modBank[section];
  const qbList=(qbData?.[qbLevel]||[]).map(normalizeQBItem).filter(Boolean);
  const qbLevelsAvailable=(()=>{
    if(!qbData)return[];
    const out=[];
    if(hasItems(qbData.junior))out.push('junior');
    if(hasItems(qbData.senior))out.push('senior');
    return out;
  })();
  const cheat=normalizeCheatsheet(modCheats[section]);

  if(showModulePicker) return(
    <div className="app">
      {navBar}
      {modulePicker}
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );

  return(
    <div className="app">
      {navBar}

      {!section?(
        <div className="main-card">
          <div className="hero">
            <h2>{mod.label}</h2>
            <p className="subtitle">{mod.blurb} · {mod.rotationDays}-day rotation · {allTabs.length} tabs</p>
          </div>
          {user.questionNotifEnabled&&(()=>{
            const tq=getTodaysQuestion(user,activeModule);
            if(!tq)return null;
            const diffLabel=user.questionNotifDifficulty||'easy';
            return(
              <div className="today-q-card" onClick={()=>setTodayQExpanded(p=>!p)}>
                <div className="today-q-header">
                  <span className="today-q-label">Today's Question</span>
                  <span className={`today-q-diff today-q-diff--${diffLabel}`}>{diffLabel}</span>
                  <span className="today-q-module">{mod.label} · {tq.sectionId}</span>
                </div>
                <div className="today-q-text">{tq.q}</div>
                {todayQExpanded&&<div className="today-q-answer">{tq.a}</div>}
                {!todayQExpanded&&<div className="today-q-hint">Click to reveal the answer</div>}
              </div>
            );
          })()}
          <div className="section-grid">
            {allTabs.map(t=>{
              const isRotation=modSections.some(s=>s.id===t.id);
              return(
                <div key={t.id} className={`section-card ${isRotation?'':'section-card--special'}`} onClick={()=>openSection(t)}>
                  <div className="section-card__tag">{isRotation?(t.title||t.id):'Special'}</div>
                  <h3>{isRotation?(t.subtitle||t.title):t.title}</h3>
                  <p>{isRotation?'':t.subtitle}</p>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:'center',marginTop:28}}>
            <button className="btn-admin-link" onClick={()=>setShowAdmin(true)}>Admin Console</button>
          </div>
        </div>
      ):(
        <div className="main-card">
          <button className="btn-back" onClick={()=>{setSection(null);setSubmitted(false);setAnswers({});setExpandedQ({});}}>← Back to Topics</button>
          <h2>{current?.title}{current?.subtitle ? ': '+current.subtitle : ''}</h2>

          <div className="tab-bar">
            {current?.hasConcepts&&<button className={`tab ${tab==='concepts'?'active':''}`} onClick={()=>setTab('concepts')}>Cheatsheet</button>}
            {current?.hasQB&&<button className={`tab ${tab==='questionbank'?'active':''}`} onClick={()=>{setTab('questionbank');setExpandedQ({});}}>Question Bank</button>}
            {current?.hasQuiz&&<button className={`tab ${tab==='quiz'?'active':''}`} onClick={()=>{setTab('quiz');setSubmitted(false);setAnswers({});}}>Quiz</button>}
            {current?.hasResults&&<button className={`tab ${tab==='results'?'active':''}`} onClick={()=>{setTab('results');loadResults(section);}}>Results</button>}
            {current?.hasFeedback&&<button className={`tab ${tab==='feedback'?'active':''}`} onClick={()=>setTab('feedback')}>Feedback</button>}
          </div>

          {/* CONCEPTS / CHEATSHEET */}
          {tab==='concepts'&&section==='tcodes'&&(
            <div>
              {hasItems(mod.tcodes)&&<>
                <h3 className="section-header">Key Transaction Codes</h3>
                <div className="ref-grid">{mod.tcodes.map((t,i)=><div key={i} className="ref-item"><strong>{t.code}</strong><span>{t.desc}</span></div>)}</div>
              </>}
              {hasItems(mod.se16n)&&<>
                <h3 className="section-header" style={{marginTop:20}}>SE16N Tables</h3>
                <div className="ref-grid">{mod.se16n.map((t,i)=><div key={i} className="ref-item"><strong>{t.table}</strong><span>{t.desc}</span></div>)}</div>
              </>}
            </div>
          )}
          {tab==='concepts'&&section!=='tcodes'&&sectionData&&(
            cheat?.html
              ? <div className="cheatsheet" dangerouslySetInnerHTML={{__html:cheat.html}}/>
              : cheat?.plain
                ? <div className="cheatsheet">
                    {cheat.title&&<div className="cs-bar">{cheat.title}</div>}
                    <pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit',margin:0,lineHeight:1.7}}>{cheat.plain.trim()}</pre>
                  </div>
                : hasItems(sectionData.concepts)
                  ? <div className="concepts-grid">{sectionData.concepts.map((c,i)=>(<div key={i} className="concept-box"><h4>{c.name}</h4><p>{c.text}</p></div>))}</div>
                  : <p className="empty">No cheatsheet content for this tab yet.</p>
          )}

          {/* QUESTION BANK */}
          {tab==='questionbank'&&qbData&&(
            <div>
              {qbLevelsAvailable.length>1&&(
                <div className="level-toggle" style={{marginBottom:16}}>
                  {qbLevelsAvailable.map(l=>(
                    <button key={l} className={`lvl-btn ${qbLevel===l?'active':''}`} onClick={()=>{setQbLevel(l);setExpandedQ({});}}>
                      {l==='junior'?'Junior Consultant':'Senior Consultant'}
                    </button>
                  ))}
                </div>
              )}
              <p className="subtitle" style={{marginBottom:16}}>Click any question to reveal the answer. {qbList.length} questions available.</p>
              {qbList.length===0&&<p className="empty">No questions at this level yet.</p>}
              {qbList.map((item,i)=>(
                <div key={i} className="qb-card" onClick={()=>toggleQ(i)}>
                  <div className="qb-header">
                    <span className={`qb-badge qb-badge--${item.type}`}>{item.type}</span>
                    <span className="qb-num">Q{i+1}</span>
                    <span className="qb-expand">{expandedQ[i]?'▲':'▼'}</span>
                  </div>
                  <div className="qb-question">{item.q}</div>
                  {expandedQ[i]&&<div className="qb-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          )}

          {/* QUIZ */}
          {tab==='quiz'&&current?.hasQuiz&&(
            <div>
              {section!=='advanced'&&section!=='finaltest'&&availableLevels.length>1&&(
                <div className="level-toggle">
                  {availableLevels.map(l=>(
                    <button key={l} className={`lvl-btn ${level===l?'active':''}`} onClick={()=>{setLevel(l);setSubmitted(false);setAnswers({});}}>
                      {l==='junior'?'Junior Consultant':'Senior Consultant'}
                    </button>
                  ))}
                </div>
              )}
              {getQuizData().length===0&&<p className="empty">No quiz questions for this level yet.</p>}
              {getQuizData().map((q,i)=>(
                <div key={i} className="quiz-q">
                  <div className="q-num">Q{i+1}.</div>
                  <div className="q-text">{q.q}</div>
                  <div className="options">
                    {(q.opts||[]).map((opt,oi)=>(
                      <div key={oi}
                        className={`option ${answers[i]===oi?'selected':''} ${submitted&&oi===q.ans?'correct':''} ${submitted&&answers[i]===oi&&oi!==q.ans?'wrong':''}`}
                        onClick={()=>{if(!submitted)setAnswers(p=>({...p,[i]:oi}));}}
                      >{opt}</div>
                    ))}
                  </div>
                  {submitted&&q.exp&&<div className="explanation"><strong>Explanation:</strong> {q.exp}</div>}
                </div>
              ))}
              {getQuizData().length>0&&(!submitted?(
                <button className="btn-submit" onClick={handleSubmitQuiz} disabled={Object.keys(answers).length<getQuizData().length}>
                  Submit All Answers ({Object.keys(answers).length}/{getQuizData().length})
                </button>
              ):(
                <div className="score-banner">
                  Score: {getQuizData().filter((q,i)=>answers[i]===q.ans).length}/{getQuizData().length}
                  ({Math.round((getQuizData().filter((q,i)=>answers[i]===q.ans).length/getQuizData().length)*100)}%)
                </div>
              ))}
            </div>
          )}

          {/* RESULTS */}
          {tab==='results'&&(
            <div>{results.length>0?(
              <div className="results-grid">{results.map((r,i)=>(
                <div key={i} className="result-card">
                  <div className="result-score">{r.percentage||Math.round((r.score/r.total)*100)}%</div>
                  <div className="result-meta">{r.score}/{r.total} · {r.level} · {new Date(r.createdAt||r.created_at).toLocaleDateString()}</div>
                </div>
              ))}</div>
            ):<p className="empty">No results yet. Take a quiz to see your scores here.</p>}</div>
          )}

          {/* FEEDBACK */}
          {tab==='feedback'&&(
            <form className="feedback-form" onSubmit={handleFeedback}>
              <h3>{section==='finalfeedback'?'Overall Platform Feedback':'Section Feedback'}</h3>
              <label>Difficulty<select name="difficulty" required><option value="">Select</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
              <label>Clarity<select name="clarity" required><option value="">Select</option><option>Very Clear</option><option>Clear</option><option>Confusing</option></select></label>
              <label>Suggestions<textarea name="suggestion" placeholder="What could be improved?"></textarea></label>
              <button type="submit" className="btn-submit">Submit Feedback</button>
            </form>
          )}
        </div>
      )}
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

// ===== ADMIN CONSOLE =====
function AdminScreen({user,onBack,toast}){
  const[authed,setAuthed]=useState(false);
  const[pin,setPin]=useState('');
  const[stats,setStats]=useState(null);
  const[loading,setLoading]=useState(false);
  const[loadErr,setLoadErr]=useState('');
  const[denied,setDenied]=useState(false);

  const loadStats=async()=>{
    setLoading(true);setLoadErr('');
    try{
      const [users,results,feedback]=await Promise.all([adminGetAllUsers(),adminGetAllResults(),adminGetAllFeedback()]);
      const avgScore=results.length>0?Math.round(results.reduce((s,r)=>(s+(r.percentage||Math.round((r.score/r.total)*100))),0)/results.length):0;
      const topSections={};
      results.forEach(r=>{topSections[r.sectionId]=(topSections[r.sectionId]||0)+1;});
      const sortedSections=Object.entries(topSections).sort((a,b)=>b[1]-a[1]).slice(0,5);
      setStats({users,results,feedback,avgScore,sortedSections});
    }catch(e){
      setLoadErr(e.message||'Could not load admin data.');
    }
    setLoading(false);
  };

  const handlePin=async()=>{
    if(pin!==ADMIN_PIN){alert('Incorrect PIN');return;}
    setLoading(true);
    const isAdmin=await checkIsAdmin(user.id);
    if(!isAdmin){setDenied(true);setLoading(false);return;}
    setAuthed(true);
    loadStats();
  };

  if(denied) return(
    <div className="app">
      <nav className="navbar"><h1 className="logo">Admin Console</h1><div className="nav-right"><button className="btn-back" onClick={onBack}>← Back</button></div></nav>
      <div className="main-card" style={{maxWidth:420,margin:'60px auto'}}>
        <div className="cs-trap"><h4>Access Denied</h4><p>This account isn't authorized for admin access. Contact the platform administrator if you believe this is a mistake.</p></div>
        <button className="btn-back" onClick={onBack} style={{marginTop:12}}>← Back to Hub</button>
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );

  if(!authed) return(
    <div className="app">
      <nav className="navbar"><h1 className="logo">Admin Console</h1><div className="nav-right"><button className="btn-back" onClick={onBack}>← Back</button></div></nav>
      <div className="main-card" style={{maxWidth:420,margin:'60px auto'}}>
        <h2 style={{marginBottom:16}}>Admin Access</h2>
        <p className="subtitle">Enter the admin PIN to access the dashboard.</p>
        {!isLocalMode&&<p className="subtitle" style={{marginTop:-8,fontSize:11}}>Logged in as: {user?.email}</p>}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Enter PIN" onKeyDown={e=>e.key==='Enter'&&handlePin()} style={{padding:'10px 12px',border:'1px solid #e4e4ec',borderRadius:8,fontSize:14}}/>
          <button className="btn-submit" onClick={handlePin} disabled={loading}>{loading?'Checking...':'Access Dashboard'}</button>
        </div>
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );

  return(
    <div className="app">
      <nav className="navbar"><h1 className="logo">Admin Dashboard</h1><div className="nav-right"><button className="btn-back" onClick={onBack}>← Back to Hub</button></div></nav>
      <div className="main-card">
        {loading&&<p className="empty">Loading admin data...</p>}
        {loadErr&&<div className="cs-trap" style={{marginBottom:20}}><h4>Notice</h4><p>{loadErr}</p></div>}
        {stats&&<>
        <div className="admin-stats">
          <div className="admin-stat-card"><div className="admin-stat-num">{stats.users.length}</div><div className="admin-stat-label">Total Users</div></div>
          <div className="admin-stat-card"><div className="admin-stat-num">{stats.results.length}</div><div className="admin-stat-label">Quiz Attempts</div></div>
          <div className="admin-stat-card"><div className="admin-stat-num">{stats.avgScore}%</div><div className="admin-stat-label">Avg Score</div></div>
          <div className="admin-stat-card"><div className="admin-stat-num">{stats.feedback.length}</div><div className="admin-stat-label">Feedback</div></div>
        </div>

        <h3 style={{marginTop:28,marginBottom:12}}>Most Attempted Sections</h3>
        {stats.sortedSections.length>0?(
          <table className="cs-table"><thead><tr><th>Section</th><th>Attempts</th></tr></thead><tbody>
            {stats.sortedSections.map(([sid,cnt],i)=><tr key={i}><td>{sid}</td><td>{cnt}</td></tr>)}
          </tbody></table>
        ):<p className="empty">No quiz data yet.</p>}

        <h3 style={{marginTop:28,marginBottom:12}}>Registered Users</h3>
        {stats.users.length>0?(
          <table className="cs-table"><thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Country</th></tr></thead><tbody>
            {stats.users.map((u,i)=><tr key={i}><td>{u.fullName}</td><td>{u.email}</td><td>{u.company||'—'}</td><td>{u.country||'—'}</td></tr>)}
          </tbody></table>
        ):<p className="empty">No users yet.</p>}

        <h3 style={{marginTop:28,marginBottom:12}}>Recent Feedback</h3>
        {stats.feedback.length>0?(
          <table className="cs-table"><thead><tr><th>Section</th><th>Difficulty</th><th>Clarity</th><th>Suggestion</th></tr></thead><tbody>
            {stats.feedback.slice(0,10).map((f,i)=><tr key={i}><td>{f.sectionId}</td><td>{f.difficulty}</td><td>{f.clarity}</td><td>{f.suggestion||'—'}</td></tr>)}
          </tbody></table>
        ):<p className="empty">No feedback yet.</p>}
        </>}
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

// ===== PROFILE SCREEN =====
function ProfileScreen({user,setUser,onBack,showToast,toast}){
  const[editing,setEditing]=useState(false);
  const[changingPw,setChangingPw]=useState(false);
  const[form,setForm]=useState({fullName:user.fullName||'',gender:user.gender||'',dob:user.dob||'',company:user.company||'',country:user.country||''});
  const[pw,setPw]=useState({current:'',newPw:'',confirm:''});
  const[notif,setNotif]=useState(!!user.notificationsEnabled);
  const[qNotif,setQNotif]=useState(!!user.questionNotifEnabled);
  const[qModule,setQModule]=useState(user.questionNotifModule||'sd');
  const[qDiff,setQDiff]=useState(user.questionNotifDifficulty||'easy');

  const handleSave=async()=>{
    try{
      await updateProfile(user.id,form);
      setUser({...user,...form});
      setEditing(false);
      showToast('Profile updated');
    }catch(e){showToast('Error updating profile');}
  };

  const handleToggleNotif=async(checked)=>{
    setNotif(checked);
    try{
      await updateProfile(user.id,{notificationsEnabled:checked});
      setUser({...user,notificationsEnabled:checked});
      showToast(checked?'Notifications turned on':'Notifications turned off');
    }catch(e){showToast('Could not update notifications');setNotif(!checked);}
  };

  const handleToggleQNotif=async(checked)=>{
    setQNotif(checked);
    try{
      await updateProfile(user.id,{questionNotifEnabled:checked,questionNotifModule:qModule,questionNotifDifficulty:qDiff});
      setUser({...user,questionNotifEnabled:checked,questionNotifModule:qModule,questionNotifDifficulty:qDiff});
      showToast(checked?'Daily question turned on':'Daily question turned off');
    }catch(e){showToast('Could not update question notifications');setQNotif(!checked);}
  };

  const handleQModuleChange=async(val)=>{
    setQModule(val);
    try{
      await updateProfile(user.id,{questionNotifModule:val});
      setUser({...user,questionNotifModule:val});
    }catch(e){showToast('Could not update module');}
  };

  const handleDiffChange=async(val)=>{
    setQDiff(val);
    try{
      await updateProfile(user.id,{questionNotifDifficulty:val});
      setUser({...user,questionNotifDifficulty:val});
    }catch(e){showToast('Could not update difficulty');}
  };

  const handlePwChange=async()=>{
    if(pw.newPw!==pw.confirm){showToast('Passwords do not match');return;}
    if(pw.newPw.length<6){showToast('Password must be at least 6 characters');return;}
    try{
      await changePassword(pw.newPw,pw.current);
      setPw({current:'',newPw:'',confirm:''});
      setChangingPw(false);
      showToast('Password changed successfully');
    }catch(e){showToast(e.message||'Error changing password');}
  };

  return(
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">SAP Interview Hub</h1>
        <div className="nav-right"><button className="btn-back" onClick={onBack}>← Back to Dashboard</button></div>
      </nav>
      <div className="main-card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{user.fullName?.charAt(0)||'U'}</div>
          <div><h2>{user.fullName}</h2><p className="subtitle" style={{marginBottom:0}}>{user.email}</p></div>
        </div>

        <div className="profile-section">
          <h3>Personal Details</h3>
          {!editing?(
            <div className="profile-grid">
              <div className="profile-field"><span className="profile-label">Full Name</span><span className="profile-value">{user.fullName||'—'}</span></div>
              <div className="profile-field"><span className="profile-label">Email</span><span className="profile-value">{user.email}</span></div>
              <div className="profile-field"><span className="profile-label">Gender</span><span className="profile-value">{user.gender||'—'}</span></div>
              <div className="profile-field"><span className="profile-label">Date of Birth</span><span className="profile-value">{user.dob||'—'}</span></div>
              <div className="profile-field"><span className="profile-label">Company</span><span className="profile-value">{user.company||'—'}</span></div>
              <div className="profile-field"><span className="profile-label">Country</span><span className="profile-value">{user.country||'—'}</span></div>
              <button className="btn-edit" onClick={()=>setEditing(true)}>Edit Profile</button>
            </div>
          ):(
            <div className="profile-edit">
              <label>Full Name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></label>
              <label>Gender<select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></label>
              <label>Date of Birth<input type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/></label>
              <label>Company<input value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></label>
              <label>Country<input value={form.country} onChange={e=>setForm({...form,country:e.target.value})}/></label>
              <div className="btn-row">
                <button className="btn-submit" onClick={handleSave}>Save Changes</button>
                <button className="btn-cancel" onClick={()=>setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Notifications</h3>
          <div className="toggle-row">
            <div className="toggle-row-text">
              <span className="toggle-row-title">Notifications</span>
              <span className="toggle-row-desc">General platform notifications</span>
            </div>
            <label className="switch">
              <input type="checkbox" checked={notif} onChange={e=>handleToggleNotif(e.target.checked)}/>
              <span className="switch-track"></span>
            </label>
          </div>
          <div className="toggle-row">
            <div style={{width:'100%'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div className="toggle-row-text">
                  <span className="toggle-row-title">Question Notifications</span>
                  <span className="toggle-row-desc">One edge-case question per day, delivered in-app when you open the site</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={qNotif} onChange={e=>handleToggleQNotif(e.target.checked)}/>
                  <span className="switch-track"></span>
                </label>
              </div>
              {qNotif&&(
                <div className="qn-subfields">
                  <div className="qn-subfield">
                    <label>Module</label>
                    <select value={qModule} onChange={e=>handleQModuleChange(e.target.value)}>
                      {MODULE_KEYS.map(k=><option key={k} value={k}>{MODULES[k].label}</option>)}
                    </select>
                  </div>
                  <div className="qn-subfield">
                    <label>Difficulty Level</label>
                    <select value={qDiff} onChange={e=>handleDiffChange(e.target.value)}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Change Password</h3>
          {!changingPw?(<button className="btn-edit" onClick={()=>setChangingPw(true)}>Change Password</button>):(
            <div className="profile-edit">
              <label>Current Password<input type="password" value={pw.current} onChange={e=>setPw({...pw,current:e.target.value})}/></label>
              <label>New Password<input type="password" value={pw.newPw} onChange={e=>setPw({...pw,newPw:e.target.value})} minLength="6"/></label>
              <label>Confirm New Password<input type="password" value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})}/></label>
              <div className="btn-row">
                <button className="btn-submit" onClick={handlePwChange}>Update Password</button>
                <button className="btn-cancel" onClick={()=>setChangingPw(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

// ===== AUTH SCREEN =====
function AuthScreen({onLogin,showToast,toast}){
  const[mode,setMode]=useState('login');
  const[loading,setLoading]=useState(false);
  const[googleLoading,setGoogleLoading]=useState(false);
  const handleSubmit=async(e)=>{
    e.preventDefault();setLoading(true);
    const fd=new FormData(e.target);
    try{
      if(mode==='signup'){
        const u=await signUp({email:fd.get('email'),password:fd.get('password'),fullName:fd.get('name'),gender:fd.get('gender'),dob:fd.get('dob'),company:fd.get('company'),country:fd.get('country')});
        onLogin(u);
      }else{
        const u=await signIn({email:fd.get('email'),password:fd.get('password')});
        onLogin(u);
      }
    }catch(err){showToast(err.message||'Error');}
    setLoading(false);
  };
  const handleGoogle=async()=>{
    setGoogleLoading(true);
    try{
      await signInWithGoogle();
    }catch(err){showToast(err.message||'Could not start Google sign-in');setGoogleLoading(false);}
  };
  return(
    <div className="auth-screen">
      <div className="auth-box">
        <h1>SAP Interview Hub</h1>
        <p className="subtitle">Master SAP SD, FICO and RAR for your next interview</p>
        <div className="auth-toggle">
          <button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Login</button>
          <button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Sign Up</button>
        </div>
        <form onSubmit={handleSubmit}>
          {mode==='signup'&&<><input name="name" placeholder="Full Name *" required/>
          <div className="form-row"><select name="gender" required><option value="">Gender *</option><option>Male</option><option>Female</option><option>Other</option></select>
          <input name="dob" type="date" required/></div>
          <input name="company" placeholder="Company"/>
          <input name="country" placeholder="Country *" required/></>}
          <input name="email" type="email" placeholder="Email *" required/>
          <input name="password" type="password" placeholder="Password *" required minLength="6"/>
          <button type="submit" className="btn-auth" disabled={loading}>{loading?'Processing...':mode==='login'?'Login':'Create Account'}</button>
        </form>
        {!isLocalMode&&<>
          <div className="auth-divider"><span>or</span></div>
          <button type="button" className="btn-google" onClick={handleGoogle} disabled={googleLoading}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
            {googleLoading?'Redirecting...':'Continue with Google'}
          </button>
        </>}
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

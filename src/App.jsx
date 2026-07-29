import React,{useState,useEffect,useCallback} from 'react';
import {SECTIONS,TCODES,SE16N,ADVANCED,FINAL_TEST} from './data/sections';
import {signUp,signIn,signOut,saveResult,getResults,saveFeedback} from './lib/storage';

// ---- TABS CONFIG ----
const SPECIAL_TABS = [
  {id:'tcodes',title:'T-Codes & SE16N',subtitle:'Reference Tables',hasConcepts:true,hasQuiz:false,hasResults:false,hasFeedback:true},
  {id:'advanced',title:'Advanced Scenario',subtitle:'20 Edge-Case Questions',hasConcepts:false,hasQuiz:true,hasResults:true,hasFeedback:true},
  {id:'finaltest',title:'Final Test',subtitle:'25 Questions All Topics',hasConcepts:false,hasQuiz:true,hasResults:true,hasFeedback:true},
  {id:'finalfeedback',title:'Final Feedback',subtitle:'Overall Platform Feedback',hasConcepts:false,hasQuiz:false,hasResults:false,hasFeedback:true},
];

export default function App(){
  const[user,setUser]=useState(null);
  const[section,setSection]=useState(null);
  const[tab,setTab]=useState('concepts');
  const[level,setLevel]=useState('junior');
  const[answers,setAnswers]=useState({});
  const[submitted,setSubmitted]=useState(false);
  const[results,setResults]=useState([]);
  const[toast,setToast]=useState('');

  const showToast=useCallback((msg)=>{setToast(msg);setTimeout(()=>setToast(''),3000);},[]);

  const loadResults=useCallback(async(sid)=>{
    if(!user)return;
    try{const r=await getResults(user.id,sid);setResults(r);}catch(e){setResults([]);}
  },[user]);

  useEffect(()=>{if(section)loadResults(section);},[section,loadResults]);

  // ---- AUTH ----
  if(!user) return <AuthScreen onLogin={setUser} showToast={showToast} toast={toast}/>;

  const allTabs=[...SECTIONS.map(s=>({...s,hasConcepts:true,hasQuiz:true,hasResults:true,hasFeedback:true})),...SPECIAL_TABS];
  const current=allTabs.find(t=>t.id===section);
  const sectionData=SECTIONS.find(s=>s.id===section);

  const getQuizData=()=>{
    if(section==='advanced')return ADVANCED;
    if(section==='finaltest')return FINAL_TEST;
    if(!sectionData)return[];
    return level==='junior'?sectionData.junior:sectionData.senior;
  };

  const handleSubmitQuiz=async()=>{
    const qs=getQuizData();
    let score=0;
    qs.forEach((q,i)=>{if(answers[i]===q.ans)score++;});
    const pct=Math.round((score/qs.length)*100);
    setSubmitted(true);
    try{
      await saveResult({userId:user.id,sectionId:section,level,score,total:qs.length,percentage:pct,answers});
      showToast(`Quiz submitted! Score: ${score}/${qs.length} (${pct}%)`);
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

  return(
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">📚 SAP SD Mastery Hub</h1>
        <div className="nav-right">
          <span className="user-badge">{user.fullName||user.email}</span>
          <button className="btn-logout" onClick={()=>{signOut();setUser(null);}}>Logout</button>
        </div>
      </nav>

      {!section?(
        <div className="main-card">
          <h2>Select a Topic</h2>
          <p className="subtitle">18 sections + Special tabs</p>
          <div className="section-grid">
            {allTabs.map(t=>(
              <div key={t.id} className="section-card" onClick={()=>{setSection(t.id);setTab(t.hasConcepts?'concepts':'quiz');setSubmitted(false);setAnswers({});}}>
                <h3>{t.title}</h3><p>{t.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      ):(
        <div className="main-card">
          <button className="btn-back" onClick={()=>{setSection(null);setSubmitted(false);setAnswers({});}}>← Back to Topics</button>
          <h2>{current?.title}: {current?.subtitle}</h2>

          <div className="tab-bar">
            {current?.hasConcepts&&<button className={`tab ${tab==='concepts'?'active':''}`} onClick={()=>setTab('concepts')}>📚 Concepts</button>}
            {current?.hasQuiz&&<button className={`tab ${tab==='quiz'?'active':''}`} onClick={()=>{setTab('quiz');setSubmitted(false);setAnswers({});}}>❓ Quiz</button>}
            {current?.hasResults&&<button className={`tab ${tab==='results'?'active':''}`} onClick={()=>{setTab('results');loadResults(section);}}>📊 Results</button>}
            {current?.hasFeedback&&<button className={`tab ${tab==='feedback'?'active':''}`} onClick={()=>setTab('feedback')}>📝 Feedback</button>}
          </div>

          {/* CONCEPTS TAB */}
          {tab==='concepts'&&section==='tcodes'?(
            <div>
              <h3 className="section-header">Key Transaction Codes</h3>
              <div className="ref-grid">{TCODES.map((t,i)=><div key={i} className="ref-item"><strong>{t.code}</strong><span>{t.desc}</span></div>)}</div>
              <h3 className="section-header" style={{marginTop:20}}>SE16N Tables</h3>
              <div className="ref-grid">{SE16N.map((t,i)=><div key={i} className="ref-item"><strong>{t.table}</strong><span>{t.desc}</span></div>)}</div>
            </div>
          ):tab==='concepts'&&sectionData?(
            <div className="concepts-grid">
              {sectionData.concepts.map((c,i)=>(
                <div key={i} className="concept-box">
                  <h4>{c.name}</h4>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          ):null}

          {/* QUIZ TAB */}
          {tab==='quiz'&&current?.hasQuiz&&(
            <div className="quiz-container">
              {section!=='advanced'&&section!=='finaltest'&&(
                <div className="level-toggle">
                  <button className={`lvl-btn ${level==='junior'?'active':''}`} onClick={()=>{setLevel('junior');setSubmitted(false);setAnswers({});}}>Junior Consultant</button>
                  <button className={`lvl-btn ${level==='senior'?'active':''}`} onClick={()=>{setLevel('senior');setSubmitted(false);setAnswers({});}}>Senior Consultant</button>
                </div>
              )}
              {getQuizData().map((q,i)=>(
                <div key={i} className="quiz-q">
                  <div className="q-num">Q{i+1}.</div>
                  <div className="q-text">{q.q}</div>
                  <div className="options">
                    {q.opts.map((opt,oi)=>(
                      <div key={oi}
                        className={`option ${answers[i]===oi?'selected':''} ${submitted&&oi===q.ans?'correct':''} ${submitted&&answers[i]===oi&&oi!==q.ans?'wrong':''}`}
                        onClick={()=>{if(!submitted){setAnswers(p=>({...p,[i]:oi}));}}}
                      >{opt}</div>
                    ))}
                  </div>
                  {submitted&&<div className="explanation"><strong>✅ Explanation:</strong> {q.exp}</div>}
                </div>
              ))}
              {!submitted?(
                <button className="btn-submit" onClick={handleSubmitQuiz} disabled={Object.keys(answers).length<getQuizData().length}>
                  Submit All Answers ({Object.keys(answers).length}/{getQuizData().length})
                </button>
              ):(
                <div className="score-banner">
                  Score: {getQuizData().filter((q,i)=>answers[i]===q.ans).length}/{getQuizData().length}
                  ({Math.round((getQuizData().filter((q,i)=>answers[i]===q.ans).length/getQuizData().length)*100)}%)
                </div>
              )}
            </div>
          )}

          {/* RESULTS TAB */}
          {tab==='results'&&(
            <div>{results.length>0?(
              <div className="results-grid">{results.map((r,i)=>(
                <div key={i} className="result-card">
                  <div className="result-score">{r.percentage||Math.round((r.score/r.total)*100)}%</div>
                  <div className="result-meta">{r.score}/{r.total} • {r.level} • {new Date(r.createdAt||r.created_at).toLocaleDateString()}</div>
                </div>
              ))}</div>
            ):<p className="empty">No results yet. Take a quiz!</p>}</div>
          )}

          {/* FEEDBACK TAB */}
          {tab==='feedback'&&(
            <form className="feedback-form" onSubmit={handleFeedback}>
              <h3>{section==='finalfeedback'?'Overall Platform Feedback':'Section Feedback'}</h3>
              <label>Difficulty<select name="difficulty" required><option value="">Select</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
              <label>Clarity<select name="clarity" required><option value="">Select</option><option>Very Clear</option><option>Clear</option><option>Confusing</option></select></label>
              <label>Suggestions<textarea name="suggestion" placeholder="Your feedback..."></textarea></label>
              <button type="submit" className="btn-submit">Submit Feedback</button>
            </form>
          )}
        </div>
      )}

      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

function AuthScreen({onLogin,showToast,toast}){
  const[mode,setMode]=useState('login');
  const[loading,setLoading]=useState(false);
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
  return(
    <div className="auth-screen">
      <div className="auth-box">
        <h1>📚 SAP SD Mastery Hub</h1>
        <p className="subtitle">Interview Prep Platform</p>
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
      </div>
      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

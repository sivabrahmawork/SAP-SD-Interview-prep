import React,{useState,useEffect,useCallback} from 'react';
import {SECTIONS,TCODES,SE16N,ADVANCED,FINAL_TEST,CHEATSHEETS} from './data/sections';
import QUESTION_BANK from './data/questionBankIndex';
import {FICO_SECTIONS,FICO_CHEATSHEETS,FICO_TAB_META,FICO_ROTATION_TABS} from './data/sectionsFico';
import QUESTION_BANK_FICO from './data/questionBankFico';
import {RAR_SECTIONS,RAR_ROTATION_TABS,RAR_CHEATSHEETS} from './data/sectionsRar';
import QUESTION_BANK_RAR from './data/questionBankRar';
import {signUp,signIn,signOut,saveResult,getResults,saveFeedback,updateProfile,changePassword,adminGetAllUsers,adminGetAllResults,adminGetAllFeedback,isLocalMode,checkIsAdmin,signInWithGoogle,getCurrentUser,subscribeAuthChanges} from './lib/storage';

const ADMIN_PIN='SD2025hub';

// Deterministic daily pick: same user + same day = same question, no server needed.
function simpleHash(str){
  let h=0;
  for(let i=0;i<str.length;i++){h=((h<<5)-h+str.charCodeAt(i))|0;}
  return Math.abs(h);
}
// Part 6 (FICO Master Build File) — rotation length is per-module, not hardcoded.
// SD stays 14 days. FICO = 18 (FI Day 1-10 + CO Day 1-8). RAR = 7 days.
// Overflow and Integration tabs sit outside the rotation for each.
const MODULES = {
  sd:{
    key:'sd',label:'SAP SD',rotationDays:14,
    sections:SECTIONS,questionBank:QUESTION_BANK,cheatsheets:CHEATSHEETS,
    rotationTabs:SECTIONS.map(s=>s.id),comingSoon:[],
  },
  fico:{
    key:'fico',label:'SAP FICO',rotationDays:18,
    sections:FICO_SECTIONS,questionBank:QUESTION_BANK_FICO,cheatsheets:FICO_CHEATSHEETS,
    rotationTabs:FICO_ROTATION_TABS,comingSoon:FICO_TAB_META,
  },
  rar:{
    key:'rar',label:'SAP RAR',rotationDays:7,
    sections:RAR_SECTIONS,questionBank:QUESTION_BANK_RAR,cheatsheets:RAR_CHEATSHEETS,
    rotationTabs:RAR_ROTATION_TABS,comingSoon:[],
  },
};

function getTodaysQuestion(user,moduleKey){
  if(!user?.questionNotifEnabled) return null;
  const mod=MODULES[moduleKey]||MODULES.sd;
  const diff=user.questionNotifDifficulty||'easy';
  const today=new Date().toISOString().split('T')[0];
  const hash=simpleHash(`${user.id}${today}${moduleKey}`);
  const dayIndex=hash%mod.rotationDays;
  const tabId=mod.rotationTabs[dayIndex];
  const tab=mod.sections.find(s=>s.id===tabId);
  if(!tab) return null;
  const pool=diff==='easy'?tab.junior:tab.senior;
  if(!pool||pool.length===0) return null;
  const qIndex=hash%pool.length;
  return pool[qIndex];
}

function App(){
  const [user,setUser]=useState(null);
  const [activeModule,setActiveModule]=useState('sd');
  const [view,setView]=useState('home');
  const [selectedTab,setSelectedTab]=useState(null);
  const [quizMode,setQuizMode]=useState(false);
  const [answers,setAnswers]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const [results,setResults]=useState(null);
  const [adminView,setAdminView]=useState('users');
  const [adminPin,setAdminPin]=useState('');
  const [isAdmin,setIsAdmin]=useState(false);
  const [loading,setLoading]=useState(true);
  const [feedback,setFeedback]=useState('');
  const [allUsers,setAllUsers]=useState([]);
  const [allResults,setAllResults]=useState([]);
  const [allFeedback,setAllFeedback]=useState([]);
  const [userResults,setUserResults]=useState([]);
  const [editingProfile,setEditingProfile]=useState(false);

  // Auth subscription
  useEffect(()=>{
    const unsub=subscribeAuthChanges(async(authUser)=>{
      if(authUser){
        const userData=await getCurrentUser();
        setUser({...userData,id:authUser.uid});
      }else{
        setUser(null);
      }
      setLoading(false);
    });
    return ()=>unsub();
  },[]);

  // Load user results
  useEffect(()=>{
    if(user&&!isAdmin){
      getResults(user.id).then(setUserResults);
    }
  },[user,isAdmin]);

  // Admin check
  useEffect(()=>{
    if(user&&adminPin===ADMIN_PIN){
      checkIsAdmin(user.id).then(admin=>{
        setIsAdmin(admin);
        if(admin){
          adminGetAllUsers().then(setAllUsers);
          adminGetAllResults().then(setAllResults);
          adminGetAllFeedback().then(setAllFeedback);
        }
      });
    }
  },[user,adminPin]);

  const handleSignUp=async(email,pass)=>{
    try{await signUp(email,pass); setView('home');}catch(e){alert(e.message);}
  };
  const handleSignIn=async(email,pass)=>{
    try{await signIn(email,pass); setView('home');}catch(e){alert(e.message);}
  };
  const handleSignOut=async()=>{
    await signOut(); setUser(null); setView('home');
  };
  const handleSignInGoogle=async()=>{
    try{await signInWithGoogle(); setView('home');}catch(e){alert(e.message);}
  };

  const handleAnswer=(qIndex,optIndex)=>{
    setAnswers({...answers,[qIndex]:optIndex});
  };

  const handleSubmitQuiz=async()=>{
    if(!selectedTab||!user) return;
    const mod=MODULES[activeModule];
    const tab=mod.sections.find(s=>s.id===selectedTab);
    if(!tab) return;
    const diff=tab.junior.length>0?'junior':'senior';
    const pool=diff==='junior'?tab.junior:tab.senior;
    let correct=0;
    pool.forEach((q,i)=>{
      if(answers[i]===q.ans) correct++;
    });
    const score=Math.round((correct/pool.length)*100);
    await saveResult(user.id,activeModule,selectedTab,score);
    setResults({score,total:pool.length,correct});
    setSubmitted(true);
  };

  const handleFeedback=async()=>{
    if(!user||!feedback.trim()) return;
    await saveFeedback(user.id,activeModule,selectedTab,feedback);
    setFeedback('');
    alert('Feedback saved!');
  };

  const handleProfileUpdate=async(updates)=>{
    if(!user) return;
    try{
      await updateProfile(user.id,updates);
      setUser({...user,...updates});
      setEditingProfile(false);
      alert('Profile updated!');
    }catch(e){alert(e.message);}
  };

  if(loading) return <div style={{textAlign:'center',marginTop:'50px'}}>Loading...</div>;

  const mod=MODULES[activeModule];
  const selectedTabObj=selectedTab?mod.sections.find(s=>s.id===selectedTab):null;

  if(!user) return (
    <div style={{maxWidth:'400px',margin:'50px auto',padding:'20px',border:'1px solid #ccc',borderRadius:'8px'}}>
      <h2>SAP Interview Hub</h2>
      <div style={{display:'flex',gap:'10px',marginBottom:'15px'}}>
        <button onClick={()=>setView('signin')} style={{flex:1,padding:'10px'}}>Sign In</button>
        <button onClick={()=>setView('signup')} style={{flex:1,padding:'10px'}}>Sign Up</button>
      </div>
      <button onClick={handleSignInGoogle} style={{width:'100%',padding:'10px',marginBottom:'10px'}}>Sign In with Google</button>
      
      {view==='signin'&&(
        <form onSubmit={(e)=>{e.preventDefault();const [email,pass]=new FormData(e.target).values();handleSignIn([...new FormData(e.target).values()][0],[...new FormData(e.target).values()][1]);}} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <input type="email" placeholder="Email" required style={{padding:'8px'}}/>
          <input type="password" placeholder="Password" required style={{padding:'8px'}}/>
          <button type="submit" style={{padding:'10px'}}>Sign In</button>
        </form>
      )}
      
      {view==='signup'&&(
        <form onSubmit={(e)=>{e.preventDefault();const fd=new FormData(e.target);const vals=[...fd.values()];handleSignUp(vals[0],vals[1]);}} style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          <input type="email" placeholder="Email" required style={{padding:'8px'}}/>
          <input type="password" placeholder="Password" required style={{padding:'8px'}}/>
          <button type="submit" style={{padding:'10px'}}>Sign Up</button>
        </form>
      )}
    </div>
  );

  if(isAdmin) return (
    <div style={{maxWidth:'1000px',margin:'0 auto',padding:'20px'}}>
      <h1>Admin Console</h1>
      <button onClick={handleSignOut} style={{float:'right',padding:'8px 15px'}}>Sign Out</button>
      
      <div style={{marginBottom:'20px',display:'flex',gap:'10px'}}>
        <button onClick={()=>setAdminView('users')} style={{padding:'8px 15px',background:adminView==='users'?'#007bff':'#ddd'}}>Users</button>
        <button onClick={()=>setAdminView('results')} style={{padding:'8px 15px',background:adminView==='results'?'#007bff':'#ddd'}}>Results</button>
        <button onClick={()=>setAdminView('feedback')} style={{padding:'8px 15px',background:adminView==='feedback'?'#007bff':'#ddd'}}>Feedback</button>
      </div>

      {adminView==='users'&&(
        <div>
          <h3>All Users ({allUsers.length})</h3>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{border:'1px solid #ddd',padding:'8px'}}>Email</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Active Module</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Notifications</th></tr></thead>
            <tbody>
              {allUsers.map((u,i)=><tr key={i}><td style={{border:'1px solid #ddd',padding:'8px'}}>{u.email}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{u.activeModule||'sd'}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{u.questionNotifEnabled?'On':'Off'}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {adminView==='results'&&(
        <div>
          <h3>Quiz Results ({allResults.length})</h3>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
            <thead><tr><th style={{border:'1px solid #ddd',padding:'8px'}}>User</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Module</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Section</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Score</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Date</th></tr></thead>
            <tbody>
              {allResults.map((r,i)=><tr key={i}><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.user_id?.slice(0,8)}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.module}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.section}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.score}%</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{new Date(r.timestamp).toLocaleDateString()}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {adminView==='feedback'&&(
        <div>
          <h3>Feedback ({allFeedback.length})</h3>
          {allFeedback.map((f,i)=><div key={i} style={{padding:'10px',border:'1px solid #ddd',marginBottom:'10px',borderRadius:'4px'}}>
            <strong>{f.user_id?.slice(0,8)} - {f.module}/{f.section}</strong>
            <p style={{margin:'5px 0 0 0',fontSize:'14px'}}>{f.feedback}</p>
          </div>)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'20px',fontFamily:'Arial,sans-serif'}}>
      <h1>SAP Interview Hub</h1>
      
      <div style={{display:'flex',gap:'10px',marginBottom:'20px',alignItems:'center'}}>
        <select value={activeModule} onChange={(e)=>{setActiveModule(e.target.value);setSelectedTab(null);setQuizMode(false);}} style={{padding:'8px 15px',fontSize:'16px'}}>
          <option value="sd">SAP SD</option>
          <option value="fico">SAP FICO</option>
          <option value="rar">SAP RAR</option>
        </select>
        
        <button onClick={()=>setView('home')} style={{padding:'8px 15px',background:view==='home'?'#007bff':'#ddd',color:view==='home'?'white':'black',cursor:'pointer'}}>Home</button>
        <button onClick={()=>{setView('profile');setEditingProfile(false);}} style={{padding:'8px 15px',background:view==='profile'?'#007bff':'#ddd',color:view==='profile'?'white':'black',cursor:'pointer'}}>Profile</button>
        
        <input type="password" placeholder="Admin PIN" value={adminPin} onChange={(e)=>setAdminPin(e.target.value)} style={{padding:'8px 15px',marginLeft:'auto',width:'120px'}}/>
        <button onClick={handleSignOut} style={{padding:'8px 15px'}}>Sign Out</button>
      </div>

      {view==='home'&&(
        <>
          <div style={{marginBottom:'20px'}}>
            <h3>{mod.label} - Select a Tab</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'10px'}}>
              {mod.sections.map(tab=>(
                <button key={tab.id} onClick={()=>{setSelectedTab(tab.id);setQuizMode(false);setSubmitted(false);}} style={{padding:'15px',border:selectedTab===tab.id?'2px solid #007bff':'1px solid #ddd',background:selectedTab===tab.id?'#e7f3ff':'white',cursor:'pointer',borderRadius:'4px',fontSize:'14px',fontWeight:selectedTab===tab.id?'bold':'normal'}}>
                  {tab.title}<br/><small>{tab.subtitle}</small>
                </button>
              ))}
            </div>
          </div>

          {selectedTabObj&&(
            <div style={{background:'#f9f9f9',padding:'20px',borderRadius:'8px',marginTop:'20px'}}>
              <h2>{selectedTabObj.title}</h2>
              <p><em>{selectedTabObj.subtitle}</em></p>

              {!quizMode&&!submitted&&(
                <div>
                  <h3>Concepts</h3>
                  {selectedTabObj.concepts?.map((c,i)=><div key={i} style={{marginBottom:'15px',paddingBottom:'15px',borderBottom:'1px solid #ddd'}}>
                    <h4 style={{margin:'5px 0'}}>{c.name}</h4>
                    <p style={{margin:'5px 0',fontSize:'14px',color:'#555'}}>{c.text}</p>
                  </div>)}

                  <div style={{marginTop:'20px',display:'flex',gap:'10px'}}>
                    <button onClick={()=>setQuizMode(true)} style={{padding:'10px 20px',background:'#28a745',color:'white',cursor:'pointer',borderRadius:'4px'}}>Start Q&A Quiz</button>
                    {mod.cheatsheets?.[selectedTabObj.id]&&<button onClick={()=>alert(mod.cheatsheets[selectedTabObj.id].content)} style={{padding:'10px 20px',background:'#ffc107',cursor:'pointer',borderRadius:'4px'}}>View Cheatsheet</button>}
                  </div>
                </div>
              )}

              {quizMode&&!submitted&&(
                <div>
                  <h3>Q&A Quiz</h3>
                  {(selectedTabObj.junior||[]).map((q,i)=><div key={i} style={{marginBottom:'20px',paddingBottom:'20px',borderBottom:'1px solid #ddd'}}>
                    <p style={{fontWeight:'bold',marginBottom:'10px'}}>Q{i+1}: {q.q}</p>
                    {q.opts?.map((opt,j)=><label key={j} style={{display:'block',marginBottom:'8px',cursor:'pointer'}}>
                      <input type="radio" name={`q${i}`} onChange={()=>handleAnswer(i,j)} checked={answers[i]===j} style={{marginRight:'8px'}}/>
                      {opt}
                    </label>)}
                  </div>)}
                  <button onClick={handleSubmitQuiz} style={{padding:'10px 20px',background:'#007bff',color:'white',cursor:'pointer',borderRadius:'4px'}}>Submit Quiz</button>
                </div>
              )}

              {submitted&&results&&(
                <div style={{background:'#e8f5e9',padding:'20px',borderRadius:'4px',marginTop:'20px'}}>
                  <h3>Results</h3>
                  <p style={{fontSize:'18px',fontWeight:'bold'}}>Score: {results.score}% ({results.correct}/{results.total})</p>
                  <textarea placeholder="Share your feedback..." value={feedback} onChange={(e)=>setFeedback(e.target.value)} style={{width:'100%',height:'100px',padding:'10px',marginTop:'10px',marginBottom:'10px',borderRadius:'4px',border:'1px solid #ddd'}}/>
                  <button onClick={handleFeedback} style={{padding:'8px 15px',background:'#007bff',color:'white',cursor:'pointer',borderRadius:'4px'}}>Submit Feedback</button>
                  <button onClick={()=>{setQuizMode(false);setSubmitted(false);setAnswers({});}} style={{padding:'8px 15px',marginLeft:'10px',cursor:'pointer',borderRadius:'4px'}}>Retake Quiz</button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {view==='profile'&&(
        <div style={{background:'#f9f9f9',padding:'20px',borderRadius:'8px',maxWidth:'500px'}}>
          <h2>Profile</h2>
          {editingProfile?(
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <label>
                Active Module:
                <select onChange={(e)=>handleProfileUpdate({activeModule:e.target.value})} style={{marginLeft:'10px',padding:'5px'}}>
                  <option value="sd">SD</option>
                  <option value="fico">FICO</option>
                  <option value="rar">RAR</option>
                </select>
              </label>
              <label>
                <input type="checkbox" checked={user?.questionNotifEnabled||false} onChange={(e)=>handleProfileUpdate({questionNotifEnabled:e.target.checked})}/> Enable Daily Notifications
              </label>
              <label>
                Question Difficulty:
                <select onChange={(e)=>handleProfileUpdate({questionNotifDifficulty:e.target.value})} style={{marginLeft:'10px',padding:'5px'}}>
                  <option value="easy">Easy (Junior)</option>
                  <option value="hard">Hard (Senior)</option>
                </select>
              </label>
              <button onClick={()=>setEditingProfile(false)} style={{padding:'8px 15px',background:'#28a745',color:'white',cursor:'pointer',borderRadius:'4px'}}>Done</button>
            </div>
          ):(
            <div>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Active Module:</strong> {(user?.activeModule||'sd').toUpperCase()}</p>
              <p><strong>Daily Notifications:</strong> {user?.questionNotifEnabled?'On':'Off'}</p>
              <p><strong>Difficulty:</strong> {user?.questionNotifDifficulty==='hard'?'Senior (Hard)':'Junior (Easy)'}</p>
              <button onClick={()=>setEditingProfile(true)} style={{padding:'8px 15px',background:'#007bff',color:'white',cursor:'pointer',borderRadius:'4px'}}>Edit</button>
            </div>
          )}

          <h3 style={{marginTop:'20px'}}>My Results</h3>
          {userResults.length>0?(
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><th style={{border:'1px solid #ddd',padding:'8px'}}>Module</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Section</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Score</th><th style={{border:'1px solid #ddd',padding:'8px'}}>Date</th></tr></thead>
              <tbody>
                {userResults.map((r,i)=><tr key={i}><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.module}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.section}</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{r.score}%</td><td style={{border:'1px solid #ddd',padding:'8px'}}>{new Date(r.timestamp).toLocaleDateString()}</td></tr>)}
              </tbody>
            </table>
          ):<p>No results yet. Start a quiz!</p>}
        </div>
      )}
    </div>
  );
}

export default App;

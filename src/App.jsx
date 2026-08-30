import React,{useState,useEffect,useCallback} from 'react';
import {SECTIONS,TCODES,SE16N,ADVANCED,FINAL_TEST,CHEATSHEETS} from './data/sections';
import QUESTION_BANK from './data/questionBankIndex';
import {FICO_SECTIONS,FICO_CHEATSHEETS,FICO_TAB_META,FICO_ROTATION_TABS} from './data/sectionsFico';
import QUESTION_BANK_FICO from './data/questionBankFico';
import {RAR_SECTIONS,RAR_ROTATION_TABS,RAR_CHEATSHEETS} from './data/sectionsRar';
import QUESTION_BANK_RAR from './data/questionBankRar';
import {signUp,signIn,signOut,saveResult,getResults,saveFeedback,updateProfile,changePassword,adminGetAllUsers,adminGetAllResults,adminGetAllFeedback,isLocalMode,checkIsAdmin,signInWithGoogle,getCurrentUser,subscribeAuthChanges} from './lib/storage';
import './styles/App.css';

const ADMIN_PIN='SD2025hub';

function simpleHash(str){
  let h=0;
  for(let i=0;i<str.length;i++){h=((h<<5)-h+str.charCodeAt(i))|0;}
  return Math.abs(h);
}

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

function pickTodaysQuestion(userId,moduleKey){
  const mod=MODULES[moduleKey]||MODULES.sd;
  const bank=mod.questionBank;
  if(!bank||bank.length===0) return null;
  const today=new Date().toISOString().split('T')[0];
  const hash=simpleHash(userId+today+moduleKey);
  return bank[hash%bank.length];
}

function renderCheatsheet(content){
  if(!content) return null;
  return <div className="cheatsheet" dangerouslySetInnerHTML={{__html:content}}/>;
}

export default function App(){
  const [user,setUser]=useState(null);
  const [activeModule,setActiveModule]=useState('sd');
  const [selectedTab,setSelectedTab]=useState(null);
  const [quizMode,setQuizMode]=useState(false);
  const [view,setView]=useState('signin');
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
  const [profileForm,setProfileForm]=useState({fullName:'',gender:'',dob:'',company:'',country:''});
  const [showCheatsheet,setShowCheatsheet]=useState(false);

  useEffect(()=>{
    const unsubscribe=subscribeAuthChanges(async(authUser)=>{
      setUser(authUser);
      if(authUser){
        const res=await getResults(authUser.id);
        setUserResults(res||[]);
        setActiveModule(authUser.activeModule||'sd');
      }
      setLoading(false);
    });
    return ()=>unsubscribe();
  },[]);

  const handleSignUp=async(fullName,gender,dob,company,country,email,password)=>{
    try{
      await signUp(email,password,{fullName,gender,dob,company,country});
      setView('signin');
      alert('Account created! Please sign in.');
    }catch(e){
      alert('Sign up failed: '+e.message);
    }
  };

  const handleSignIn=async(email,password)=>{
    try{
      await signIn(email,password);
      setView('home');
    }catch(e){
      alert('Sign in failed: '+e.message);
    }
  };

  const handleSignInGoogle=async()=>{
    try{
      await signInWithGoogle();
    }catch(e){
      alert('Google sign-in failed: '+e.message);
    }
  };

  const handleAnswer=(qIndex,optIndex)=>{
    setAnswers({...answers,[qIndex]:optIndex});
  };

  const handleSubmitQuiz=async()=>{
    if(!user) return;
    const mod=MODULES[activeModule];
    const pool=selectedTab?mod.questionBank.filter(q=>q.section===selectedTab):[];
    let correct=0;
    pool.forEach((q,i)=>{
      if(answers[i]===q.correct) correct++;
    });
    const score=Math.round((correct/pool.length)*100);
    await saveResult(user.id,activeModule,selectedTab,score,pool.length);
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
    }catch(e){
      alert(e.message);
    }
  };

  const handleAdminPin=async()=>{
    if(adminPin===ADMIN_PIN){
      const isAdm=await checkIsAdmin(user.id);
      if(isAdm){
        setIsAdmin(true);
        const users=await adminGetAllUsers();
        const results=await adminGetAllResults();
        const fb=await adminGetAllFeedback();
        setAllUsers(users||[]);
        setAllResults(results||[]);
        setAllFeedback(fb||[]);
      }else{
        alert('Not an admin user');
      }
    }else{
      alert('Invalid PIN');
    }
  };

  if(loading) return <div style={{textAlign:'center',marginTop:'50px'}}>Loading...</div>;

  const mod=MODULES[activeModule];
  const selectedTabObj=selectedTab?mod.sections.find(s=>s.id===selectedTab):null;

  // LOGIN SCREEN
  if(!user) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#f7f7fb,#ede9ff)'}}>
      <div className="auth-box">
        <h1>SAP Interview Hub</h1>
        <div className="auth-toggle">
          <button className={view==='signin'?'active':''} onClick={()=>setView('signin')}>Sign In</button>
          <button className={view==='signup'?'active':''} onClick={()=>setView('signup')}>Sign Up</button>
        </div>

        {view==='signin'&&(
          <form onSubmit={(e)=>{
            e.preventDefault();
            const formData=new FormData(e.target);
            const vals=[...formData.values()];
            handleSignIn(vals[0],vals[1]);
          }} className="auth-box form">
            <input type="email" name="email" placeholder="Email" required/>
            <input type="password" name="password" placeholder="Password" required/>
            <button type="submit" className="btn-auth">Sign In</button>
          </form>
        )}

        {view==='signup'&&(
          <form onSubmit={(e)=>{
            e.preventDefault();
            const formData=new FormData(e.target);
            const vals=[...formData.values()];
            handleSignUp(vals[0],vals[1],vals[2],vals[3],vals[4],vals[5],vals[6]);
          }} className="auth-box form">
            <input type="text" name="fullName" placeholder="Full Name" required/>
            <input type="text" name="gender" placeholder="Gender (M/F/Other)" required/>
            <input type="date" name="dob" placeholder="Date of Birth" required/>
            <input type="text" name="company" placeholder="Company" required/>
            <input type="text" name="country" placeholder="Country" required/>
            <input type="email" name="email" placeholder="Email" required/>
            <input type="password" name="password" placeholder="Password" required/>
            <button type="submit" className="btn-auth">Sign Up</button>
          </form>
        )}

        <div className="auth-divider">or</div>
        <button onClick={handleSignInGoogle} className="btn-google">
          <span>Sign In with Google</span>
        </button>
      </div>
    </div>
  );

  // ADMIN CONSOLE
  if(isAdmin) return (
    <div className="app">
      <div className="navbar">
        <div className="logo">SAP Interview Hub - Admin</div>
        <button onClick={()=>{setIsAdmin(false);handleSignOut();}} className="btn-logout">Sign Out</button>
      </div>

      <div className="main-card">
        <h2>Admin Console</h2>
        <div style={{display:'flex',gap:'10px',marginBottom:'20px'}}>
          <button onClick={()=>setAdminView('users')} className={`lvl-btn ${adminView==='users'?'active':''}`}>Users ({allUsers.length})</button>
          <button onClick={()=>setAdminView('results')} className={`lvl-btn ${adminView==='results'?'active':''}`}>Results ({allResults.length})</button>
          <button onClick={()=>setAdminView('feedback')} className={`lvl-btn ${adminView==='feedback'?'active':''}`}>Feedback ({allFeedback.length})</button>
        </div>

        {adminView==='users'&&(
          <table className="cs-table">
            <thead><tr><th>Email</th><th>Name</th><th>Gender</th><th>Company</th><th>Country</th><th>Active Module</th><th>Notifications</th></tr></thead>
            <tbody>
              {allUsers.map((u,i)=><tr key={i}>
                <td>{u.email}</td>
                <td>{u.full_name||'-'}</td>
                <td>{u.gender||'-'}</td>
                <td>{u.company||'-'}</td>
                <td>{u.country||'-'}</td>
                <td>{(u.activeModule||'sd').toUpperCase()}</td>
                <td>{u.question_notif_enabled?'On':'Off'}</td>
              </tr>)}
            </tbody>
          </table>
        )}

        {adminView==='results'&&(
          <table className="cs-table">
            <thead><tr><th>User Email</th><th>Module</th><th>Section</th><th>Score</th><th>Date</th></tr></thead>
            <tbody>
              {allResults.map((r,i)=><tr key={i}>
                <td>{r.user_email}</td>
                <td>{r.module}</td>
                <td>{r.section}</td>
                <td>{r.score}%</td>
                <td>{new Date(r.timestamp).toLocaleDateString()}</td>
              </tr>)}
            </tbody>
          </table>
        )}

        {adminView==='feedback'&&(
          <div>
            {allFeedback.map((fb,i)=>(
              <div key={i} className="cs-tip" style={{marginBottom:'15px'}}>
                <h4>{fb.user_email} - {fb.module} / {fb.section}</h4>
                <p>{fb.feedback_text}</p>
                <small style={{color:'#999'}}>{new Date(fb.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // MAIN APP
  return (
    <div className="app">
      <div className="navbar">
        <div className="logo">SAP Interview Hub</div>
        <div className="nav-right">
          <select onChange={(e)=>setActiveModule(e.target.value)} value={activeModule} style={{padding:'8px 12px',borderRadius:'8px',border:'1px solid #e4e4ec',background:'#fff'}}>
            <option value="sd">SAP SD (14d)</option>
            <option value="fico">SAP FICO (18d)</option>
            <option value="rar">SAP RAR (7d)</option>
          </select>
          <button onClick={()=>setView('home')} className={`lvl-btn ${view==='home'?'active':''}`} style={{marginLeft:'10px'}}>Home</button>
          <button onClick={()=>setView('profile')} className={`lvl-btn ${view==='profile'?'active':''}`}>Profile</button>
          <button onClick={()=>{setAdminPin('');setIsAdmin(false);handleSignOut();}} className="btn-logout">Sign Out</button>
        </div>
      </div>

      {!isAdmin&&view==='home'&&(
        <div className="main-card">
          <div className="hero">
            <h2>{mod.label} - Select a Tab</h2>
            <p className="subtitle">Daily rotation: {mod.rotationDays} days</p>
          </div>

          <div className="section-grid">
            {mod.rotationTabs.map(tabId=>{
              const tab=mod.sections.find(s=>s.id===tabId);
              return (
                <div key={tabId} className={`section-card ${tab.special?'section-card--special':''}`} onClick={()=>{setSelectedTab(tabId);setQuizMode(false);setSubmitted(false);setAnswers({});}}>
                  <div className="section-card__tag">{tab.day?'Day '+tab.day:'Reference'}</div>
                  <h3>{tab.title}</h3>
                  <p>{tab.subtitle}</p>
                </div>
              );
            })}
          </div>

          {selectedTabObj&&!quizMode&&!submitted&&(
            <div style={{marginTop:'30px'}}>
              <h3 style={{marginBottom:'15px',color:'#5b4dc7'}}>Concepts</h3>
              <div className="concepts-grid">
                {selectedTabObj.concepts?.map((c,i)=>(
                  <div key={i} className="concept-box">
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{marginTop:'20px',display:'flex',gap:'10px'}}>
                <button onClick={()=>setQuizMode(true)} className="btn-submit" style={{width:'auto',marginTop:'0'}}>Start Q&A Quiz</button>
                {mod.cheatsheets?.[selectedTabObj.id]&&(
                  <button onClick={()=>setShowCheatsheet(!showCheatsheet)} className="btn-submit" style={{width:'auto',marginTop:'0',background:'#d97706'}}>
                    {showCheatsheet?'Hide':'Show'} Cheatsheet
                  </button>
                )}
              </div>

              {showCheatsheet&&mod.cheatsheets?.[selectedTabObj.id]&&(
                <div style={{marginTop:'20px',padding:'20px',background:'#fef3c7',borderRadius:'8px',borderLeft:'3px solid #d97706'}}>
                  {renderCheatsheet(mod.cheatsheets[selectedTabObj.id].content)}
                </div>
              )}
            </div>
          )}

          {quizMode&&selectedTabObj&&(
            <div style={{marginTop:'30px'}}>
              <h3 style={{marginBottom:'20px',color:'#5b4dc7'}}>Quiz: {selectedTabObj.title}</h3>
              {mod.questionBank.filter(q=>q.section===selectedTab).map((q,i)=>(
                <div key={i} className="quiz-q">
                  <div className="q-num">Question {i+1}</div>
                  <div className="q-text">{q.question}</div>
                  <div className="options">
                    {q.opts?.map((opt,j)=>(
                      <label key={j} className={`option ${answers[i]===j?'selected':''}`} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <input type="radio" name={`q${i}`} onChange={()=>handleAnswer(i,j)} checked={answers[i]===j} style={{margin:0}}/>
                        {opt}
                      </label>
                    ))}
                  </div>
                  {submitted&&(
                    <div className="explanation">
                      <strong>{answers[i]===q.correct?'✓ Correct':'✗ Incorrect'}</strong>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
              {!submitted&&<button onClick={handleSubmitQuiz} className="btn-submit">Submit Quiz</button>}
            </div>
          )}

          {submitted&&results&&(
            <div style={{marginTop:'30px',background:'#e8f5e9',padding:'20px',borderRadius:'8px'}}>
              <h3>Results</h3>
              <p style={{fontSize:'18px',fontWeight:'bold',marginBottom:'15px'}}>Score: {results.score}% ({results.correct}/{results.total})</p>
              <textarea placeholder="Share your feedback..." value={feedback} onChange={(e)=>setFeedback(e.target.value)} style={{width:'100%',height:'100px',padding:'10px',marginBottom:'10px',borderRadius:'8px',border:'1px solid #ddd',fontFamily:'inherit'}}/>
              <div style={{display:'flex',gap:'10px'}}>
                <button onClick={handleFeedback} className="btn-submit" style={{width:'auto'}}>Submit Feedback</button>
                <button onClick={()=>{setQuizMode(false);setSubmitted(false);setAnswers({});}} className="btn-submit" style={{width:'auto',background:'#999'}}>Retake Quiz</button>
              </div>
            </div>
          )}
        </div>
      )}

      {view==='profile'&&(
        <div className="main-card">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">{user?.email?.[0].toUpperCase()||'U'}</div>
              <div>
                <h2 style={{margin:'0 0 3px 0'}}>{user?.fullName||'User'}</h2>
                <p style={{color:'#6b6b80',margin:0}}>{user?.email}</p>
              </div>
            </div>

            {!editingProfile&&(
              <div>
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="profile-grid">
                    <div className="profile-field">
                      <div className="profile-label">Full Name</div>
                      <div className="profile-value">{user?.fullName||'-'}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Gender</div>
                      <div className="profile-value">{user?.gender||'-'}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Date of Birth</div>
                      <div className="profile-value">{user?.dob||'-'}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Company</div>
                      <div className="profile-value">{user?.company||'-'}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Country</div>
                      <div className="profile-value">{user?.country||'-'}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Email</div>
                      <div className="profile-value">{user?.email||'-'}</div>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Learning Preferences</h3>
                  <div className="profile-grid">
                    <div className="profile-field">
                      <div className="profile-label">Active Module</div>
                      <div className="profile-value">{(user?.activeModule||'sd').toUpperCase()}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Daily Notifications</div>
                      <div className="profile-value">{user?.questionNotifEnabled?'On':'Off'}</div>
                    </div>
                    <div className="profile-field">
                      <div className="profile-label">Difficulty Level</div>
                      <div className="profile-value">{user?.questionNotifDifficulty==='hard'?'Senior (Hard)':'Junior (Easy)'}</div>
                    </div>
                  </div>
                </div>

                <button onClick={()=>{setEditingProfile(true);setProfileForm({fullName:user?.fullName||'',gender:user?.gender||'',dob:user?.dob||'',company:user?.company||'',country:user?.country||''});}} className="btn-edit" style={{marginTop:'20px'}}>Edit Profile</button>
              </div>
            )}

            {editingProfile&&(
              <div className="profile-edit">
                <label>
                  Full Name
                  <input type="text" value={profileForm.fullName} onChange={(e)=>setProfileForm({...profileForm,fullName:e.target.value})}/>
                </label>
                <label>
                  Gender
                  <input type="text" value={profileForm.gender} onChange={(e)=>setProfileForm({...profileForm,gender:e.target.value})} placeholder="M/F/Other"/>
                </label>
                <label>
                  Date of Birth
                  <input type="date" value={profileForm.dob} onChange={(e)=>setProfileForm({...profileForm,dob:e.target.value})}/>
                </label>
                <label>
                  Company
                  <input type="text" value={profileForm.company} onChange={(e)=>setProfileForm({...profileForm,company:e.target.value})}/>
                </label>
                <label>
                  Country
                  <input type="text" value={profileForm.country} onChange={(e)=>setProfileForm({...profileForm,country:e.target.value})}/>
                </label>
                <label>
                  Active Module
                  <select onChange={(e)=>handleProfileUpdate({activeModule:e.target.value})} defaultValue={user?.activeModule||'sd'}>
                    <option value="sd">SAP SD</option>
                    <option value="fico">SAP FICO</option>
                    <option value="rar">SAP RAR</option>
                  </select>
                </label>
                <label style={{display:'flex',gap:'8px',alignItems:'center'}}>
                  <input type="checkbox" checked={user?.questionNotifEnabled||false} onChange={(e)=>handleProfileUpdate({questionNotifEnabled:e.target.checked})}/>
                  <span>Enable Daily Notifications</span>
                </label>
                <label>
                  Question Difficulty
                  <select onChange={(e)=>handleProfileUpdate({questionNotifDifficulty:e.target.value})} defaultValue={user?.questionNotifDifficulty||'easy'}>
                    <option value="easy">Easy (Junior)</option>
                    <option value="hard">Hard (Senior)</option>
                  </select>
                </label>
                <div className="btn-row">
                  <button onClick={()=>{handleProfileUpdate(profileForm);}} className="btn-edit" style={{background:'#40c463',color:'#fff',border:'none'}}>Save Changes</button>
                  <button onClick={()=>setEditingProfile(false)} className="btn-cancel">Cancel</button>
                </div>
              </div>
            )}

            <div className="profile-section" style={{marginTop:'30px'}}>
              <h3>My Quiz Results</h3>
              {userResults.length>0?(
                <table className="cs-table">
                  <thead><tr><th>Module</th><th>Section</th><th>Score</th><th>Date</th></tr></thead>
                  <tbody>
                    {userResults.map((r,i)=><tr key={i}><td>{r.module}</td><td>{r.section}</td><td>{r.score}%</td><td>{new Date(r.timestamp).toLocaleDateString()}</td></tr>)}
                  </tbody>
                </table>
              ):<p>No quiz results yet.</p>}
            </div>

            <div style={{marginTop:'30px',paddingTop:'20px',borderTop:'1px solid #e4e4ec'}}>
              <div style={{display:'flex',gap:'10px'}}>
                <input type="password" placeholder="Admin PIN" value={adminPin} onChange={(e)=>setAdminPin(e.target.value)} style={{padding:'8px 12px',borderRadius:'8px',border:'1px solid #e4e4ec',flex:1}}/>
                <button onClick={handleAdminPin} className="btn-edit">Access Admin</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

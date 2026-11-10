import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Check, ChevronRight, Code2, History, LogOut, RefreshCw, Sparkles } from 'lucide-react'
import { words } from './data/words'
import { problems } from './data/problems'
import { configured, supabase } from './supabase'

const todayJapan = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
const prettyDate = (day) => new Intl.DateTimeFormat('zh-CN',{timeZone:'UTC',month:'long',day:'numeric',weekday:'long'}).format(new Date(`${day}T12:00:00Z`))
const randomPick = (array,count) => [...array].sort(()=>Math.random()-.5).slice(0,count)

// Stable daily assignments are inserted in Supabase exactly once per user and day.
function makeSession(uid,date,history){
  const usedWords = new Set(history.flatMap(s=>s.word_ids))
  const available = words.filter(w=>!usedWords.has(w.id))
  const pool = available.length >= 10 ? available : words
  const pickedWords = randomPick(pool,10).map(w=>w.id)
  const usedProblems = new Set(history.map(s=>s.problem_id))
  const problemPool = problems.filter(p=>!usedProblems.has(p.id))
  const chosen = randomPick(problemPool.length ? problemPool : problems,1)[0]
  return {user_id:uid,study_date:date,word_ids:pickedWords,problem_id:chosen.id,completed_word_ids:[],problem_done:false}
}
const GUEST_KEY = 'daily-learning-guest-sessions-v1'
function readGuestSessions(){try{const parsed=JSON.parse(localStorage.getItem(GUEST_KEY)||'[]');return Array.isArray(parsed)?parsed:[]}catch{return []}}
function saveGuestSessions(rows){localStorage.setItem(GUEST_KEY,JSON.stringify(rows))}
function Brand(){return <div className="brand"><div className="brand-icon"><Sparkles size={20}/></div><div><b>Daily Learning</b><small>毎日、少しずつ。</small></div></div>}
function Bar({value,max}){return <div className="bar"><span style={{width:`${Math.min(100,(value/max)*100)}%`}}/></div>}
function WordCard({word,done,onDone,disabled}){return <article className={`word-card ${done?'completed':''}`}><div className="word-head"><span className="tag">{word.category}</span><button className={`check-button ${done?'active':''}`} onClick={onDone} disabled={disabled}>{done?<><Check size={15}/> 已掌握</>:'标记已学'}</button></div><h3>{word.word}<span>{word.reading}</span></h3><p className="meaning">{word.meaning}</p><div className="word-details"><div><b>常见搭配</b><p>{word.phrases.join(' · ')}</p></div><div><b>近义词・区别</b><p>{word.synonyms}</p></div><div><b>例句</b><p className="jp-example">{word.example}</p></div><div><b>语感提示</b><p>{word.note}</p></div></div></article>}
function ProblemCard({problem,done,onDone,disabled}){const [hint,setHint]=useState(false);const [solution,setSolution]=useState(false);useEffect(()=>{setHint(false);setSolution(false)},[problem.id]);return <article className="problem-card"><div className="problem-head"><span className="tag blue">{problem.category}</span><span className="tag">{problem.level}</span></div><h2>{problem.title}</h2><p>{problem.description}</p><div className="sample-grid"><div><b>输入示例</b><pre>{problem.input}</pre></div><div><b>输出示例</b><pre>{problem.output}</pre></div></div><p className="concept">知识点：{problem.concept}</p><div className="problem-actions"><button className="subtle-btn" onClick={()=>setHint(!hint)}>{hint?'收起提示':'显示提示'}</button><button className="subtle-btn" onClick={()=>setSolution(!solution)}>{solution?'收起参考解答':'查看参考解答'}</button>{problem.source && <a className="subtle-btn" href={problem.source} target="_blank" rel="noreferrer">AtCoder 原题 ↗</a>}</div>{hint && <div className="hint">💡 {problem.hint}</div>}{solution && <pre className="solution">{problem.solution}</pre>}<button className={`finish-btn ${done?'done':''}`} onClick={onDone} disabled={disabled}>{done?<><Check size={19}/> 已完成</>:'完成这道题'}</button></article>}

export default function App(){
 const [auth,setAuth]=useState(null),[guest,setGuest]=useState(false),[mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[nickname,setNickname]=useState(''),[newPassword,setNewPassword]=useState(''),[sent,setSent]=useState(false),[authBusy,setAuthBusy]=useState(false),[notice,setNotice]=useState(''),[page,setPage]=useState('home'),[sessions,setSessions]=useState([]),[selectedDate,setSelectedDate]=useState(todayJapan()),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState('')
 useEffect(()=>{if(!configured){setLoading(false);return}supabase.auth.getSession().then(({data,error})=>{if(error)setError(error.message);setAuth(data.session);setLoading(false)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setAuth(session));return ()=>subscription.unsubscribe()},[])
 const load = useCallback(async()=>{if(!auth?.user&&!guest)return;setLoading(true);setError('');try{if(guest){let rows=readGuestSessions();const today=todayJapan();if(!rows.some(s=>s.study_date===today)){rows=[makeSession('guest',today,rows),...rows];saveGuestSessions(rows)}rows.sort((a,b)=>b.study_date.localeCompare(a.study_date));setSessions(rows);setSelectedDate(v=>rows.some(s=>s.study_date===v)?v:today);return}const uid=auth.user.id;const {data,error:queryError}=await supabase.from('daily_sessions').select('*').eq('user_id',uid).order('study_date',{ascending:false});if(queryError)throw queryError;let all=data??[];const today=todayJapan();if(!all.some(s=>s.study_date===today)){const draft=makeSession(uid,today,all);const {error:insertError}=await supabase.from('daily_sessions').upsert(draft,{onConflict:'user_id,study_date',ignoreDuplicates:true});if(insertError)throw insertError;const {data:latest,error:readError}=await supabase.from('daily_sessions').select('*').eq('user_id',uid).order('study_date',{ascending:false});if(readError)throw readError;all=latest??[];}setSessions(all);setSelectedDate(v=>all.some(s=>s.study_date===v)?v:today)}catch(e){setError(e.message||'读取学习记录失败，请检查数据库设置。')}finally{setLoading(false)}},[auth?.user?.id,guest])
 useEffect(()=>{if(auth?.user||guest)load();else setSessions([])},[auth?.user?.id,guest,load])
 // Refresh the daily assignment when a mobile browser stays open past midnight (Japan time).
 useEffect(()=>{if(!auth?.user&&!guest)return;const timer=setInterval(()=>{if(todayJapan()!==selectedDate&&page==='home')load()},60_000);return()=>clearInterval(timer)},[auth?.user?.id,guest,selectedDate,page,load])
 const active=sessions.find(s=>s.study_date===selectedDate)
 const latest=sessions.find(s=>s.study_date===todayJapan())
 const wordMap=useMemo(()=>Object.fromEntries(words.map(w=>[w.id,w])),[])
 const problemMap=useMemo(()=>Object.fromEntries(problems.map(p=>[p.id,p])),[])
 const finished=(s)=>s?.completed_word_ids?.length===10 && s.problem_done
 const completedDays=sessions.filter(finished).length
 const learnedWords=new Set(sessions.flatMap(s=>s.completed_word_ids||[])).size
 const solvedProblems=new Set(sessions.filter(s=>s.problem_done).map(s=>s.problem_id)).size
 async function update(changes){if(!active||selectedDate!==todayJapan()||saving)return;setSaving(true);setError('');const previous=sessions;setSessions(s=>s.map(x=>x.study_date===selectedDate?{...x,...changes}:x));if(guest){try{saveGuestSessions(previous.map(x=>x.study_date===selectedDate?{...x,...changes}:x))}catch(e){setSessions(previous);setError('保存到浏览器失败：'+e.message)}setSaving(false);return}const {error:e}=await supabase.from('daily_sessions').update({...changes,updated_at:new Date().toISOString()}).eq('user_id',auth.user.id).eq('study_date',selectedDate);if(e){setSessions(previous);setError(e.message)}setSaving(false)}
 async function submitAuth(e){
  e.preventDefault();setError('');setNotice('');setAuthBusy(true)
  try{
   const cleanEmail=email.trim()
   if(mode==='register'){
    if(password!==confirmPassword)throw new Error('两次输入的密码不一致。')
    if(password.length<6)throw new Error('密码至少需要 6 个字符。')
    const {data,error:e2}=await supabase.auth.signUp({email:cleanEmail,password,options:{data:{nickname:nickname.trim()},emailRedirectTo:window.location.origin}})
    if(e2)throw e2
    setPassword('');setConfirmPassword('')
    if(data.session){setNotice('注册并登录成功！')}else{setNotice('注册请求已提交。如已开启邮箱验证，请查看邮件中的确认链接。');setMode('login')}
   }else{
    const {error:e2}=await supabase.auth.signInWithPassword({email:cleanEmail,password})
    if(e2)throw e2
    setPassword('')
   }
  }catch(e){setError(e.message||'操作失败')}finally{setAuthBusy(false)}
 }
 async function setAccountPassword(e){
  e.preventDefault();setError('');setNotice('');setAuthBusy(true)
  try{
   if(newPassword.length<6)throw new Error('密码至少需要 6 个字符。')
   const {error:e2}=await supabase.auth.updateUser({password:newPassword})
   if(e2)throw e2
   setNewPassword('');setNotice('密码已设置。以后可以用当前邮箱和新密码登录。')
  }catch(e){setError(e.message||'设置密码失败')}finally{setAuthBusy(false)}
 }
 function enterGuest(){setError('');setNotice('');setGuest(true);setPage('home');setSelectedDate(todayJapan())}
 async function exitApp(){setPage('home');setSelectedDate(todayJapan());if(guest){setGuest(false);setSessions([])}else{await supabase.auth.signOut()}}
 if(!configured)return <div className="shell centered"><Brand/><div className="panel login"><h2>连接 Supabase</h2><p>复制 <code>.env.example</code> 为 <code>.env</code>，填写项目 URL 和 Publishable/anon Key，然后重新启动开发服务器。</p><p>数据库建表 SQL 位于 <code>supabase/schema.sql</code>。</p></div></div>
 if(!auth&&!guest)return <div className="shell centered"><Brand/><div className="panel login"><span className="eyebrow">DAILY LEARNING</span><h1>{mode==='register'?'创建学习账号':'每天一点，长期积累。'}</h1><p>注册用户的学习记录可以跨设备同步。也可以直接以游客身份体验。</p><form onSubmit={submitAuth}>{mode==='register'&&<><label htmlFor="nickname">昵称（选填）</label><input id="nickname" autoComplete="nickname" value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="你的昵称" maxLength={40}/></>}<label htmlFor="email">邮箱</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/><label htmlFor="password">密码</label><input id="password" type="password" autoComplete={mode==='register'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} placeholder="至少 6 个字符"/>{mode==='register'&&<><label htmlFor="confirm-password">确认密码</label><input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required minLength={6}/></>}<button className="primary" disabled={authBusy}>{authBusy?'正在处理…':mode==='register'?'创建账号':'登录'} <ChevronRight size={17}/></button></form><button className="text-button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('');setNotice('');setPassword('');setConfirmPassword('')}}>{mode==='login'?'没有账号？新規登録':'已有账号？ログイン'}</button><div className="auth-divider">OR</div><button className="guest-button" onClick={enterGuest}>ゲストとして利用（游客体验）</button><p className="auth-note">游客记录只保存在当前浏览器，清除网站数据或换设备可能丢失。</p>{notice&&<p className="success">{notice}</p>}{error&&<p className="error">{error}</p>}</div></div>
 const session=active;const todaysWords=session?.word_ids?.map(id=>wordMap[id]).filter(Boolean)??[];const problem=session?problemMap[session.problem_id]:null;const isToday=selectedDate===todayJapan();const todayW=latest?.completed_word_ids?.length??0;const todayP=latest?.problem_done?1:0
 return <div className="shell"><header className="topbar"><Brand/><div className="header-actions">{guest?<span className="guest-badge">GUEST · 本机保存</span>:<button className="settings-button" onClick={()=>{setError('');setNotice('');setPage('account')}}>账号设置</button>}<button className="logout" title={guest?'退出游客模式':'退出登录'} onClick={exitApp}><LogOut size={18}/></button></div></header><main><div className="intro"><span className="eyebrow">YOUR DAILY ROUTINE</span><h1>{page==='home'?'学习一点，进步一点。':page==='japanese'?'Japanese · 今日の10語':page==='programming'?'Python · 今日の1問':page==='account'?'账号设置':'学习历史'}</h1><p>{page==='home'?`${prettyDate(todayJapan())} · 今天也一起坚持吧。`:page==='history'?'回顾曾经学过的内容与完成情况。':`${prettyDate(selectedDate)} · ${isToday?'今天的学习任务':'历史学习内容（只读）'}`}</p></div>
 {error&&<div className="error banner">{error} <button onClick={load}>重试</button></div>}
 {loading?<div className="panel loading"><RefreshCw className="spin"/> 正在同步学习记录…</div>:<>
 {page==='home'&&<><div className="hero-stat"><div><div className="stat-label">TODAY'S PROGRESS</div><h2>{todayW===10&&todayP===1?'今日任务已完成 🎉':'今天，继续积累。'}</h2><p>{todayW}/10 个单词 · {todayP}/1 道 Python 题</p></div><div className="big-progress">{Math.round((todayW+todayP)/11*100)}<small>%</small></div></div><div className="module-grid"><button className="module" onClick={()=>{setSelectedDate(todayJapan());setPage('japanese')}}><div className="module-icon pink"><BookOpen size={24}/></div><div className="module-title"><div><small>LANGUAGE</small><h3>日本語 · 10 Words</h3></div><ChevronRight/></div><p>每天10个词，学习用法、近义词和语感。</p><div className="progress-text"><span>今日进度</span><b>{todayW} / 10</b></div><Bar value={todayW} max={10}/></button><button className="module" onClick={()=>{setSelectedDate(todayJapan());setPage('programming')}}><div className="module-icon lavender"><Code2 size={24}/></div><div className="module-title"><div><small>CODING</small><h3>Python · 1 Problem</h3></div><ChevronRight/></div><p>每天一道小题，从输入输出开始。</p><div className="progress-text"><span>今日进度</span><b>{todayP} / 1</b></div><Bar value={todayP} max={1}/></button></div><div className="stats-grid"><div><b>{completedDays}</b><span>全部完成天数</span></div><div><b>{learnedWords}</b><span>累计已学单词</span></div><div><b>{solvedProblems}</b><span>累计完成题目</span></div></div><button className="history-link" onClick={()=>setPage('history')}><span><History size={19}/> 查看学习历史</span><ChevronRight size={18}/></button></>}
 {(page==='japanese'||page==='programming')&&<><button className="back" onClick={()=>{setPage('home');setSelectedDate(todayJapan())}}><ArrowLeft size={17}/> 返回首页</button>{!session?<div className="panel">这一天暂无学习记录。</div>:page==='japanese'?<><div className="section-heading"><h2>今日の10語</h2><span>{session.completed_word_ids.length} / 10 已学</span></div><Bar value={session.completed_word_ids.length} max={10}/><div className="words-grid">{todaysWords.map((word,index)=><div key={word.id}><div className="card-counter">WORD {String(index+1).padStart(2,'0')}</div><WordCard word={word} done={session.completed_word_ids.includes(word.id)} disabled={saving||!isToday} onDone={()=>update({completed_word_ids:session.completed_word_ids.includes(word.id)?session.completed_word_ids.filter(id=>id!==word.id):[...session.completed_word_ids,word.id]})}/></div>)}</div></>:<><div className="section-heading"><h2>今日の1問</h2><span>{session.problem_done?'1 / 1 已完成':'0 / 1 已完成'}</span></div>{problem?<ProblemCard problem={problem} done={session.problem_done} disabled={saving||!isToday} onDone={()=>update({problem_done:!session.problem_done})}/>:<div className="panel">找不到题目，请检查题库是否被修改。</div>}</>}</>}
 {page==='account'&&!guest&&<><button className="back" onClick={()=>setPage('home')}><ArrowLeft size={17}/> 返回首页</button><div className="panel account-panel"><h2>为当前账号设置密码</h2><p>如果你之前通过 Magic Link 登录，可以在这里为同一个账号设置密码，原来的学习记录会保留。</p><p>当前邮箱：<strong>{auth?.user?.email}</strong></p><form onSubmit={setAccountPassword}><label htmlFor="new-password">新密码</label><input id="new-password" type="password" autoComplete="new-password" minLength={6} required placeholder="至少 6 个字符" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/><button className="primary" disabled={authBusy}>{authBusy?'正在保存…':'设置密码'}</button></form>{notice&&<p className="success">{notice}</p>}</div></>}
 {page==='history'&&<><button className="back" onClick={()=>{setPage('home');setSelectedDate(todayJapan())}}><ArrowLeft size={17}/> 返回首页</button><div className="history-list">{sessions.map(s=><div className="history-row" key={s.study_date}><div><strong>{prettyDate(s.study_date)}</strong><small>{s.completed_word_ids.length}/10 单词 · {s.problem_done?'1':'0'}/1 Python {finished(s)?'· 已全部完成':''}</small></div><div className="history-actions"><button onClick={()=>{setSelectedDate(s.study_date);setPage('japanese')}}>单词</button><button onClick={()=>{setSelectedDate(s.study_date);setPage('programming')}}>题目</button></div></div>)}</div></>}
 </>}</main><footer>Daily Learning · Made for everyday progress · 日本時間で日付を管理</footer></div>
}

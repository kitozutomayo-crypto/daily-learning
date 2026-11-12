import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, Check, ChevronRight, Code2, History, LogOut, RefreshCw, Sparkles } from 'lucide-react'
import { words } from './data/words'
import { problems } from './data/problems'
import { configured, supabase } from './supabase'
import Brand from './components/Brand'
import Mascot from './components/Mascot'
import Login from './pages/Login'

const todayJapan = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
const prettyDate = (day) => new Intl.DateTimeFormat('ja-JP',{timeZone:'UTC',month:'long',day:'numeric',weekday:'long'}).format(new Date(`${day}T12:00:00Z`))
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
function Bar({value,max}){return <div className="bar"><span style={{width:`${Math.min(100,(value/max)*100)}%`}}/></div>}
function WordCard({word,done,onDone,disabled}){return <article className={`word-card ${done?'completed':''}`}><div className="word-head"><span className="tag">{word.category}</span><button className={`check-button ${done?'active':''}`} onClick={onDone} disabled={disabled}>{done?<><Check size={15}/> 学習済み</>:'学習済みにする'}</button></div><h3>{word.word}<span>{word.reading}</span></h3><p className="meaning">{word.meaning}</p><div className="word-details"><div><b>よく使う表現</b><p>{word.phrases.join(' · ')}</p></div><div><b>類義語・使い分け</b><p>{word.synonyms}</p></div><div><b>例文</b><p className="jp-example">{word.example}</p></div><div><b>ニュアンス</b><p>{word.note}</p></div></div></article>}
function ProblemCard({problem,done,onDone,disabled}){const [hint,setHint]=useState(false);const [solution,setSolution]=useState(false);useEffect(()=>{setHint(false);setSolution(false)},[problem.id]);return <article className="problem-card"><div className="problem-head"><span className="tag blue">{problem.category}</span><span className="tag">{problem.level}</span></div><h2>{problem.title}</h2><p>{problem.description}</p><div className="sample-grid"><div><b>入力例</b><pre>{problem.input}</pre></div><div><b>出力例</b><pre>{problem.output}</pre></div></div><p className="concept">学習ポイント：{problem.concept}</p><div className="problem-actions"><button className="subtle-btn" onClick={()=>setHint(!hint)}>{hint?'ヒントを閉じる':'ヒントを見る'}</button><button className="subtle-btn" onClick={()=>setSolution(!solution)}>{solution?'解答を閉じる':'解答例を見る'}</button>{problem.source && <a className="subtle-btn" href={problem.source} target="_blank" rel="noreferrer">AtCoder 原题 ↗</a>}</div>{hint && <div className="hint">💡 {problem.hint}</div>}{solution && <pre className="solution">{problem.solution}</pre>}<button className={`finish-btn ${done?'done':''}`} onClick={onDone} disabled={disabled}>{done?<><Check size={19}/> 完了</>:'この問題を完了する'}</button></article>}

export default function App(){
 const [auth,setAuth]=useState(null),[guest,setGuest]=useState(false),[mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[nickname,setNickname]=useState(''),[newPassword,setNewPassword]=useState(''),[sent,setSent]=useState(false),[authBusy,setAuthBusy]=useState(false),[notice,setNotice]=useState(''),[page,setPage]=useState('home'),[sessions,setSessions]=useState([]),[selectedDate,setSelectedDate]=useState(todayJapan()),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState('')
 useEffect(()=>{if(!configured){setLoading(false);return}supabase.auth.getSession().then(({data,error})=>{if(error)setError(error.message);setAuth(data.session);setLoading(false)});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setAuth(session));return ()=>subscription.unsubscribe()},[])
 const load = useCallback(async()=>{if(!auth?.user&&!guest)return;setLoading(true);setError('');try{if(guest){let rows=readGuestSessions();const today=todayJapan();if(!rows.some(s=>s.study_date===today)){rows=[makeSession('guest',today,rows),...rows];saveGuestSessions(rows)}rows.sort((a,b)=>b.study_date.localeCompare(a.study_date));setSessions(rows);setSelectedDate(v=>rows.some(s=>s.study_date===v)?v:today);return}const uid=auth.user.id;const {data,error:queryError}=await supabase.from('daily_sessions').select('*').eq('user_id',uid).order('study_date',{ascending:false});if(queryError)throw queryError;let all=data??[];const today=todayJapan();if(!all.some(s=>s.study_date===today)){const draft=makeSession(uid,today,all);const {error:insertError}=await supabase.from('daily_sessions').upsert(draft,{onConflict:'user_id,study_date',ignoreDuplicates:true});if(insertError)throw insertError;const {data:latest,error:readError}=await supabase.from('daily_sessions').select('*').eq('user_id',uid).order('study_date',{ascending:false});if(readError)throw readError;all=latest??[];}setSessions(all);setSelectedDate(v=>all.some(s=>s.study_date===v)?v:today)}catch(e){setError(e.message||'学習履歴を読み込めませんでした。データベース設定をご確認ください。')}finally{setLoading(false)}},[auth?.user?.id,guest])
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
 async function update(changes){if(!active||selectedDate!==todayJapan()||saving)return;setSaving(true);setError('');const previous=sessions;setSessions(s=>s.map(x=>x.study_date===selectedDate?{...x,...changes}:x));if(guest){try{saveGuestSessions(previous.map(x=>x.study_date===selectedDate?{...x,...changes}:x))}catch(e){setSessions(previous);setError('ブラウザへの保存に失敗しました：'+e.message)}setSaving(false);return}const {error:e}=await supabase.from('daily_sessions').update({...changes,updated_at:new Date().toISOString()}).eq('user_id',auth.user.id).eq('study_date',selectedDate);if(e){setSessions(previous);setError(e.message)}setSaving(false)}
 async function submitAuth(e){
  e.preventDefault();setError('');setNotice('');setAuthBusy(true)
  try{
   const cleanEmail=email.trim()
   if(mode==='register'){
    if(password!==confirmPassword)throw new Error('パスワードが一致しません。')
    if(password.length<6)throw new Error('パスワードは6文字以上で入力してください。')
    const {data,error:e2}=await supabase.auth.signUp({email:cleanEmail,password,options:{data:{nickname:nickname.trim()},emailRedirectTo:window.location.origin}})
    if(e2)throw e2
    setPassword('');setConfirmPassword('')
    if(data.session){setNotice('登録・ログインが完了しました。')}else{setNotice('登録を受け付けました。メール認証が有効な場合は確認メールをご覧ください。');setMode('login')}
   }else{
    const {error:e2}=await supabase.auth.signInWithPassword({email:cleanEmail,password})
    if(e2)throw e2
    setPassword('')
   }
  }catch(e){setError(e.message||'操作に失敗しました。')}finally{setAuthBusy(false)}
 }
 async function setAccountPassword(e){
  e.preventDefault();setError('');setNotice('');setAuthBusy(true)
  try{
   if(newPassword.length<6)throw new Error('パスワードは6文字以上で入力してください。')
   const {error:e2}=await supabase.auth.updateUser({password:newPassword})
   if(e2)throw e2
   setNewPassword('');setNotice('パスワードを設定しました。次回からメールアドレスとパスワードでログインできます。')
  }catch(e){setError(e.message||'パスワードの設定に失敗しました。')}finally{setAuthBusy(false)}
 }
 function enterGuest(){setError('');setNotice('');setGuest(true);setPage('home');setSelectedDate(todayJapan())}
 async function exitApp(){setPage('home');setSelectedDate(todayJapan());if(guest){setGuest(false);setSessions([])}else{await supabase.auth.signOut()}}
 if(!configured)return <div className="shell centered"><Brand/><div className="panel login"><h2>Supabase に接続</h2><p>コピーした <code>.env.example</code> を <code>.env</code>，プロジェクト URL と Publishable / anon Key を入力し、開発サーバーを再起動してください。</p><p>テーブル作成用 SQL：<code>supabase/schema.sql</code>。</p></div></div>
  if (!auth && !guest) return (
    <Login
      mode={mode} email={email} setEmail={setEmail}
      password={password} setPassword={setPassword}
      confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
      nickname={nickname} setNickname={setNickname}
      authBusy={authBusy} submitAuth={submitAuth}
      setMode={setMode} setError={setError} setNotice={setNotice}
      enterGuest={enterGuest} notice={notice} error={error}
    />
  )
 const session=active;const todaysWords=session?.word_ids?.map(id=>wordMap[id]).filter(Boolean)??[];const problem=session?problemMap[session.problem_id]:null;const isToday=selectedDate===todayJapan();const todayW=latest?.completed_word_ids?.length??0;const todayP=latest?.problem_done?1:0
 return <div className="shell"><header className="topbar"><Brand/><div className="header-actions">{guest?<span className="guest-badge">GUEST · この端末に保存</span>:<button className="settings-button" onClick={()=>{setError('');setNotice('');setPage('account')}}>アカウント設定</button>}<button className="logout" title={guest?'ゲストモードを終了':'ログアウト'} onClick={exitApp}><LogOut size={18}/></button></div></header><main><div className="intro"><span className="eyebrow">DAILY LEARNING</span><h1>{page==='home'?'今日も、少しずつ。':page==='japanese'?'Japanese · 今日の10語':page==='programming'?'Python · 今日の1問':page==='account'?'アカウント設定':'学習履歴'}</h1><p>{page==='home'?`${prettyDate(todayJapan())} · 今日もいっしょに頑張ろう！`:page==='history'?'これまでの学習を振り返りましょう。':`${prettyDate(selectedDate)} · ${isToday?'今日の学習':'過去の学習（閲覧のみ）'}`}</p>{page!=='home'&&<div className="intro-mascot"><Mascot compact message={page==='japanese'?'今日も10語、がんばろう！':page==='programming'?'Pythonにチャレンジ！':page==='history'?'続けていてえらいね！':'おかえり！'} /></div>}</div>
 {error&&<div className="error banner">{error} <button onClick={load}>再試行</button></div>}
 {loading?<div className="panel loading"><RefreshCw className="spin"/> 学習記録を同期しています…</div>:<>
 {page==='home'&&<><div className="hero-stat"><div className="hero-copy"><div className="stat-label">TODAY’S MISSION</div><h2>{todayW===10&&todayP===1?'今日のミッション達成！ 🎉':'今日も一歩ずつ！'}</h2><p>{todayW}/10 語 · {todayP}/1 問（Python）</p></div><div className="big-progress">{Math.round((todayW+todayP)/11*100)}<small>%</small></div><Mascot message={todayW===10&&todayP===1 ? "やったね！おつかれさま！" : "今日もいっしょに頑張ろう！"} /></div><div className="module-grid"><button className="module" onClick={()=>{setSelectedDate(todayJapan());setPage('japanese')}}><div className="module-icon pink"><BookOpen size={24}/></div><div className="module-title"><div><small>VOCABULARY</small><h3>日本語・単語学習</h3></div><ChevronRight/></div><p>毎日10語。意味や使い方、ニュアンスを学ぼう。</p><div className="progress-text"><span>今日の進捗</span><b>{todayW} / 10</b></div><Bar value={todayW} max={10}/></button><button className="module" onClick={()=>{setSelectedDate(todayJapan());setPage('programming')}}><div className="module-icon lavender"><Code2 size={24}/></div><div className="module-title"><div><small>PYTHON</small><h3>Python・問題演習</h3></div><ChevronRight/></div><p>毎日1問。基礎から少しずつ挑戦しよう。</p><div className="progress-text"><span>今日の進捗</span><b>{todayP} / 1</b></div><Bar value={todayP} max={1}/></button></div><div className="stats-grid"><div><b>{completedDays}</b><span>目標達成日数</span></div><div><b>{learnedWords}</b><span>累計学習語数</span></div><div><b>{solvedProblems}</b><span>累計解答問題数</span></div></div><button className="history-link" onClick={()=>setPage('history')}><span><History size={19}/> 学習履歴を見る</span><ChevronRight size={18}/></button></>}
 {(page==='japanese'||page==='programming')&&<><button className="back" onClick={()=>{setPage('home');setSelectedDate(todayJapan())}}><ArrowLeft size={17}/> ホームに戻る</button>{!session?<div className="panel">この日の学習記録はありません。</div>:page==='japanese'?<><div className="section-heading"><h2>今日の10語</h2><span>{session.completed_word_ids.length} / 10 語完了</span></div><Bar value={session.completed_word_ids.length} max={10}/><div className="words-grid">{todaysWords.map((word,index)=><div key={word.id}><div className="card-counter">WORD {String(index+1).padStart(2,'0')}</div><WordCard word={word} done={session.completed_word_ids.includes(word.id)} disabled={saving||!isToday} onDone={()=>update({completed_word_ids:session.completed_word_ids.includes(word.id)?session.completed_word_ids.filter(id=>id!==word.id):[...session.completed_word_ids,word.id]})}/></div>)}</div></>:<><div className="section-heading"><h2>今日の1問</h2><span>{session.problem_done?'1 / 1 完了':'0 / 1 完了'}</span></div>{problem?<ProblemCard problem={problem} done={session.problem_done} disabled={saving||!isToday} onDone={()=>update({problem_done:!session.problem_done})}/>:<div className="panel">問題が見つかりません。問題データをご確認ください。</div>}</>}</>}
 {page==='account'&&!guest&&<><button className="back" onClick={()=>setPage('home')}><ArrowLeft size={17}/> ホームに戻る</button><div className="panel account-panel"><h2>パスワードを設定</h2><p>Magic Link で登録した場合も、ここでパスワードを設定できます。学習記録はそのまま残ります。</p><p>現在のメールアドレス：<strong>{auth?.user?.email}</strong></p><form onSubmit={setAccountPassword}><label htmlFor="new-password">新しいパスワード</label><input id="new-password" type="password" autoComplete="new-password" minLength={6} required placeholder="6文字以上" value={newPassword} onChange={e=>setNewPassword(e.target.value)}/><button className="primary" disabled={authBusy}>{authBusy?'保存中…':'パスワードを設定'}</button></form>{notice&&<p className="success">{notice}</p>}</div></>}
 {page==='history'&&<><button className="back" onClick={()=>{setPage('home');setSelectedDate(todayJapan())}}><ArrowLeft size={17}/> ホームに戻る</button><div className="history-list">{sessions.map(s=><div className="history-row" key={s.study_date}><div><strong>{prettyDate(s.study_date)}</strong><small>{s.completed_word_ids.length}/10 語 · {s.problem_done?'1':'0'}/1 Python {finished(s)?'· すべて完了':''}</small></div><div className="history-actions"><button onClick={()=>{setSelectedDate(s.study_date);setPage('japanese')}}>単語</button><button onClick={()=>{setSelectedDate(s.study_date);setPage('programming')}}>問題</button></div></div>)}</div></>}
 </>}</main><footer>Daily Learning · Made for everyday progress · 日本時間で日付を管理</footer></div>
}

import { ChevronRight } from 'lucide-react'
import Brand from '../components/Brand'
import Mascot from '../components/Mascot'

// Login only handles presentation. Auth operations and state remain in App.jsx.
export default function Login({
  mode, email, setEmail, password, setPassword,
  confirmPassword, setConfirmPassword, nickname, setNickname,
  authBusy, submitAuth, setMode, setError, setNotice,
  enterGuest, notice, error,
}) {
  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setNotice('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="shell auth-shell">
      <div className="auth-brand"><Brand /></div>
      <main className="auth-stage">
        <div className="auth-decor auth-decor-left" aria-hidden="true">
          <Mascot src="/mascots/pink-loop.png" showBubble={false} />
        </div>
        <div className="auth-decor auth-decor-right" aria-hidden="true">
          <Mascot src="/mascots/pink-dash.png" showBubble={false} />
        </div>
        <div className="auth-decor auth-decor-third" aria-hidden="true">
          <Mascot src="/mascots/pink-flat.png" showBubble={false} />
        </div>
        <div className="panel login auth-card">
          <span className="eyebrow">DAILY LEARNING</span>
          <h1>{mode === 'register' ? 'アカウントを作成' : '今日も、少しずつ。'}</h1>
          <p>登録すると学習記録を端末間で同期できます。ゲストとしてのお試しも可能です。</p>
          <form onSubmit={submitAuth}>
            {mode === 'register' && <>
              <label htmlFor="nickname">ニックネーム（任意）</label>
              <input id="nickname" autoComplete="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="ニックネーム" maxLength={40} />
            </>}
            <label htmlFor="email">メールアドレス</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <label htmlFor="password">パスワード</label>
            <input id="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="6文字以上" />
            {mode === 'register' && <>
              <label htmlFor="confirm-password">パスワード（確認）</label>
              <input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
            </>}
            <button className="primary" type="submit" disabled={authBusy}>
              {authBusy ? '処理中…' : mode === 'register' ? '新規登録' : 'ログイン'} <ChevronRight size={17} />
            </button>
          </form>
          <button className="text-button" type="button" onClick={switchMode}>
            {mode === 'login' ? 'アカウントをお持ちでない方はこちら' : 'ログインに戻る'}
          </button>
          <div className="auth-divider">OR</div>
          <button className="guest-button" type="button" onClick={enterGuest}>ゲストとして試す</button>
          <p className="auth-note">ゲストの学習記録はこのブラウザにのみ保存されます。</p>
          {notice && <p className="success" role="status">{notice}</p>}
          {error && <p className="error" role="alert">{error}</p>}
        </div>
      </main>
    </div>
  )
}

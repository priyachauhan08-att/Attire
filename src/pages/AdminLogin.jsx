import { useState, useEffect } from 'react'
import StatusFeed from './StatusFeed.jsx'
import './AdminLogin.css'
import { useNavigate } from 'react-router-dom';

const DEMO_USER = 'admin'
const DEMO_PASS = 'admin123'

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState('idle') // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password) {
      setStatus('error')
      setErrorMsg('Enter your username and password to continue.')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    window.setTimeout(() => {
      if (username === DEMO_USER && password === DEMO_PASS) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg("Couldn't sign you in — check your username and password.")
      }
    }, 900)
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (status !== 'success') return;

    const timer = setTimeout(() => {
      navigate('/adminDash');
    }, 1000);

    return () => clearTimeout(timer); // cleanup if component unmounts early
  }, [status, navigate]);


  return (
    <div className="login-shell">
      <aside className="login-brand">
        <div className="brand-noise" />
        <div className="brand-top">
          <div className="brand-mark">
            <span className="brand-glyph">◆</span>
            <span>CTRL PANEL</span>
          </div>
          <span className="brand-env">ENV: PRODUCTION</span>
        </div>

        <div className="brand-body">
          <h1>Systems nominal.</h1>
          <p>
            Sign in to manage users, deployments, and platform configuration.
            Every check below runs in real time, the same as it does once
            you're inside.
          </p>
        </div>

        <div className="brand-feed">
          <div className="feed-label">
            <span>LIVE DIAGNOSTICS</span>
            <span className="feed-dot" />
          </div>
          <StatusFeed />
        </div>
      </aside>

      <main className="login-main">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card-header">
            <h2>Admin sign in</h2>
            <p>Use your workspace credentials to continue.</p>
          </div>

          {status === 'success' ? (
            <div className="login-success" role="status">
              <span className="success-glyph">✓</span>
              <div>
                <strong>Signed in.</strong>
                <p>Redirecting you to the dashboard…</p>
              </div>
            </div>
          ) : (
            <>
              <label className="field" htmlFor="username">
                <span className="field-label">Username or email</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="User name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={status === 'loading'}
                  autoFocus={true}
                />
              </label>

              <label className="field" htmlFor="password">
                <span className="field-label">Password</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === 'loading'}
                  style={{ color: status === 'error' ? '#E03F4F' : '#81912F' }}
                />
              </label>

              {status === 'error' && (
                <div className="field-error" role="alert">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="submit-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? <>Signing in <div class="loader" style={{ justifyContent: "center", marginInline: "auto", marginTop: "1rem" }}></div></> : 'Sign in'}
              </button>
            </>
          )}
        </form>

        <footer className="login-footer">
          <span>© {new Date().getFullYear()} Control Panel</span>
          <span className="footer-divider">·</span>
          <a href="#status">System status</a>
          <span className="footer-divider">·</span>
          <a href="#help">Help</a>
        </footer>
      </main>
    </div>
  )
}

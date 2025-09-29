// =============================
// LoginPage.jsx (React)
// =============================
import React, { useState } from 'react';
import { useUsersApi } from '../../api/UserApi'; // ajustează după structura ta
import './LoginPage.css';

export default function LoginPage({ onSuccess }) {
  const { post } = useUsersApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetInfo, setResetInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetInfo('');

    if (!email || !password) {
      setError('Completează email și parolă.');
      return;
    }

    try {
      setLoading(true);
      const data = await post('/auth/login', { email, password });
      onSuccess?.(data);
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Autentificare eșuată';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError('');
    setResetInfo('');
    if (!email) {
      setError('Introdu emailul apoi apasă „Ai uitat parola?".');
      return;
    }
    try {
      setLoading(true);
      await post('/auth/forgot-password', { email });
      setResetInfo('Ți-am trimis (dacă există cont) un link de resetare. Verifică emailul.');
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Nu am putut trimite linkul de resetare.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginWrapper">
      <div className="formShell">
        <div className="formWrap">
          <form className="card" onSubmit={handleSubmit}>
            {error ? <div role="alert" className="error">{error}</div> : null}
            {resetInfo ? <div className="info">{resetInfo}</div> : null}

            <div className="fields">
              <div className="field">
                <label htmlFor="email">Email</label>
                <div className="controlRow">
                  <input
                    id="email"
                    className="input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="ex: ion.ionel@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Parolă</label>
                <div className="controlRow">
                  <input
                    id="password"
                    className="input"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="toggle"
                    aria-label={showPassword ? 'Ascunde parola' : 'Arată parola'}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5c2.762 0 5 2.239 5 5s-2.238 5-5 5zm0-8c-1.656 0-3 1.345-3 3s1.344 3 3 3c1.657 0 3-1.345 3-3s-1.343-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7c1.52 0 2.882-.248 4.094-.668l-1.61-1.61c-.784.178-1.615.278-2.484.278-2.761 0-5-2.239-5-5 0-.869.1-1.7.278-2.484l-2.417-2.417c-2.432 1.29-3.861 3.235-4.861 4.484 1.368 1.749 4.735 6.417 11.39 6.417.981 0 1.903-.131 2.765-.357l1.655 1.655c-1.368.448-2.866.702-4.42.702-7.633 0-11-7-11-7s3.367-7 11-7c1.878 0 3.577.373 5.08 1.008l-1.55 1.55c-1.03-.362-2.148-.558-3.53-.558z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Se autentifică…' : 'Intră în cont'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
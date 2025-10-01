// =============================
// LoginPage.jsx (React)
// =============================
import React, { useState } from 'react';
import { useUsersApi } from '../../api/UserApi'; // ajustează după structura ta
import './LoginPage.css';

export default function LoginPage({ onSuccess }) {
  const { post } = useUsersApi();

  const [step, setStep] = useState("login"); // "login" sau "otp"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      if (step === "login") {
        // pasul 1: trimite email + parola
        const data = await post('/api/auth/login', { email, password });
        console.log("Login response:", data);
        setStep("otp"); // trece la pasul OTP
      } else if (step === "otp") {
        // pasul 2: verifică OTP
        const data = await post('/api/auth/verify-otp', { email, otp });
        console.log("OTP response:", data);
        onSuccess?.(data); // aici primești JWT token
      }

    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Eroare la autentificare';
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

            {step === "login" && (
              <>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: ion.ionel@gmail.com"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Parolă</label>
                  <div className="controlRow">
                    <input
                      id="password"
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="toggle"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? "Ascunde" : "Arată"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === "otp" && (
              <>
                <p className="info">
                  Ți-am trimis un cod OTP pe emailul <b>{email}</b>.
                </p>
                <div className="field">
                  <label htmlFor="otp">Cod OTP</label>
                  <input
                    id="otp"
                    className="input"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Introdu codul primit pe email"
                    required
                  />
                </div>
              </>
            )}

            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Se procesează…' : step === "login" ? 'Intră în cont' : 'Verifică OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

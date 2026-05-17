import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider'; // Adjust path if necessary

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Send authentication request to backend
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // 2. Pass data to AuthProvider and immediately route away
        login(data.user, data.token);
        navigate('/dashboard', { replace: true });
      } else {
        setError(data.message || 'Invalid login credentials');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div style={{ backgroundColor: '#05140b', minHeight: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#0b2214', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '450px', border: '1px solid #143520' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Login to Football Hub</h1>
        <p style={{ color: '#88a090', marginBottom: '2rem' }}>Sign in with a social provider or continue with your email address.</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button type="button" style={{ flex: 1, padding: '0.75rem', background: '#143520', border: '1px solid #205032', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Continue with Google</button>
          <button type="button" style={{ flex: 1, padding: '0.75rem', background: '#143520', border: '1px solid #205032', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>Continue with GitHub</button>
        </div>

        {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required
              style={{ width: '100%', padding: '0.75rem', background: '#05140b', border: '1px solid #143520', borderRadius: '6px', color: '#fff' }} 
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              style={{ width: '100%', padding: '0.75rem', background: '#05140b', border: '1px solid #143520', borderRadius: '6px', color: '#fff' }} 
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '1rem', background: '#10b981', border: 'none', borderRadius: '6px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Continue with email
          </button>
        </form>
      </div>
    </div>
  );
}
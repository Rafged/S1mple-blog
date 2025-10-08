import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if(!email || !password) return 'Email and password are required';
    // simple email check
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email';
    if(password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  const submit = async (e) => {
    e && e.preventDefault();
    setError(null);
    const v = validate();
    if(v){ setError(v); return; }
    setLoading(true);
    try{
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user: { email, password }})
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({errors:{server:['unknown']}}));
        throw new Error(err?.errors ? JSON.stringify(err.errors) : 'Login failed');
      }
      const data = await res.json();
      if(data.user){
        localStorage.setItem('token', data.user.token || '');
        localStorage.setItem('username', data.user.username || 'unknown');
      }
      navigate('/');
    }catch(err){
      setError(err.message);
    }finally{ setLoading(false); }
  }

  return (
    <div style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Sign In</h2>
      {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button type="submit" disabled={loading}>Sign in</button>
          {loading && <Loader />}
        </div>
      </form>
    </div>
  )
}

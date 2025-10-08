import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

export default function SignUp(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if(!username.trim()) { setError('Username required'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Invalid email'); return; }
    if(password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try{
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user: { username, email, password }})
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({errors:{server:['unknown']}}));
        throw new Error(err?.errors ? JSON.stringify(err.errors) : 'Sign up failed');
      }
      const data = await res.json();
      if(data.user){
        localStorage.setItem('token', data.user.token || '');
        localStorage.setItem('username', data.user.username || username || 'unknown');
      }
      navigate('/');
    }catch(err){
      setError(err.message);
    }finally{ setLoading(false); }
  }

  return (
    <div style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Sign Up</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit}>
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} /></label><br/>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button type="submit" disabled={loading}>Sign up</button>
          {loading && <Loader />}
        </div>
      </form>
    </div>
  )
}

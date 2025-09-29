import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    // simple validations
    if(!username || !email || !password){ setError('Please fill all fields'); return; }
    if(password.length < 6){ setError('Password must be at least 6 characters'); return; }
    try{
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({user:{username, email, password}})
      });
      const data = await res.json();
      if(!res.ok){ setError(data?.errors ? JSON.stringify(data.errors) : 'Sign up failed'); return; }
      if(data?.user?.token) localStorage.setItem('token', data.user.token);
      if(data?.user?.username) localStorage.setItem('username', data.user.username);
      navigate('/');
    }catch(e){
      setError(e.message || 'Network error');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit}>
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} /></label><br/>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}

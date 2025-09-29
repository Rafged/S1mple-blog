import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if(!email || !password){ setError('Please fill all fields'); return; }
    try{
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({user:{email, password}})
      });
      const data = await res.json();
      if(!res.ok){ setError(data?.errors ? JSON.stringify(data.errors) : 'Login failed'); return; }
      // Save token and username for simple auth
      if(data?.user?.token) localStorage.setItem('token', data.user.token);
      if(data?.user?.username) localStorage.setItem('username', data.user.username);
      navigate('/');
    }catch(e){
      setError(e.message || 'Network error');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}

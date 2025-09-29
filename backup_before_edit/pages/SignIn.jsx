import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if(!email || !password){ alert('Please fill all fields'); return;}
    // example POST, adjust to your API
    const res = await fetch('/api/users/login', {method:'POST', body: JSON.stringify({user:{email, password}}), headers:{'Content-Type':'application/json'}});
    if(res.ok) navigate('/');
    else alert('Sign in failed');
  };

  return (
    <form onSubmit={submit}>
      <h2>Sign In</h2>
      <label>Email<input required value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
      <label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
      <button type="submit">Sign In</button>
    </form>
  )
}
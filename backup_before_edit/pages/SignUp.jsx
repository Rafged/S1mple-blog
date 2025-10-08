import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp(){
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if(!username || !email || !password){ alert('Please fill all fields'); return;}
    const res = await fetch('/api/users', {method:'POST', body: JSON.stringify({user:{username,email,password}}), headers:{'Content-Type':'application/json'}});
    if(res.ok) navigate('/');
    else alert('Sign up failed');
  };

  return (
    <form onSubmit={submit}>
      <h2>Sign Up</h2>
      <label>Username<input required value={username} onChange={e=>setUsername(e.target.value)} /></label><br/>
      <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label><br/>
      <label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} /></label><br/>
      <button type="submit">Sign Up</button>
    </form>
  )
}
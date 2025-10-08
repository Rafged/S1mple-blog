import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Profile(){
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let canceled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/profiles/${username}`)
      .then(async r => {
        if(!r.ok) throw new Error('Failed to load profile');
        const data = await r.json();
        if(!canceled) setProfile(data.profile);
      })
      .catch(e => { if(!canceled) setError(e.message || 'Unknown error'); })
      .finally(()=> { if(!canceled) setLoading(false); });
    return ()=>{ canceled = true; }
  },[username]);

  if(loading) return <div>Loading profile...</div>;
  if(error) return <div style={{color:'red'}}>Error: {error}</div>;
  if(!profile) return <div>No profile</div>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.bio}</p>
      <Link to={`/articles?author=${profile.username}`}>View articles</Link>
    </div>
  )
}

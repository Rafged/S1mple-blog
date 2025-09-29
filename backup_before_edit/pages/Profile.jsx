import React, {useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Profile(){
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    setLoading(true);
    fetch(`/api/profiles/${username}`)
      .then(r=>{
        if(!r.ok) throw new Error('Failed to load profile');
        return r.json();
      })
      .then(data=> setProfile(data.profile || data))
      .catch(e=> setError(e.message))
      .finally(()=> setLoading(false));
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
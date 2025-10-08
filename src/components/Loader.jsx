import React from 'react';

export default function Loader({size=32}){
  const s = size;
  return (
    <div style={{width:s, height:s, borderRadius:s, border:'4px solid #ccc', borderTopColor:'#333', animation:'spin 1s linear infinite'}} />
  )
}

/* add keyframes via global style in project; fallback will still show */

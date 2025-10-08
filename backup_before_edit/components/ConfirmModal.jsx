import React from 'react';

export default function ConfirmModal({open, title, children, onConfirm, onCancel}){
  if(!open) return null;
  return (
    <div style={{
      position:'fixed', left:0, top:0, right:0, bottom:0, display:'flex',
      alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.4)'
    }}>
      <div style={{background:'#fff', padding:20, borderRadius:8, maxWidth:500}}>
        <h3>{title}</h3>
        <div>{children}</div>
        <div style={{marginTop:10}}>
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel} style={{marginLeft:8}}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
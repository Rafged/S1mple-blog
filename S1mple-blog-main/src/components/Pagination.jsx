import React from 'react'
export default function Pagination({current=0, onChange, total=7}){
  const pages = Array.from({length: total}, (_,i)=>i)
  return (
    <div className="pager">
      {pages.map(p=>(
        <button key={p} onClick={()=>onChange(p)} style={{fontWeight: p===current?700:400}}>{p+1}</button>
      ))}
    </div>
  )
}

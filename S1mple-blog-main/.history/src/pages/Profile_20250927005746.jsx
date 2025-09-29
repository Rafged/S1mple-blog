import React, { useEffect, useState } from 'react'
import { getArticlesByAuthor } from '../api'
import { Card, Button } from 'antd'
import { Link } from 'react-router-dom'

export default function Profile(){
  return (
    <div>
      <div className="profile-hero">
        <div className="container" style={{textAlign:'center'}}>
          <div className="profile-avatar"></div>
          <h2 style={{margin:0}}>username</h2>
          <p style={{marginTop:6}}>User bio / details</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <strong>Your Feed</strong>
          <p style={{color:'#777'}}>Posts by this user will appear here.</p>
        </div>
      </div>
    </div>
  )
}

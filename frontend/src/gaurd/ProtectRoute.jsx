import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectRoute({children,allowRoles=[]}) {
    const userRole='TEACHER'
    const authenticated=true

    if(!authenticated){
        return <Navigate to={'/login'}/>
    }

    if(allowRoles && !allowRoles.includes(userRole)) return <Navigate to={'/login'}/>

  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectRoute

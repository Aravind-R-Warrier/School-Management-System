import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function ProtectRoute({children,allowRoles=[]}) {
    const {user,authenticated}=useContext(AuthContext)
    const[check,setCheck]=useState(false)


    useEffect(()=>{
      setCheck(true)
    },[])

    if(check && !authenticated){
        return <Navigate to={'/login'}/>
    }

    if(check && allowRoles && !allowRoles.includes(user.role)) return <Navigate to={'/login'}/>
    if(check){
      return (
        <div>
          {children}
        </div>
      )
    }
  
}

export default ProtectRoute

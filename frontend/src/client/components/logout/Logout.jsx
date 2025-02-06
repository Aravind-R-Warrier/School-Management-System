import React, { useContext, useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext'


function Logout() {
    const {logOut}=useContext(AuthContext)
    const[check,setCheck]=useState(false)
    const Navigate=useNavigate()
    useEffect(()=>{
     logOut()
     Navigate('/login')
    },[])

    return(
        <>
        Log Out
        </>
    )
  
}

export default Logout

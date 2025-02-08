import { createContext, useEffect, useState } from "react";


export const AuthContext=createContext()


export const AuthProvider=({children})=>{
    const[authenticated,setAuthenticated]=useState(false)
    const[user,setUser]=useState(null)
    const[dark,setDark]=useState(false)

    useEffect(()=>{
        const mode=sessionStorage.getItem('mode')
        const token=sessionStorage.getItem('token')
        const userStr=sessionStorage.getItem('user')
        if(token){
            setAuthenticated(true)
        }
        if(userStr){
            setUser(JSON.parse(userStr))
        }
        if(mode){
            setDark(JSON.parse(mode))
        }

    },[])

    const logIn=(credentials)=>{
        setAuthenticated(true)
        setUser(credentials)
    }

    const logOut=()=>{
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        setAuthenticated(false)
        setUser(null)
    }

    const modeChange=()=>{
        sessionStorage.setItem('mode',`${!dark}`)
        setDark(!dark)
    }

    return (
        <AuthContext.Provider value={{authenticated,user,dark,logIn,logOut,modeChange}}>
            {children}
        </AuthContext.Provider>
    )
   
}
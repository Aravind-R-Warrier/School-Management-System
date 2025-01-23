import { createContext, useEffect, useState } from "react";


export const AuthContext=createContext()


export const AuthProvider=({children})=>{
    const[authenticated,setAuthenticated]=useState(false)
    const[user,setUser]=useState(null)

    useEffect(()=>{
        const token=sessionStorage.getItem('token')
        const userStr=sessionStorage.getItem('user')
        if(token){
            setAuthenticated(true)
        }
        if(userStr){
            setUser(JSON.parse(userStr))
        }

    },[])

    const logIn=(credentials)=>{
        setAuthenticated(true)
        setUser(credentials)
    }

    const logOut=()=>{
        setAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{authenticated,user,logIn,logOut}}>
            {children}
        </AuthContext.Provider>
    )
   
}
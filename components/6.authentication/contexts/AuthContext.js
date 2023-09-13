import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext()


export const AuthProvider = ({children}) => {
  const [accessToken, setAccessToken] = useState(null);
  
  const handleLogin = async (username, password) => {
    console.log('handleLogin')
    const credentials = {
      username: username,
      password: password
    };

    try {
      // fetch accessToken...
      const login = await fetch('https://chat-api-with-auth.up.railway.app/auth/token', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const responseData = await login.json();

      console.log(responseData);

      if (responseData.status === 200) {
        await AsyncStorage.setItem('accessToken',responseData.data.accessToken )
        await AsyncStorage.setItem('userId', responseData.data._id);
        console.log(responseData.data._id)
        setAccessToken(responseData.data.accessToken)
      }
    } catch(error) {
      console.log(error)
    }
  }

  const handleRegister = async (username, password) => {
    const credentials = {
      username: username,
      password: password
    };

    try {
      const register = await fetch('https://chat-api-with-auth.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      
      
      if (register.ok === true) {
          return(true)
        } else{
            return(false)
        }
     
    } catch (error) {
      console.log("registration failed!", error)
    } 
  };


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken')
      setAccessToken(null)
    } catch(error) {
      console.log(error)
    }
  }

  const isLoggedIn = async () => {
    console.log('isLoggedIn')

    try {
      const token = await AsyncStorage.getItem('accessToken')
      setAccessToken(token)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, [])

  return (
    <AuthContext.Provider value={{accessToken, handleLogin, handleLogout, handleRegister}}>
      {children}
    </AuthContext.Provider>
  )

}
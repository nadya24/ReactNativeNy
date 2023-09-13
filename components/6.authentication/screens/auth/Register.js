import React, {useContext, useState} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext';


export const Register = ({navigation}) => {
  const {handleRegister} = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async() => {
    if (username && password) {
      console.log(`Username: ${username}, Password: ${password}`);
      const register = await handleRegister(username.trim().toLowerCase(), password);
      if(register){
        navigation.navigate("Login")
      }
    } else {
      console.log('Both fields are required');
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Register</Text>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Enter your username"
      />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        placeholder="Enter your password"
      />
    </View>
    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>

    <View style={{flexDirection:'row', marginTop: 20}}>
      <Text >Already have an account?</Text>
      <TouchableOpacity onPress={()=> navigation.navigate("Login")}><Text style={styles.login}>Login</Text></TouchableOpacity>
    </View>

  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 36,
    marginBottom: 24,
    color: '#333',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  login:{
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 10,
  }
});

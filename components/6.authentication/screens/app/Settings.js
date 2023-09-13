import React, {useContext} from 'react'
import {Text, View,TouchableOpacity, StyleSheet} from 'react-native'
import {AuthContext} from '../../contexts/AuthContext'

export const Settings = () => {
  const { handleLogout } = useContext(AuthContext);


  const handleSubmit = ()=>{
    handleLogout()

  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
});

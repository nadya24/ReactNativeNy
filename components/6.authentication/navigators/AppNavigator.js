import { createDrawerNavigator } from '@react-navigation/drawer';
import { Login } from '../screens/auth/Login';
import { Register } from '../screens/auth/Register';
import { Chat } from '../screens/app/Chat';
import { Settings } from '../screens/app/Settings';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}
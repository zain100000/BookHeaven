import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {theme} from '../styles/theme';

/* Shared Imports */
import Splash from '../screens/shared/Splash';
import OnBoarding from '../screens/shared/OnBoarding';

// Auth Imports
import Signin from '../screens/auth/Signin';
import Signup from '../screens/auth/Signup';

// Dashboard Imports
import BottomNavigator from '../navigation/bottomNavigator/BottomNavigator';

// Profile Imports
import Account from '../screens/profile/profileScreens/subProfileScreens/Account';
import Address from '../screens/profile/profileScreens/subProfileScreens/Address';
import Favorites from '../screens/profile/profileScreens/subProfileScreens/Favorites';
import Library from '../screens/profile/profileScreens/subProfileScreens/Library';
import PrivacyPolicy from '../screens/profile/profileScreens/subProfileScreens/PrivacyPolicy';
import AppUsage from '../screens/profile/profileScreens/subProfileScreens/AppUsage';

// Order(Cart + CheckOut) Imports
import Orders from '../screens/profile/profileScreens/subProfileScreens/Orders';
import CheckOut from '../screens/checkout/CheckOut';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [statusBarColor, setStatusBarColor] = useState(theme.colors.primary);

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Splash">
        {/* Shared Routes */}
        <Stack.Screen name="Splash">
          {props => <Splash {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="OnBoard">
          {props => (
            <OnBoarding {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Auth Routes */}
        <Stack.Screen name="Signin">
          {props => <Signin {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Signup">
          {props => <Signup {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        {/* Dashboard Routes */}
        <Stack.Screen name="Home">
          {props => (
            <BottomNavigator {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Profile Routes */}
        <Stack.Screen name="My_Account">
          {props => (
            <Account {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Address">
          {props => (
            <Address {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Favorites">
          {props => (
            <Favorites {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="My_Library">
          {props => (
            <Library {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="My_Orders">
          {props => <Orders {...props} setStatusBarColor={setStatusBarColor} />}
        </Stack.Screen>

        <Stack.Screen name="Privacy_Policy">
          {props => (
            <PrivacyPolicy {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Terms_Conditions">
          {props => (
            <AppUsage {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>

        {/* Order Routes */}
        <Stack.Screen name="CheckOut">
          {props => (
            <CheckOut {...props} setStatusBarColor={setStatusBarColor} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;

// import React, {useState} from 'react';
// import {View, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import {useNavigation} from '@react-navigation/native';
// import {theme} from '../../styles/theme';
// import {globalStyles} from '../../styles/globalStyles';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// const {width} = Dimensions.get('screen');

// const Splash = () => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const checkSession = async () => {
//   //     await new Promise(resolve => setTimeout(resolve, 1500));
//   //     const token = await AsyncStorage.getItem('authToken');
//   //     console.log('Token Get', token);

//   //     if (token) {
//   //       navigation.replace('Main');
//   //     } else {
//   //       navigation.replace('OnBoard');
//   //     }

//   //     setLoading(false);
//   //   };

//   //   checkSession();
//   // }, [navigation]);

//   return (
//     <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
//       <View style={styles.secondaryContainer}>
//         <View style={styles.imgContainer}>
//           <Animatable.Image
//             source={require('../../assets/splashScreen/splash-logo.png')}
//             animation={'fadeIn'}
//             duration={1500}
//             style={styles.Img}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Splash;

// const styles = StyleSheet.create({
//   primaryContainer: {
//     backgroundColor: theme.colors.primary,
//   },

//   secondaryContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   Img: {
//     width: width * 0.16,
//     height: width * 0.16,
//     resizeMode: 'contain',
//   },
// });

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  useColorScheme,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';

const {width} = Dimensions.get('screen');

const Splash = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.black : theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('OnBoarding');
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.black : theme.colors.primary,
        },
      ]}>
      <View style={styles.secondaryContainer}>
        <Animatable.View
          animation="fadeIn"
          duration={1500}
          style={styles.combinedContainer}>
          <Animatable.Image
            source={require('../../assets/splashScreen/splash-logo.png')}
            animation="fadeIn"
            duration={1500}
            style={styles.Img}
          />
          <Animatable.Text
            animation="fadeIn"
            delay={500}
            style={[
              styles.logoText,
              {
                color:
                  colorScheme === 'dark'
                    ? theme.colors.white
                    : theme.colors.white,
              },
            ]}>
            Book Heaven
          </Animatable.Text>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  secondaryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  combinedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  Img: {
    width: width * 0.16,
    height: width * 0.16,
    resizeMode: 'contain',
  },

  logoText: {
    fontSize: width * 0.09,
    fontFamily: theme.typography.fontFamilySemiBold,
    letterSpacing: 2,
    marginLeft: 10,
  },
});

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  useColorScheme,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';

const {width, height} = Dimensions.get('screen');

const Splash = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const token = await AsyncStorage.getItem('authToken');
        console.log(token)

        if (token) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Home'}],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'OnBoard'}],
          });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary,
        },
      ]}>
      <View style={styles.secondaryContainer}>
        <Animatable.View
          animation="bounceIn"
          duration={2000}
          style={styles.imgContainer}>
          <Animatable.Image
            source={require('../../assets/splashScreen/splash-logo.png')}
            animation="fadeIn"
            duration={1500}
            style={styles.Img}
          />
        </Animatable.View>
        <Animatable.Text
          animation="fadeInUp"
          duration={1500}
          style={[
            styles.splashTitle,
            {
              color:
                colorScheme === 'dark' ? theme.colors.white : theme.colors.dark,
            },
          ]}>
          Book Heaven
        </Animatable.Text>
        <Animatable.Text
          animation="fadeInUp"
          duration={2000}
          style={[
            styles.splashDescription,
            {
              color:
                colorScheme === 'dark' ? theme.colors.white : theme.colors.dark,
            },
          ]}>
          Your Gateway to Infinite Stories
        </Animatable.Text>
      </View>
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.gap(2),
  },

  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  Img: {
    width: width * 0.5,
    height: width * 0.54,
  },

  splashTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilySemiBold,
    textAlign: 'center',
    marginTop: height * 0.02,
  },

  splashDescription: {
    fontSize: theme.typography.fontSize.lg,
    textAlign: 'center',
    marginTop: height * 0.01,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});

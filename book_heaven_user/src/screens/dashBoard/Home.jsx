import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  useColorScheme,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import Header from '../../utils/customComponents/customHeader/Header';

const {width, height} = Dimensions.get('screen');

const Home = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark : theme.colors.white,
        },
      ]}>
      <View style={styles.headerContainer}>
        <Header
          title="Home"
          leftIcon={require('../../assets/icons/search.png')}
          rightIcon={require('../../assets/icons/bell.png')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});

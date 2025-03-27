import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import {theme} from '../../../../styles/theme';
import {globalStyles} from '../../../../styles/globalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../../../utils/customComponents/customHeader/Header';

const {width, height} = Dimensions.get('screen');

const Address = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(30)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const statusBarColor = theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        styles.primaryContainer,
        {
          backgroundColor: theme.colors.white,
        },
      ]}>
      <View style={styles.headerContainer}>
        <Header
          title="Address"
          leftIcon={require('../../../../assets/icons/arrow-left.png')}
          onPressLeft={() => navigation.goBack('')}
        />
      </View>
    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({});

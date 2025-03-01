import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const Header = ({imageSource, title, subtitle}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.welcomeContainer]}>
      <Image
        source={imageSource}
        style={{
          width: width * 0.45,
          height: height * 0.09,
        }}
        resizeMode="contain"
      />
      <Text
        style={[
          styles.welcomeTitleText,
          {
            color:
              colorScheme === 'dark' ? theme.colors.white : theme.colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.welcomeSubtitleText,
          {
            color:
              colorScheme === 'dark' ? theme.colors.white : theme.colors.black,
          },
        ]}>
        {subtitle}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  welcomeContainer: {
    gap: theme.gap(0.9),
  },

  welcomeTitleText: {
    fontSize: width * 0.08,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  welcomeSubtitleText: {
    fontSize: width * 0.05,
    fontFamily: theme.typography.fontFamilyRegular,
  },
});

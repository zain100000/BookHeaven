import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const Header = ({title, leftIcon, rightIcon, onPressLeft, onPressRight}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary,
        },
      ]}>
      <View style={styles.iconContainer}>
        {leftIcon ? (
          <TouchableOpacity onPress={onPressLeft}>
            <Image
              source={leftIcon}
              style={[
                styles.icon,
                {
                  tintColor:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.white,
                },
              ]}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text
        style={[
          styles.title,
          {
            color:
              colorScheme === 'dark' ? theme.colors.white : theme.colors.white,
          },
        ]}>
        {title}
      </Text>

      <View style={styles.iconContainer}>
        {rightIcon ? (
          <TouchableOpacity onPress={onPressRight}>
            <Image
              source={rightIcon}
              style={[
                styles.icon,
                {
                  tintColor:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.white,
                },
              ]}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
  },

  iconContainer: {
    position: 'relative',
  },

  icon: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },

  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
  },
});

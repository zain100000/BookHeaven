import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  useColorScheme,
} from 'react-native';
import {globalStyles} from '../../../styles/globalStyles';
import {theme} from '../../../styles/theme';

const Button = ({
  onPress,
  title,
  loading,
  style,
  textStyle,
  width,
  disabled,
}) => {
  const systemColorScheme = useColorScheme();
  const isDarkScheme = systemColorScheme === 'dark';

  const backgroundColor = isDarkScheme
    ? theme.colors.black
    : theme.colors.primary;
  const textColor = isDarkScheme ? theme.colors.white : theme.colors.white;

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={[
          globalStyles.buttonPrimary,
          style,
          {
            width: width || 'auto',
            backgroundColor: disabled ? theme.colors.gray : backgroundColor,
          },
        ]}
        activeOpacity={disabled ? 1 : 0.7}>
        {loading ? (
          <ActivityIndicator color={textColor} size={25} />
        ) : (
          <Text
            style={[globalStyles.buttonText, textStyle, {color: textColor}]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Button;

import React, {useState} from 'react';
import {TextInput, View, StyleSheet, Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {globalStyles} from '../../../styles/globalStyles';
import {theme} from '../../../styles/theme';

const {width} = Dimensions.get('screen');

const InputField = ({
  value,
  onChangeText,
  placeholder,
  style,
  inputStyle,
  secureTextEntry,
  editable,
  dropdownOptions,
  selectedValue,
  onValueChange,
  keyboardType,
  multiline,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={[globalStyles.inputContainer, style]}>
      {dropdownOptions ? (
        <DropDownPicker
          open={open}
          value={selectedValue}
          items={dropdownOptions}
          setOpen={setOpen}
          setValue={callback => {
            const selected = callback(selectedValue);
            onValueChange(selected);
          }}
          placeholder={placeholder}
          listMode="MODAL"
          modalProps={{
            animationType: 'fade',
          }}
          dropDownContainerStyle={[
            {
              backgroundColor: theme.colors.white,
              borderColor: theme.colors.primary,
            },
            inputStyle,
          ]}
          style={[
            {
              borderWidth: 2.5,
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.white,
            },
            inputStyle,
          ]}
          textStyle={[
            {
              marginHorizontal: width * 0.06,
              fontSize: width * 0.04,
              fontFamily: theme.typography.fontFamilyRegular,
              color: theme.colors.primary,
            },
          ]}
          zIndex={5}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.primary}
          style={[
            globalStyles.input,
            {
              backgroundColor: theme.colors.white,
              color: theme.colors.primary,
            },
            multiline && {height: 100},
            inputStyle,
          ]}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType}
          multiline={multiline}
        />
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({});

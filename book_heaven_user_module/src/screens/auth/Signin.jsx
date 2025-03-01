import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from '../../utils/customComponents/customInputField/InputField';
import Button from '../../utils/customComponents/customButton/Button';
import {
  isValidInput,
  validateEmail,
  validatePassword,
} from '../../utils/customValidations/Validations';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../redux/slices/authSlice';
import CustomModal from '../../utils/customModals/CustomModal';
import Header from '../../utils/customComponents/customHeader/Header';

const {width, height} = Dimensions.get('screen');

const Signin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.black : theme.colors.white;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    const hasErrors =
      emailError ||
      passwordError ||
      !email ||
      !password ||
      setIsButtonEnabled(!hasErrors);
  }, [emailError, passwordError]);

  const handleEmailChange = value => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = value => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleLogin = async () => {
    if (isValidInput(email, password)) {
      setLoading(true);
      setShowAuthModal(true);
      const loginData = {email, password};

      try {
        const resultAction = await dispatch(loginUser(loginData));
        if (loginUser.fulfilled.match(resultAction)) {
          setShowAuthModal(false);
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            navigation.replace('Main');
          }, 3000);
        } else {
          const errorMessage =
            resultAction.payload?.message || 'Login failed. Please try again.';
          setShowAuthModal(false);
          setLoading(false);
          console.error(errorMessage);
        }
      } catch (err) {
        console.error('An error occurred during login:', err);
        setShowAuthModal(false);
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.black : theme.colors.white,
        },
      ]}>
      <View style={styles.headerContainer}>
        <Header title="Welcome Back 👋" subtitle="Signin to your account" />
      </View>

      <View style={[styles.secondaryContainer]}>
        <View style={styles.formContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.emailContainer}>
              <Text
                style={[
                  globalStyles.inputLabel,
                  {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.white
                        : theme.colors.black,
                  },
                ]}>
                Email
              </Text>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="mail"
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              </View>
              <InputField
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter Email"
                placeholderTextColor={theme.colors.primary}
              />
              {emailError ? (
                <Text style={[globalStyles.textError, styles.errorText]}>
                  {emailError}
                </Text>
              ) : null}
            </View>

            <View style={styles.passwordContainer}>
              <Text
                style={[
                  globalStyles.inputLabel,
                  {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.white
                        : theme.colors.black,
                  },
                ]}>
                Password
              </Text>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={'lock-closed'}
                  size={width * 0.05}
                  color={theme.colors.primary}
                />
              </View>
              <InputField
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Enter Password"
                placeholderTextColor={theme.colors.primary}
                backgroundColor={theme.colors.white}
                secureTextEntry={hidePassword}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setHidePassword(!hidePassword)}>
                <Ionicons
                  name={hidePassword ? 'eye-off' : 'eye'}
                  size={width * 0.06}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              {passwordError ? (
                <Text
                  style={[globalStyles.textError, styles.passwordErrorText]}>
                  {passwordError}
                </Text>
              ) : null}
            </View>

            <View style={styles.extraContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Forgot_Password')}>
                <Text
                  style={[
                    globalStyles.textBlack,
                    styles.extraText,
                    {
                      color:
                        colorScheme === 'dark'
                          ? theme.colors.white
                          : theme.colors.primary,
                    },
                  ]}>
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
              <Button
                title="Signin"
                color={theme.colors.black}
                loading={loading}
                onPress={handleLogin}
                disabled={!isButtonEnabled}
                textStyle={{fontSize: width * 0.046}}
              />
            </View>

            <View style={styles.signupContainer}>
              <View style={styles.leftContainer}>
                <Text
                  style={[
                    globalStyles.textBlack,
                    {
                      color:
                        colorScheme === 'dark'
                          ? theme.colors.white
                          : theme.colors.black,
                    },
                  ]}>
                  Didn't have an account?
                </Text>
              </View>

              <TouchableOpacity
                style={styles.rightContainer}
                onPress={() => navigation.navigate('Signup')}>
                <Text
                  style={[
                    globalStyles.textPrimary,
                    styles.textPrimary,
                    {
                      color:
                        colorScheme === 'dark'
                          ? theme.colors.white
                          : theme.colors.primary,
                    },
                  ]}>
                  Signup
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please wait while log into your account."
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Login successfully"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginLeft: width * 0.02,
  },

  scrollViewContainer: {
    marginTop: height * 0.005,
  },

  emailContainer: {
    marginBottom: height * 0.02,
  },

  passwordContainer: {
    marginBottom: height * 0.02,
  },

  secondaryContainer: {
    flex: 5,
    padding: height * 0.01,
    marginTop: height * 0.1,
  },

  iconContainer: {
    position: 'absolute',
    left: width * 0.02,
    transform: [{translateY: width * 0.154}],
    zIndex: 8,
  },

  eyeIconContainer: {
    alignSelf: 'flex-end',
    right: width * 0.02,
    bottom: theme.spacing(6.64),
  },

  extraContainer: {
    bottom: height * 0.02,
    alignSelf: 'flex-start',
    left: width * 0.01,
  },

  extraText: {
    fontSize: width * 0.044,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.secondary,
  },

  btnContainer: {
    marginTop: height * 0.04,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.9,
    marginTop: height * 0.065,
  },

  textPrimary: {
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: width * 0.044,
  },

  errorText: {
    position: 'absolute',
    bottom: -height * 0.02,
    paddingHorizontal: width * 0.014,
    fontSize: width * 0.04,
    fontFamily: theme.typography.fontFamilySemiBold,
  },

  passwordErrorText: {
    position: 'absolute',
    bottom: height * 0.01,
    paddingHorizontal: width * 0.014,
    fontSize: width * 0.04,
    fontFamily: theme.typography.fontFamilySemiBold,
  },
});

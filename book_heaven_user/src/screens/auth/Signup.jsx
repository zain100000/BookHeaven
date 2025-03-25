import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  StatusBar,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {theme} from '../../styles/theme';
import {useNavigation} from '@react-navigation/native';
import {globalStyles} from '../../styles/globalStyles';
import InputField from '../../utils/customComponents/customInputField/InputField';
import {
  isValidInput,
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/customValidations/Validations';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../utils/customComponents/customButton/Button';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../redux/slices/authSlice';
import CustomModal from '../../utils/customModals/CustomModal';
import Toast from 'react-native-toast-message';

const {width, height} = Dimensions.get('screen');

const Signup = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(30)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    const hasErrors =
      nameError ||
      emailError ||
      passwordError ||
      !name ||
      !email ||
      !password ||
      setIsButtonEnabled(!hasErrors);
  }, [nameError, emailError, passwordError]);

  const handleNameChange = value => {
    setName(value);
    const error = validateName(value);
    setNameError(error);
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleEmailChange = value => {
    setEmail(value);
    const error = validateEmail(value);
    setEmailError(error);
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handlePasswordChange = value => {
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleSignup = async () => {
    if (isValidInput(name, email, password)) {
      setLoading(true);
      setShowAuthModal(true);

      try {
        const resultAction = await dispatch(
          registerUser({userName: name, email, password}),
        );

        if (registerUser.fulfilled.match(resultAction)) {
          const {user} = resultAction.payload;
          setShowAuthModal(false);
          setShowSuccessModal(true);

          setTimeout(() => {
            setShowSuccessModal(false);
            navigation.replace('Signup', {user});
          }, 3000);
        } else {
          const errorMessage =
            resultAction.payload?.message ||
            'Register failed. Please check your credentials';
          console.error('❌ Login failed:', errorMessage);
          setShowAuthModal(false);
          setLoading(false);
        }
      } catch (err) {
        console.error('🔥 Unexpected error:', err);
        setShowAuthModal(false);
        setLoading(false);
      } finally {
        setLoading(false);
        setShowAuthModal(false);
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
            colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary,
        },
      ]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Animated Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: headerTranslateY}],
            },
          ]}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerDescription}>Sign up to get started</Text>
        </Animated.View>

        {/* Animated Form */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: formTranslateY}],
            },
          ]}>
          {/* Name Input */}
          <View style={styles.nameContainer}>
            <Text
              style={[
                globalStyles.inputLabel,
                styles.label,
                {
                  color:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.white,
                },
              ]}>
              Name
            </Text>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}>
              <Ionicons
                name="person"
                size={width * 0.05}
                color={theme.colors.primary}
              />
            </Animated.View>

            <InputField
              value={name}
              onChangeText={handleNameChange}
              placeholder="Enter Name"
              placeholderTextColor={theme.colors.primary}
              backgroundColor={theme.colors.dark}
            />
          </View>

          {/* Email Input */}
          <View style={styles.emailContainer}>
            <Text
              style={[
                globalStyles.inputLabel,
                styles.label,
                {
                  color:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.white,
                },
              ]}>
              Email
            </Text>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}>
              <Ionicons
                name="mail"
                size={width * 0.05}
                color={theme.colors.primary}
              />
            </Animated.View>

            <InputField
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Enter Email"
              placeholderTextColor={theme.colors.primary}
              backgroundColor={theme.colors.dark}
            />
          </View>

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <Text
              style={[
                globalStyles.inputLabel,
                styles.label,
                {
                  color:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.white,
                },
              ]}>
              Password
            </Text>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ]}>
              <Ionicons
                name="lock-closed"
                size={width * 0.05}
                color={theme.colors.primary}
              />
            </Animated.View>
            <InputField
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Enter Password"
              secureTextEntry={hidePassword}
              placeholderTextColor={theme.colors.primary}
              backgroundColor={theme.colors.dark}
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
          </View>

          {/* Animated Button */}
          <Animated.View
            style={[
              styles.btnContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}>
            <Button
              title="SIGN UP"
              loading={loading}
              disabled={!isButtonEnabled}
              onPress={handleSignup}
              width={width * 0.96}
            />
          </Animated.View>

          {/* Animated Signin Link */}
          <Animated.View
            style={[
              styles.signinContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text
              style={[
                styles.signinText,
                {
                  color:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.white,
                },
              ]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text
                style={[
                  styles.signinLink,
                  {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.white
                        : theme.colors.secondary,
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Keep existing modals */}
      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please wait while we creating your account"
        animationSource={require('../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Registration Successful"
        animationSource={require('../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width * 0.024,
    paddingTop: height * 0.02,
  },

  headerContainer: {
    gap: theme.gap(0.2),
  },

  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.white,
    textTransform: 'capitalize',
    marginTop: height * 0.02,
  },

  headerDescription: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyMedium,
    color: theme.colors.white,
    left: width * 0.01,
  },

  formContainer: {
    marginTop: height * 0.04,
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

  btnContainer: {
    marginTop: height * 0.01,
    alignItems: 'center',
  },

  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.045,
  },

  signinText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  signinLink: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyBold,
  },
});

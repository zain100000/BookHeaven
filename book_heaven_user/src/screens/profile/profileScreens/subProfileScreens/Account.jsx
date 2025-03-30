import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Text,
} from 'react-native';
import {theme} from '../../../../styles/theme';
import {globalStyles} from '../../../../styles/globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../../../utils/customComponents/customHeader/Header';
import ImageUploadModal from '../../../../utils/customModals/ImageUploadModal';
import InputField from '../../../../utils/customComponents/customInputField/InputField';
import Toast from 'react-native-toast-message';
import {
  validateName,
  validatePhone,
} from '../../../../utils/customValidations/Validations';
import Button from '../../../../utils/customComponents/customButton/Button';
import {updateUser} from '../../../../redux/slices/userSlice';
import CustomModal from '../../../../utils/customModals/CustomModal';
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const Account = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const user = route.params.user;

  const [photoURL, setPhotoURL] = useState('');
  const [name, setName] = useState(user?.userName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [newImageURL, setNewImageURL] = useState('');
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(30)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

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

  useEffect(() => {
    const hasErrors =
      nameError ||
      phoneError ||
      !name ||
      !phone ||
      setIsButtonEnabled(!hasErrors);
  }, [nameError, phoneError]);

  const handleFieldChange = () => {
    setIsEdited(true);
  };

  const isUpdateEnabled = () => {
    return isEdited;
  };

  const handleImagePress = () => {
    setShowImageUploadModal(true);
  };

  const handleImageUpload = url => {
    setShowImageUploadModal(false);
    setNewImageURL(url);
    setPhotoURL(url);
    setIsEdited(true);
  };

  const handleNameChange = value => {
    setName(value);
    handleFieldChange();
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

  const handlePhoneChange = value => {
    setPhone(value);
    handleFieldChange();
    const error = validatePhone(value);
    setPhoneError(error);
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setShowAuthModal(true);

    const formData = new FormData();
    if (name) formData.append('userName', name);
    if (phone) formData.append('phone', phone);
    if (newImageURL) {
      formData.append('profilePicture', {
        uri: newImageURL,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      const resultAction = await dispatch(
        updateUser({userId: user._id, formData}),
      );

      if (updateUser.fulfilled.match(resultAction)) {
        setShowAuthModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }, 3000);
      } else {
        const errorMessage =
          resultAction.payload?.message || 'Failed to update profile.';
        console.error('❌ Update failed:', errorMessage);
        setShowAuthModal(false);
      }
    } catch (err) {
      console.error('🔥 Unexpected error:', err);
      setShowAuthModal(false);
    } finally {
      setLoading(false);
      setShowAuthModal(false);
    }
  };

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
          title="My Account"
          leftIcon={require('../../../../assets/icons/arrow-left.png')}
          onPressLeft={() => navigation.goBack('')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.imgContainer}
            activeOpacity={0.9}
            onPress={handleImagePress}>
            {user.profilePicture || newImageURL || photoURL ? (
              <Image
                source={{uri: newImageURL || photoURL || user.profilePicture}}
                style={styles.image}
              />
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Animated Form */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{translateY: formTranslateY}],
            },
          ]}>
          {/* Name Field */}
          <View style={styles.nameContainer}>
            <Text
              style={[
                globalStyles.inputLabel,
                styles.label,
                {
                  color: theme.colors.primary,
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

          {/* Phone Field */}
          <View style={styles.phoneContainer}>
            <Text
              style={[
                globalStyles.inputLabel,
                styles.label,
                {
                  color: theme.colors.primary,
                },
              ]}>
              Phone
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
                name="call"
                size={width * 0.05}
                color={theme.colors.primary}
              />
            </Animated.View>

            <InputField
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="Enter Phone"
              placeholderTextColor={theme.colors.primary}
              backgroundColor={theme.colors.dark}
            />
          </View>

          {/* Email Field */}
          <View style={styles.emailContainer}>
            <Text
              style={[
                globalStyles.inputLabel,
                styles.label,
                {
                  color: theme.colors.primary,
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
              value={user?.email}
              placeholderTextColor={theme.colors.primary}
              backgroundColor={theme.colors.dark}
              editable={false}
            />
          </View>

          {/* Button */}
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
              title="Update Profile"
              loading={loading}
              disabled={!isUpdateEnabled()}
              width={width * 0.96}
              onPress={handleUpdate}
              backgroundColor={theme.colors.primary}
              textColor={theme.colors.white}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <CustomModal
        visible={showAuthModal}
        title="Working!"
        description="Please wait while we update your profile"
        animationSource={require('../../../../assets/animations/email.json')}
        onClose={() => setShowAuthModal(false)}
      />

      <CustomModal
        visible={showSuccessModal}
        title="Success!"
        description="Profile Updated successful"
        animationSource={require('../../../../assets/animations/success.json')}
        onClose={() => setShowSuccessModal(false)}
      />

      <ImageUploadModal
        visible={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUpload={handleImageUpload}
        title="Upload Image!"
        description="Please Choose Your Profile Picture To Upload."
      />
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: height * 0.02,
  },

  cardContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },

  imgContainer: {
    marginBottom: height * 0.04,
  },

  image: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    resizeMode: 'cover',
  },

  formContainer: {
    paddingHorizontal: width * 0.024,
  },

  label: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    paddingHorizontal: width * 0.01,
  },

  iconContainer: {
    position: 'absolute',
    left: width * 0.02,
    transform: [{translateY: width * 0.164}],
    zIndex: 8,
  },

  btnContainer: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
});

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  useColorScheme,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../utils/customComponents/customHeader/Header';
import ProfileHeaderCard from '../../../utils/customComponents/customCards/profileScreenCards/ProfileHeaderCard';
import {getUser} from '../../../redux/slices/userSlice';
import {useSelector, useDispatch} from 'react-redux';
import ProfileScreenCard from '../../../utils/customComponents/customCards/profileScreenCards/ProfileCard';
import LogoutModal from '../../../utils/customModals/LogoutModal';

const {width, height} = Dimensions.get('screen');

const Profile = () => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const user = useSelector(state => state.auth.user);
  const userProfile = useSelector(state => state.user.user);
  const profilePicture = useSelector(state => state.user.user?.profilePicture);
  const name = useSelector(state => state.user.user?.userName);
  const phone = useSelector(state => state.user.user?.phone);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleProfileNavigate = () => {
    navigation.navigate('My_Account', {
      user: userProfile,
    });
  };

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.dark : theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getUser(user.id));
    }
  }, [dispatch, user]);

  const handleLogoutModal = () => {
    setShowLogoutModal(true);
  };

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
          title="Profile"
          leftIcon={require('../../../assets/icons/arrow-left.png')}
          rightIcon={require('../../../assets/icons/bell.png')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfoContainer}>
          <ProfileHeaderCard
            image={profilePicture}
            name={name}
            phone={phone}
            btnTitle="Logout"
            onPress={handleLogoutModal}
            loading={loading}
          />
        </View>

        <View style={styles.profileCards}>
          <View style={styles.accountContainer}>
            <ProfileScreenCard
              title="My Account"
              iconName="person"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={handleProfileNavigate}
            />
          </View>

          <View style={styles.addressContainer}>
            <ProfileScreenCard
              title="Address"
              iconName="location"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Address')}
            />
          </View>

          <View style={styles.libraryContainer}>
            <ProfileScreenCard
              title="My Library"
              iconName="book"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('My_Library')}
            />
          </View>

          <View style={styles.privacyPolicyContainer}>
            <ProfileScreenCard
              title="Privacy Policy"
              iconName="shield"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Privacy_Policy')}
            />
          </View>

          <View style={styles.termsConditionContainer}>
            <ProfileScreenCard
              title="Terms & Conditions"
              iconName="briefcase"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Terms_Conditions')}
            />
          </View>

          <View style={styles.favoriteContainer}>
            <ProfileScreenCard
              title="Favorites"
              iconName="heart"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Favorites')}
            />
          </View>

          <View style={styles.orderContainer}>
            <ProfileScreenCard
              title="My Orders"
              iconName="clipboard"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('My_Orders')}
            />
          </View>

          <View style={styles.customerCareContainer}>
            <ProfileScreenCard
              title="Customer Care"
              iconName="headset"
              iconColor={theme.colors.primary}
              rightIcon="chevron-forward"
              onPressFunction={() => navigation.navigate('Customer_Care')}
            />
          </View>

          <View style={styles.deleteProfileContainer}>
            <ProfileScreenCard
              title="Delete My Profile"
              iconName="trash"
              iconColor={theme.colors.error}
              rightIcon="chevron-forward"
            />
          </View>
        </View>
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout!"
        description="Are Your Sure You Want To Logout ?"
      />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingTop: height * 0.02,
  },

  profileCards: {
    marginTop: height * 0.034,
    marginHorizontal: width * 0.04,
    gap: theme.gap(1),
  },
});

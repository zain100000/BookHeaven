import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';
import Header from '../../utils/customComponents/customHeader/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import BottomSheet from '../../utils/customComponents/customBottomSheet/BottomSheet';

const {width, height} = Dimensions.get('screen');

const CheckOut = () => {
  const route = useRoute();
  const {cartItems, userDetails, totalAmount, shippingFee} = route.params;
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('JazzCash');
  const paymentIcons = {
    JazzCash: require('../../assets/paymentMethodIcons/jazzcash-payment-method.png'),
    EasyPaisa: require('../../assets/paymentMethodIcons/easypaisa-payment-method.png'),
    CashOnDelivery: require('../../assets/paymentMethodIcons/cash-on-delivery-payment-method.png'),
  };

  const scaleAnim = new Animated.Value(1);

  const handleSelection = method => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedMethod(method);
  };

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: theme.colors.white}]}>
      <View style={styles.headerContainer}>
        <Header
          title="Confirm Order"
          leftIcon={require('../../assets/icons/arrow-left.png')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.primarySectionContainer}>
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Customer Details</Text>
            </View>

            <View style={styles.detailContainer}>
              <View style={styles.userInfoContainer}>
                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="person"
                      size={width * 0.054}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>
                      {userDetails?.userName || 'No Name'}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="call"
                      size={width * 0.054}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>
                      {userDetails?.phone || 'No Phone'}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="map"
                      size={width * 0.054}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>
                      {userDetails?.address || 'No Address'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>

            <View style={styles.detailContainer}>
              <View style={styles.summaryContainer}>
                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="cash"
                      size={width * 0.054}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Price</Text>

                    <Text style={styles.infoText}>
                      ${totalAmount - shippingFee}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="cube"
                      size={width * 0.054}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Shipping Fee</Text>

                    <Text style={styles.infoText}>${shippingFee}</Text>
                  </View>
                </View>

                <View style={[globalStyles.divider]} />

                <View style={styles.infoRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="cash"
                      size={width * 0.054}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Total Payment</Text>

                    <Text style={styles.infoText}>${totalAmount}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <TouchableOpacity onPress={() => setIsSheetVisible(true)}>
                      <View style={styles.orderDetailsContainer}>
                        <Text style={styles.orderDetailsText}>See Details</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
            </View>

            <View style={styles.detailContainer}>
              <View style={styles.paymentMethodContainer}>
                {['JazzCash', 'EasyPaisa', 'CashOnDelivery'].map(method => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentMethodRow,
                      selectedMethod === method && styles.selectedMethod,
                    ]}
                    onPress={() => handleSelection(method)}
                    activeOpacity={0.8}>
                    <Animated.View
                      style={[
                        styles.imgContainer,
                        {transform: [{scale: scaleAnim}]},
                      ]}>
                      <Image source={paymentIcons[method]} style={styles.img} />
                    </Animated.View>
                    <View style={styles.paymentMethodContainer}>
                      <Text style={styles.paymentMethod}>{method}</Text>
                    </View>
                    <View style={styles.paymentMethodContainer}>
                      <Text style={styles.paymentMethod}>
                        {method === 'JazzCash'
                          ? '+923090207411'
                          : method === 'EasyPaisa'
                          ? '+923147718070'
                          : method === 'CashOnDelivery'
                          ? ''
                          : 'N/A'}
                      </Text>
                    </View>
                    {selectedMethod === method && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        cartItems={cartItems}
      />
    </SafeAreaView>
  );
};

export default CheckOut;

const styles = StyleSheet.create({
  primarySectionContainer: {
    padding: height * 0.014,
    gap: theme.gap(2),
  },

  sectionContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: height * 0.014,
    borderRadius: theme.borderRadius.large,
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.black,
    marginBottom: height * 0.02,
  },

  detailContainer: {
    flexDirection: 'column',
    gap: theme.gap(2),
  },

  iconContainer: {
    padding: height * 0.01,
    borderRadius: theme.borderRadius.circle,
    backgroundColor: 'rgba(125, 100, 195, 0.2)',
  },

  userInfoContainer: {
    flexDirection: 'column',
    gap: theme.gap(2),
  },

  summaryContainer: {
    flexDirection: 'column',
    gap: theme.gap(2),
  },

  infoRow: {
    width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(2),
  },

  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(2),
  },

  infoText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.black,
  },

  orderDetailsText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.primary,
  },

  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.01,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    marginVertical: height * 0.014,
  },

  imgContainer: {
    width: width * 0.14,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  img: {
    width: width * 0.14,
    height: width * 0.14,
    resizeMode: 'contain',
  },

  selectedMethod: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  paymentMethodContainer: {
    flex: 1,
  },

  paymentMethod: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    width: width * 0.34,
  },
});

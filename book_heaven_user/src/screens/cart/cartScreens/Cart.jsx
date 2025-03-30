import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  FlatList,
  Text,
  Animated,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {theme} from '../../../styles/theme';
import {globalStyles} from '../../../styles/globalStyles';
import Header from '../../../utils/customComponents/customHeader/Header';
import CartCard from '../../../utils/customComponents/customCards/cartCard/CartCard';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllCartItems,
  addToCart,
  removeFromCart,
  removeAllFromCart,
  updateCartItem,
} from '../../../redux/slices/cartSlice';
import Loader from '../../../utils/customComponents/customLoader/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../../utils/customComponents/customButton/Button';

const {width, height} = Dimensions.get('screen');

const Cart = () => {
  const dispatch = useDispatch();
  const {cartItems, loading} = useSelector(state => state.cart);
  const [removingAll, setRemovingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const bounceAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const statusBarColor = theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
    dispatch(getAllCartItems());
  }, []);

  useEffect(() => {
    if (!loading && cartItems?.length === 0 && removingAll) {
      setRemovingAll(false);
    }
    if (!loading && cartItems?.length === 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 10,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start();
    }
  }, [loading, cartItems]);

  const handleAddToCart = async bookId => {
    dispatch(updateCartItem({bookId, quantity: 1}));
    await dispatch(addToCart({bookId}));
    dispatch(getAllCartItems());
  };

  const handleRemoveFromCart = async bookId => {
    const item = cartItems.find(item => item.bookId._id === bookId);
    if (item.quantity > 1) {
      dispatch(updateCartItem({bookId, quantity: -1}));
    }
    await dispatch(removeFromCart({bookId}));
    dispatch(getAllCartItems());
  };

  const handleCompleteRemove = async bookId => {
    setRemovingAll(true);
    await dispatch(removeAllFromCart({bookId}));
    dispatch(getAllCartItems());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getAllCartItems());
    setRefreshing(false);
  };

  const totalAmount = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + (item?.bookId?.price || 0) * item.quantity,
        0,
      )
    : 0;

  return (
    <SafeAreaView
      style={[globalStyles.container, {backgroundColor: theme.colors.white}]}>
      <View style={styles.headerContainer}>
        <Header
          title="Cart"
          leftIcon={require('../../../assets/icons/arrow-left.png')}
          rightIcon={require('../../../assets/icons/bell.png')}
        />
      </View>

      {loading && !removingAll ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : cartItems?.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <CartCard
              title={item.bookId.title}
              price={item.price}
              imageUrl={item.bookId.bookImage}
              onRemove={() => handleCompleteRemove(item.bookId._id)}
              onIncrease={() => handleAddToCart(item.bookId._id)}
              onDecrease={() => handleRemoveFromCart(item.bookId._id)}
              quantity={item.quantity}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }>
          <Animated.View
            style={[
              {opacity: fadeAnim, transform: [{translateY: bounceAnim}]},
            ]}>
            <View style={{alignSelf: 'center'}}>
              <Ionicons
                name="cart-outline"
                size={width * 0.28}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.emptyText}>Cart Is Empty</Text>
          </Animated.View>

          <View style={styles.fixedBottomContainer}>
            <View style={styles.amountContainer}>
              <Text style={styles.totalText}>Total Amount</Text>
              <Text style={styles.amountText}>${totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.btnContainer}>
              <Button
                title="Checkout"
                backgroundColor={theme.colors.primary}
                textColor={theme.colors.white}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.primary,
    marginTop: height * 0.02,
  },

  listContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
  },

  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  totalText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.primary,
  },

  amountText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.black,
  },
});

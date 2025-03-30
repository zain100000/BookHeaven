import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../../styles/globalStyles';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const BottomSheet = ({visible, onClose, cartItems}) => {
  const sheetRef = useRef(null);

  return (
    <SafeAreaView style={[globalStyles.container, styles.primaryContainer]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overLayContainer}>
            <View style={styles.sheetContainer} ref={sheetRef}>
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Summary Details</Text>
                </View>

                <View style={styles.detailContainer}>
                  <View style={styles.infoHeaderContainer}>
                    <Text style={styles.infoTitle}>Cart Items</Text>
                  </View>
                  <View style={styles.infoRow}>
                    {cartItems.map((item, index) => (
                      <Text key={index} style={styles.infoText}>
                        {item.title} (${item.unitPrice} Each) x{item.quantity}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  overLayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  sheetContainer: {
    height: height * 0.6,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
  },

  sectionContainer: {
    padding: height * 0.014,
  },

  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.black,
    marginBottom: height * 0.02,
  },

  detailContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: height * 0.014,
    borderRadius: theme.borderRadius.large,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.gap(2),
  },

  infoTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.black,
    marginBottom: height * 0.02,
  },

  infoText: {
    width: width * 0.84,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilySemiBold,
    color: theme.colors.black,
  },
});

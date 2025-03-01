import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {theme} from '../../styles/theme';
import {globalStyles} from '../../styles/globalStyles';

const {width, height} = Dimensions.get('screen');

const CustomModal = ({
  visible,
  onClose,
  title,
  description,
  animationSource,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {animationSource && (
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={styles.animation}
            />
          )}
          {title && (
            <Text style={[globalStyles.textBlack, styles.modalText]}>
              {title}
            </Text>
          )}
          {description && (
            <Text style={[globalStyles.textBlack, styles.descriptionText]}>
              {description}
            </Text>
          )}
          <View style={styles.buttonContainer}>
            {primaryButtonText && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onPrimaryButtonPress}>
                <Text style={styles.primaryButtonText}>
                  {primaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
            {secondaryButtonText && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onSecondaryButtonPress}>
                <Text style={styles.secondaryButtonText}>
                  {secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  modalView: {
    margin: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.92,
    height: height * 0.48,
  },

  animation: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 15,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: width * 0.05,
    color: theme.colors.dark,
  },

  descriptionText: {
    textAlign: 'center',
    color: theme.colors.dark,
    fontSize: width * 0.04,
  },

  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: theme.colors.white,
    fontSize: width * 0.04,
  },

  secondaryButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: theme.colors.white,
    fontSize: width * 0.04,
  },
});

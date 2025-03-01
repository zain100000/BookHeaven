import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import {theme} from '../../../styles/theme';

const {width, height} = Dimensions.get('screen');

const TabBar = ({tabs, activeTab, setActiveTab, onTabChange}) => {
  const tabIndicatorPosition = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.value === activeTab);
    const position = (width * 0.3 + width * 0.04) * activeIndex;
    Animated.spring(tabIndicatorPosition, {
      toValue: position,
      useNativeDriver: true,
    }).start();
  }, [activeTab, tabs]);

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.value}
          style={[
            styles.tabButton,
            activeTab === tab.value ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => {
            setActiveTab(tab.value);
            onTabChange(tab.value);
          }}>
          <Text
            style={[
              activeTab === tab.value
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[
          styles.tabIndicator,
          {transform: [{translateX: tabIndicatorPosition}]},
        ]}
      />
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },

  tabButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginHorizontal: 8,
    width: width * 0.25,
  },

  activeTab: {
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.white,
    elevation: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  inactiveTab: {
    backgroundColor: theme.colors.gray,
    borderBottomWidth: 4,
    borderBottomColor: theme.colors.white,
    elevation: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  activeTabText: {
    color: theme.colors.white,
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },

  inactiveTabText: {
    color: theme.colors.lightGray,
    fontSize: width * 0.04,
    fontWeight: '600',
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 4,
    width: width * 0.25,
    backgroundColor: theme.colors.white,
    borderRadius: 2,
    zIndex: 10,
  },
});

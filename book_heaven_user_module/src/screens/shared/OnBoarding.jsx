import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../../styles/theme';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Now reading books will be easier',
    description:
      ' Discover new worlds, join a vibrant reading community. Start your reading adventure effortlessly with us.',
    headerImage: require('../../assets/onBoarding/onBoard-1.png'),
  },
  {
    key: '2',
    title: 'Your Bookish Soulmate Awaits',
    description:
      'Let us be your guide to the perfect read. Discover books tailored to your tastes for a truly rewarding experience.',
    headerImage: require('../../assets/onBoarding/onBoard-2.png'),
  },
  {
    key: '3',
    title: 'Start Your Adventure',
    description:
      "Ready to embark on a quest for inspiration and knowledge? Your adventure begins now. Let's go!",
    headerImage: require('../../assets/onBoarding/onBoard-3.png'),
  },
];

const OnBoarding = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const statusBarColor =
      colorScheme === 'dark' ? theme.colors.black : theme.colors.white;
    StatusBar.setBackgroundColor(statusBarColor);
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content',
    );
  }, [colorScheme]);

  const handleOnComplete = () => {
    navigation.replace('Signin');
  };

  const handleSlideChange = index => {
    setActiveIndex(index);
  };

  const goToNextSlide = () => {
    if (sliderRef.current && activeIndex < slides.length - 1) {
      const nextIndex = activeIndex + 1;
      sliderRef.current.goToSlide(nextIndex);
      setActiveIndex(nextIndex);
    } else {
      handleOnComplete();
    }
  };

  const renderItem = ({item, index}) => (
    <SafeAreaView
      style={[
        styles.primaryContainer,
        {
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.black : theme.colors.white,
        },
      ]}>
      <View style={styles.headerImageContainer}>
        <Image source={item.headerImage} style={styles.headerImage} />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color:
                colorScheme === 'dark' ? theme.colors.white : theme.colors.dark,
            },
          ]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.description,
            {
              color:
                colorScheme === 'dark' ? theme.colors.white : theme.colors.dark,
            },
          ]}>
          {item.description}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        {index === slides.length - 1 ? (
          <TouchableOpacity
            style={[
              styles.getStartedButtonContainer,
              {
                backgroundColor:
                  colorScheme === 'dark'
                    ? theme.colors.white
                    : theme.colors.primary,
              },
            ]}
            onPress={handleOnComplete}>
            <Text
              style={[
                styles.getStartedButtonText,
                {
                  color:
                    colorScheme === 'dark'
                      ? theme.colors.black
                      : theme.colors.white,
                },
              ]}>
              Get Started!
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.skipButtonContainer,
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.black,
                },
              ]}
              onPress={handleOnComplete}>
              <Text
                style={[
                  styles.skipButtonText,
                  {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.dark
                        : theme.colors.white,
                  },
                ]}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.nextButtonContainer,
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? theme.colors.white
                      : theme.colors.primary,
                },
              ]}
              onPress={goToNextSlide}>
              <Text
                style={[
                  styles.nextButtonText,
                  {
                    color:
                      colorScheme === 'dark'
                        ? theme.colors.black
                        : theme.colors.white,
                  },
                ]}>
                Next
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === activeIndex
                  ? colorScheme === 'dark'
                    ? theme.colors.primary
                    : theme.colors.primary
                  : theme.colors.gray,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <>
      <AppIntroSlider
        ref={sliderRef}
        renderItem={renderItem}
        data={slides}
        onSlideChange={handleSlideChange}
        renderPagination={renderPagination}
        showSkipButton={false}
        showDoneButton={false}
        showNextButton={false}
      />
    </>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  headerImage: {
    width: '100%',
    height: height * 0.5,
    resizeMode: 'contain',
  },

  textContainer: {
    flex: 1,
    alignItems: 'center',
    top: height * 0.04,
    gap: theme.gap(1),
  },

  title: {
    fontSize: width * 0.06,
    width: width * 0.7,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyBold,
    lineHeight: height * 0.044,
  },

  description: {
    lineHeight: height * 0.044,
    fontSize: width * 0.045,
    width: width * 0.9,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyRegular,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: width * 0.05,
    gap: width * 0.03,
  },

  skipButtonContainer: {
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
  },

  nextButtonContainer: {
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
  },

  skipButtonText: {
    fontSize: width * 0.045,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  nextButtonText: {
    fontSize: width * 0.045,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  getStartedButtonContainer: {
    borderRadius: 10,
    padding: height * 0.018,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
  },

  getStartedButtonText: {
    fontSize: width * 0.045,
    fontFamily: theme.typography.fontFamilyRegular,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.14,
    width: '100%',
    gap: theme.gap(1),
  },

  dot: {
    width: width * 0.03,
    height: width * 0.03,
    margin: width * 0.004,
    borderRadius: (width * 0.04) / 2,
  },
});

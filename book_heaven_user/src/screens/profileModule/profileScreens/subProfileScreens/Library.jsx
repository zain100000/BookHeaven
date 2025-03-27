import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import {globalStyles} from '../../../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import Header from '../../../../utils/customComponents/customHeader/Header';
import {theme} from '../../../../styles/theme';
import {useDispatch, useSelector} from 'react-redux';
import {getLibraryBooks} from '../../../../redux/slices/librarySlice';
import Loader from '../../../../utils/customComponents/customLoader/Loader';
import LibraryCard from '../../../../utils/customComponents/customCards/libraryCard/LibraryCard';

const {width, height} = Dimensions.get('screen');

const Library = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const {library} = useSelector(state => state.library);

  useEffect(() => {
    const statusBarColor = theme.colors.primary;
    StatusBar.setBackgroundColor(statusBarColor);
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(getLibraryBooks()).finally(() => setLoading(false));
  }, [dispatch]);

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
          title="My Library"
          leftIcon={require('../../../../assets/icons/arrow-left.png')}
          onPressLeft={() => navigation.goBack()}
        />
      </View>

      <View style={styles.booksContainer}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : library?.length > 0 ? (
          <FlatList
            data={library}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
              <LibraryCard
                bookImage={item.bookId.bookImage}
                title={item.bookId.title}
                author={item.bookId.author}
                bookFile={item.bookFile}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Library Is Empty!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Library;

const styles = StyleSheet.create({
  primaryContainer: {
    flex: 1,
  },

  booksContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.04,
  },
});

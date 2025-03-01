import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config/Config';

const {BASE_URL} = CONFIG;

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/signup-user`,
        userData,
      );
      console.log('Server Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error Response:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || {message: 'Unknown error occurred.'},
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (loginData, {rejectWithValue}) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/signin-user`,
        loginData,
      );

      console.log('LOGIN RESPONSE', response.data);

      const {success, data, token} = response.data;

      if (success) {
        await AsyncStorage.setItem('authToken', token);
        return {user: data, token}; // Extract `data` as `user`
      } else {
        return rejectWithValue('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Retrieved Token:', token);

      const response = await axios.post(
        `${BASE_URL}/user/logut-user`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      console.log('API Response:', response.data);

      // Remove the token from AsyncStorage after successful logout
      await AsyncStorage.removeItem('authToken');
      console.log('Token removed from AsyncStorage');

      // Explicitly return the success status
      return response.data;
    } catch (error) {
      console.error('API Error:', error?.response?.data || error.message);
      return rejectWithValue(
        error?.response?.data || {message: 'Unknown error occurred.'},
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, state => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

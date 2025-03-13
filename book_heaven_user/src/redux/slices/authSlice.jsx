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
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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

      const {token, data} = response.data;

      const user = {
        id: data.id,
        email: data.email,
      };

      await AsyncStorage.setItem('authToken', token);

      return {user, token};
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || {
          message: 'Network Error - Could not reach server',
        },
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await axios.post(
        `${BASE_URL}/user/logout-user`,
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

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
        state.token = action.payload.token;
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

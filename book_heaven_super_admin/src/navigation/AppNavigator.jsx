import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "../screens/auth/Signin";
import Signup from "../screens/auth/Signup";
import NotFound from "../screens/notFound/NotFound";
import DashboardLayout from "../navigation/outlet/Outlet";
import ProtectedRoute from "./protectedRoutes/ProtectedRoutes";
import Dashboard from "../screens/dashboard/Dashboard";
import Books from "../screens/manageBooks/books/Books";
import AddBook from "../screens/manageBooks/addBooks/AddBook";
import BookDetails from "../screens/manageBooks/bookDetails/BookDetails";
import UpdateBook from "../screens/manageBooks/updateBook/UpdateBook";
import Stock from "../screens/manageStock/stock/Stock";
import Reviews from "../screens/manageReviews/reviews/Reviews";
import ReviewDetails from "../screens/manageReviews/reviewDetails/ReviewDetails";

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/auth/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books/add-book" element={<AddBook />} />
        <Route path="books/manage-books" element={<Books />} />
        <Route path="books/book-details/:id" element={<BookDetails />} />
        <Route path="books/edit-book/:id" element={<UpdateBook />} />

        <Route path="stocks/manage-stocks" element={<Stock />} />
        <Route path="reviews/manage-reviews" element={<Reviews />} />
        <Route path="reviews/review-details/:id" element={<ReviewDetails />} />

      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppNavigator;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../utils/customCards/Card";
import { getAllBooks } from "../../redux/slices/bookSlice";
import { getAllReviews } from "../../redux/slices/reviewSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const books = useSelector((state) => state.books.books);
  const reviews = useSelector((state) => state.reviews.reviews);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllBooks());
      dispatch(getAllReviews());
    }
  }, [dispatch, user?.id]);

  const { totalBooks, totalStock } = books.reduce(
    (acc, book) => {
      acc.totalBooks++;
      acc.totalStock += book.stock || 0;
      return acc;
    },
    { totalBooks: 0, totalStock: 0 }
  );

  const totalReviews = reviews.reduce(
    (acc, review) => acc + (review.stock ?? 1), 
    0
  );
  

  const handleNavigateBook = () => navigate("/admin/books/manage-books");
  const handleNavigateStock = () => navigate("/admin/stocks/manage-stocks");
  const handleNavigateReviews = () => navigate("/admin/reviews/manage-reviews");

  return (
    <section id="dashboard">
      <div className="container">
        <div className="row">          
          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigateBook}
              title="Books"
              icon={<i className="fas fa-book" />}
              stats={[{ label: "Total", value: totalBooks }]}
            />
          </div>

          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigateStock}
              title="Stock"
              icon={<i className="fas fa-shopping-cart" />}
              stats={[{ label: "Total", value: totalStock }]}
            />
          </div>

          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigateReviews}
              title="Reviews"
              icon={<i className="fas fa-star" />}
              stats={[{ label: "Total", value: totalReviews }]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

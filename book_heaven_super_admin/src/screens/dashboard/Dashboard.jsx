import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../utils/customCards/Card";
import { getAllBooks } from "../../redux/slices/bookSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const books = useSelector((state) => state.books.books);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllBooks());
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

  const handleNavigateBook = () => navigate("/admin/books/manage-books");

  return (
    <section id="dashboard">
      <div className="container">
        <div className="row">
          {/* <div className="col-sm-12 col-md-12 col-lg-4">
            <Card title="Total Users" icon={<i className="fas fa-user" />} />
          </div> */}

          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigateBook}
              title="Books"
              icon={<i className="fas fa-book" />}
              stats={[
                { label: "Total", value: totalBooks },
                { label: "Total Stock", value: totalStock },
              ]}
            />
          </div>

          {/* <div className="col-sm-12 col-md-12 col-lg-4">
            <Card title="Orders" icon={<i className="fas fa-gift" />} />
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

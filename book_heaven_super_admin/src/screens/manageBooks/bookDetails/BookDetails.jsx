import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../../../utils/customLoader/Loader";
import "./BookDetails.css";

const BookDetails = () => {
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBook(location.state?.book || null);
      setLoading(false);
    }, 1000);
  }, [location.state]);

  if (loading) {
    return <Loader />;
  }

  if (!book) {
    return <div className="not-found">No Books Found</div>;
  }

  return (
    <section id="book-detail">
      <div className="banner">
        <h1>Book Details</h1>
      </div>
      <div className="container">
        <div className="profile">
          <img
            src={book.bookImage || "placeholder_image.jpg"}
            alt="Book Detail"
          />
        </div>
        <div className="details">
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td className="label color1">Title</td>
                  <td className="value color1">{book.title}</td>
                  <td className="label color2">Author</td>
                  <td className="value color2">{book.author}</td>
                </tr>
                <tr>
                  <td className="label color3">Description</td>
                  <td className="value color3">{book.description}</td>
                  <td className="label color4">Price</td>
                  <td className="value color4">${book.price}</td>
                </tr>
                <tr>
                  <td className="label color2">Genre</td>
                  <td className="value color2">{book.genre.join(", ")}</td>
                  <td className="label color2">Stock</td>
                  <td className="value color2">{book.stock}</td>
                </tr>
                <tr>
                  <td className="label color1">Ratings</td>
                  <td className="value color2">{book.rating}</td>
                  <td className="label color1">Year Of Publication</td>
                  <td className="value color2">{book.publicationYear}</td>
                </tr>
                <tr>
                  <td className="label color3">Publisher</td>
                  <td className="value color3">{book.publisher}</td>
                  <td className="label color3">Rating</td>
                  <td className="value color3">{book.rating}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetails;

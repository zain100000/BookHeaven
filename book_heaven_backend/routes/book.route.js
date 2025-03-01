const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const bookPictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const bookController = require("../controllers/book.controller");

router.post(
  "/upload-book",
  protect,
  bookPictureUpload.upload,
  bookController.addBook
);

router.get("/get-all-books", protect, bookController.getAllBooks);

router.get("/get-book-by-id/:id", protect, bookController.getBookById);

router.patch(
  "/update-book/:id",
  protect,
  bookPictureUpload.upload,
  bookController.updateBook
);

router.delete("/delete-book/:id", protect, bookController.deleteBook);

module.exports = router;

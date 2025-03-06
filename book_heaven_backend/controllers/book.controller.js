const Book = require("../models/book.model");
const cloudinaryUpload = require("../utilities/cloudinary/cloudinary.utility");

exports.addBook = async (req, res) => {
  try {
    console.log("📤 Received Request - Files:", req.files);

    const {
      title,
      author,
      description,
      price,
      genre,
      stock,
      publicationYear,
      publisher,
      pages,
    } = req.body;

    if (!req.files?.bookImage || !req.files?.bookFile) {
      return res.status(400).json({
        success: false,
        message: "Book image and book file (PDF) are required",
      });
    }

    // Upload Book Image
    const bookImageUploadResult = await cloudinaryUpload.uploadToCloudinary(
      req.files.bookImage[0],
      "bookImage"
    );

    // Upload Book PDF
    const bookFileUploadResult = await cloudinaryUpload.uploadToCloudinary(
      req.files.bookFile[0],
      "bookFile"
    );

    // Save to Database
    const book = new Book({
      title,
      author,
      description,
      price,
      genre,
      stock,
      publicationYear,
      publisher,
      pages,
      bookImage: bookImageUploadResult.url,
      bookFile: bookFileUploadResult.url,
      uploadedBy: req.user.id,
    });

    await book.save();

    res.status(201).json({
      success: true,
      message: "Book uploaded successfully",
      book: book,
    });
  } catch (error) {
    console.error("❌ Error Uploading Book:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("uploadedBy");

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Books found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params; // Get the booksId from the request parameters

    const books = await Book.findById(id).select("-title");
    if (!books) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found!",
      });
    }

    res.json({
      success: true,
      message: "Book Fetched Successfully",
      book: books, // Return the single book
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting Book!",
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized! Only Super Admins can update books.",
      });
    }

    const { id } = req.params;
    const updates = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found!" });
    }

    if (req.files?.bookImage) {
      const bookImageUploadResult = await cloudinaryUpload.uploadToCloudinary(
        req.files.bookImage[0],
        "bookImage"
      );
      updates.bookImage = bookImageUploadResult.url;
    }

    if (req.files?.bookFile) {
      const bookFileUploadResult = await cloudinaryUpload.uploadToCloudinary(
        req.files.bookFile[0],
        "bookFile"
      );
      updates.bookFile = bookFileUploadResult.url;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    if (req.user.role !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized! Only Super Admins can delete books.",
      });
    }

    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found!" });
    }

    // Delete book image and book file from Cloudinary
    if (book.bookImage) {
      await cloudinaryUpload.deleteFromCloudinary(
        book.bookImage,
        "BookHeaven/bookImage"
      );
    }
    if (book.bookFile) {
      await cloudinaryUpload.deleteFromCloudinary(
        book.bookFile,
        "BookHeaven/bookFile"
      );
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Book deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error Deleting Book:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

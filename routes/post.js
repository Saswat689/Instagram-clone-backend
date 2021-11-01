const express = require("express");
const router = express.Router();

const checkUploadErrors = require("../middlewares/checkUploadErrors");
const { uploadImage } = require("../utils/multerconfig");
const isAuthorized = require("../middlewares/isAuthorized");

const {
  createPost,
  getPostDetails,
  getAllUserPosts,
  getAllPosts
} = require("../controllers/post");

router.post(
  "/post/create/:userId",
  isAuthorized,
  [
    uploadImage.single("postImage"),
    function (req, res, next) {
      if (!req.file) {
        return res.status(422).json({
          message: "Post image is required",
          success: false,
        });
      }
      next();
    },
  ],
  checkUploadErrors,
  createPost
);

router.get("/post/:postId/:userId", isAuthorized, getPostDetails);

router.get("/posts/:userId", isAuthorized, getAllUserPosts);

router.get("/posts",isAuthorized,getAllPosts)

module.exports = router;

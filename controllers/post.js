const User = require("../models/user");
const Post = require("../models/post");
const { isValidObjectId } = require("mongoose");
const url = require("url");

function getBaseUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
  });
}

exports.createPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { caption } = req.body;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
        success: false,
      });
    }
    const user = await User.findById(userId).select("_id posts").exec();
    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
        success: false,
      });
    }
    const baseUrl = getBaseUrl(req);
    const newPost = new Post({
      postImageUrl: `${baseUrl}/static/${req.file.filename}`,
      createdBy: user._id,
      caption: caption
    });

    const result = await newPost.save();
    let updatedUserPostList = [
      ...user.posts,
      {
        post: result._id,
      },
    ];

    user.posts = updatedUserPostList;

    await user.save();

    res.status(200).json({
      message: "Post created successfully",
      success: true,
      postInfo: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Some error occurred",
      success: false,
    });
  }
};

exports.getPostDetails = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return res.status(400).json({
        message: "Invalid post Id",
        success: false,
      });
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
      return res.status(400).json({
        message: "No such post exist",
        success: false,
      });
    }

    res.status(200).json({
      postInfo: post,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Some error occurred",
      success: false,
    });
  }
};

exports.getAllUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
        success: false,
      });
    }

    const user = await User.findById(userId)
      .select("_id posts")
      .populate("posts.post")
      .exec();
    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
        success: false,
      });
    }

    res.status(200).json({
      count: user.posts.length,
      posts: user.posts,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Some error occurred",
      success: false,
    });
  }
};

exports.getAllPosts = async (req,res) => {
  try{
    const allPosts = await Post.find();
    return res.status(200).json(allPosts);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      message: "Some error occurred",
      success: false,
    });
  }
}

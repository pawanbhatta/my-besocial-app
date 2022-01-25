const Post = require("../models/Post");
const User = require("../models/User");

const postController = {
  create: async (req, res) => {
    try {
      const newPost = new Post(req.body);
      const savedPost = await newPost.save();
      return res.status(200).json(savedPost);
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) throw res.status(404).send("Post not found");

      if (post.userId.toString() === req.user._id.toString()) {
        console.log("before updating");
        const res = await post.updateOne({
          $set: { desc: req.body.desc, image: req.body.image },
        });
        console.log("after updating");

        return res.status(200).json({ message: "Post updated successfully" });
      } else {
        console.log("not allowed");

        return res
          .status(403)
          .json({ error: "You can update only your posts" });
      }
    } catch (error) {
      console.log("error in server");

      throw res.status(500).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) throw res.status(404).send("Post not found");

      console.log(
        "equalize post",
        post.userId.toString() === req.user._id.toString()
      );
      if (post.userId.toString() === req.user._id.toString()) {
        console.log("here");
        await post.remove();
        return res.status(200).json("The post has been deleted");
      } else {
        console.log("or here");
        throw res.status(403).send("You can delete only your posts");
      }
    } catch (error) {
      console.log("else hrer");
      throw res.status(500).send(error);
    }
  },

  react: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      // if (!post) return res.status(404).json("Post Not Found");

      if (!post.likes.includes(req.body.userId)) {
        // await post.updateOne({
        //   $push: {
        //     likes: req.body.userId,
        //   },
        // });
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { likes: req.body.userId } }
        );
        res.status(200).json("You liked the post");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("You disliked the post");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json("Post not found");

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  timelinePosts: async (req, res) => {
    try {
      const currentUser = await User.findOne({ email: req.query.email });
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friend) => Post.find({ userId: friend }))
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  profilePosts: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = postController;

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
        const data = await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: { desc: req.body.desc, image: req.body.image },
          },
          { returnOriginal: false }
        );

        return res.status(200).json(data);
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
    // const { userId } = req.query;
    try {
      // const user = userId
      //   ? await User.findOne({ _id: userId })
      //   : await User.findOne({ username: req.params.username });
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getSearchData: async (req, res) => {
    const { q } = req.query;
    console.log(q);
    try {
      const users = await User.find({
        username: { $regex: q, $options: "i" },
      }).select(
        "-_v -createdAt -updatedAt -password -coverPicture -profilePicture"
      );
      const posts = await Post.find({
        desc: { $regex: q, $options: "i" },
      }).select("-_v -createdAt -updatedAt -image -imageId -likes");

      const data = users.concat(...posts);

      // const keys = ["username", "desc"];

      // const search = (data) => {
      //   return data.filter((item) =>
      //     keys.some((key) => item[key].toLowerCase().includes(q))
      //   );
      // };

      res.status(200).json(data.splice(0, 10));
    } catch (err) {
      res.status(500).send("Server error while searching data");
    }
  },
};

module.exports = postController;

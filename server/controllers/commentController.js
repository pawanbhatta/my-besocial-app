const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

const commentController = {
  getComments: async (req, res) => {
    try {
      const comments = await Comment.find({ postId: req.params.postId });
      const commentsData = await Promise.all(
        comments.map(async (c) => {
          const { username, profilePicture } = await User.findOne({
            _id: c.userId,
          });
          const { _id, comment, image, likes, updatedAt } = c;
          return {
            _id,
            username,
            profilePicture,
            comment,
            image,
            likes,
            updatedAt,
          };
        })
      );
      res.status(200).json(commentsData);
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  create: async (req, res) => {
    try {
      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();

      // const post = await Post.findOne({ _id: savedComment.postId });
      await Post.findOneAndUpdate(
        { _id: savedComment.postId },
        { $push: { comments: savedComment._id } }
      );

      return res.status(200).json(savedComment);
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) throw res.status(404).send("Post not found");

      if (comment.userId.toString() === req.user._id.toString()) {
        const data = await Comment.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: { comment: req.body.comment, image: req.body.image },
          },
          { returnOriginal: false }
        );

        return res.status(200).json(data);
      } else {
        console.log("not allowed");

        return res
          .status(403)
          .send({ error: "You can update only your Comments" });
      }
    } catch (error) {
      console.log("error in server");

      throw res.status(500).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) throw res.status(404).send("Post not found");

      if (comment.userId.toString() === req.user._id.toString()) {
        await comment.remove();
        return res.status(200).json("The comment has been deleted");
      } else {
        throw res.status(403).send("You can delete only your comments");
      }
    } catch (error) {
      throw res.status(500).send(error);
    }
  },

  react: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      // if (!post) return res.status(404).json("Post Not Found");

      if (!comment.likes.includes(req.body.userId)) {
        // await post.updateOne({
        //   $push: {
        //     likes: req.body.userId,
        //   },
        // });
        await Comment.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { likes: req.body.userId } }
        );
        res.status(200).json("You liked the comment");
      } else {
        await comment.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("You disliked the comment");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = commentController;

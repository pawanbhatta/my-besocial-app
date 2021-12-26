const router = require("express").Router();
// const gfs = require("../server");
const { MONGO_URL } = process.env;
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
// const myFuc = require("../server");

// console.log("gfs", gfs);
// create storage engine
const fsStorage = new GridFsStorage({
  url: MONGO_URL,
  file: (req, file) => {
    const { username, type, postId } = req.query;
    console.log("this is  storage", req.query);

    let filename =
      type + "." + username + Date.now() + path.extname(file.originalname);
    let isProfile = false;
    let isCover = false;
    let isPost = false;

    if (type == "post") {
      isPost = true;
      bucketName = "PostImages";
    } else if (type == "profile") {
      isProfile = true;
      bucketName = "ProfileImages";
    } else {
      isCover = true;
      bucketName = "CoverImages";
    }

    return {
      filename,
      bucketName,
      metadata: {
        bucketName,
        type: req.query.type,
        originalname: file.originalname,
        username,
        isProfile,
        isCover,
        isPost,
        postId,
      },
    };
  },
});

// create images backup storage engine
const backupStorage = new GridFsStorage({
  url: MONGO_URL,
  file: (req, file) => {
    const { username, type, postId } = req.query;
    console.log("this is backup storage");

    let filename =
      type + "." + username + Date.now() + path.extname(file.originalname);
    let isProfile = false;
    let isCover = false;
    let isPost = false;

    if (type == "post") {
      isPost = true;
    } else if (type == "profile") {
      isProfile = true;
    } else {
      isCover = true;
    }

    return {
      filename,
      bucketName: "Images",
      metadata: {
        bucketName: "Images",
        type: req.query.type,
        originalname: file.originalname,
        username,
        isProfile,
        isCover,
        isPost,
        postId,
      },
    };
  },
});

const fsUpload = multer({ storage: fsStorage });
const backupUpload = multer({ storage: backupStorage });

// To upload an image
// The second parameter to upload backup image doesnot work currently
router.post(
  "/upload",
  [fsUpload.single("file"), backupUpload.single("file")],
  async (req, res) => {
    console.log("posted file", req.file);
    try {
      return res.status(200).json({
        message: "File uploaded successfully",
        file: req.file,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// Get all post or profile or cover images of a perticular user
router.get("/", (req, res) => {
  // switch (req.query.type) {
  //   case "post":
  //     chooseCollection("PostImages");
  //     // gfs.collection("PostImages");
  //     break;
  //   case "profile":
  //     chooseCollection("ProfileImages");
  //     // gfs.collection("ProfileImages");
  //     break;
  //   case "cover":
  //     chooseCollection("CoverImages");
  //     // gfs.collection("CoverImages");
  //     break;
  //   default:
  //     chooseCollection("Images");
  //     // gfs.collection("Images");
  //     break;
  // }
  // myFuc(req.query.type);
  gfs.files
    .find()
    .sort({ uploadDate: 1 })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      console.log("files", files);

      let results = files.filter(
        (file) => file.metadata.username == req.query.username
      );

      return res.status(200).json(results);
    });
});

// To get the info of a single image
router.get("/info/:filename", async (req, res) => {
  const image = await gfs.files.findOne({ _id: "61bc3c4dc3bbf5069874cf0c" });
  console.log("query", image);

  if (!image) return res.status(404).json({ err: "No File Exists" });

  if (image.contentType === "image/jpeg" || image.contentType === "image/png") {
    res.status(200).json(image);
    // const readStream = await gfs.createReadStream(image.filename);
    // await readStream.pipe(res);
  } else {
    res.status(404).json({ err: "Not an Image" });
  }
});

// Display a single image
router.get("/view/:filename", async (req, res) => {
  let image = await gfs.files.findOne({ filename: req.params.filename });

  // Check if image
  if (image.contentType === "image/jpeg" || image.contentType === "img/png") {
    // To display image to browser
    var rstream = gfs.createReadStream({ filename: image.filename });
    var bufs = [];
    rstream
      .on("data", function (chunk) {
        bufs.push(chunk);
      })
      .on("end", function () {
        // done

        var fbuf = Buffer.concat(bufs);

        var base64 = fbuf.toString("base64");

        return res.send('<img src="data:image/jpeg;base64,' + base64 + '">');
      });
  } else {
    return res.status(404).json({
      err: "Not an image",
    });
  }
});

// To download an image
router.get("/download/:filename", async (req, res) => {
  const image = await gfs.files.findOne({ filename: req.params.filename });

  if (!image) return res.status(404).json({ err: "No File Exists" });

  if (image.contentType === "image/jpeg" || image.contentType === "image/png") {
    const readStream = await gfs.createReadStream(image.filename);
    await readStream.pipe(res);
  } else {
    res.status(404).json({ err: "Not an Image" });
  }
});

// To delete an image
router.delete("/:filename", async (req, res) => {
  try {
    await gfs.remove({ filename: req.params.filename, root: "Images" });
  } catch (err) {
    return res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const { MONGO_URL, APP_PORT, CORS_ORIGIN } = process.env;
const Grid = require("gridfs-stream");
const path = require("path");

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  allowedHeaders: "Content-Type,Accept,Access-Control-Allow-Origin,Access-Control-Allow-Credentials,cache-control,user-agent,x-access-token",
  vary: "Origin,Cookies",
}));

//Ashish Added These
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// Routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
// const imageRoutes = require("./routes/images");

// Create mongo connection
mongoose.connect(
  MONGO_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  () => console.log("connected to DB")
);
const conn = mongoose.createConnection(MONGO_URL);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  // gfs.collection("PostImages");
  // gfs.collection("PostImages");
  // gfs.collection("ProfileImages");
  gfs.collection("Images");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

// create storage engine
const fsStorage = new GridFsStorage({
  url: MONGO_URL,
  file: (req, file) => {
    console.log("file got here");
    const { username, type, postId } = req.query;

    let filename =
      type + "." + username + Date.now() + path.extname(file.originalname);
    let isProfile = false;
    let isCover = false;
    let isPost = false;

    // GRIDFS cannot access multiple buckets at a time while showing or downloading image
    // if (type == "post") {
    //   isPost = true;
    //   bucketName = "PostImages";
    // } else if (type == "profile") {
    //   isProfile = true;
    //   bucketName = "ProfileImages";
    // } else {
    //   isCover = true;
    //   bucketName = "CoverImages";
    // }

    let bucketName = "Images";

    return {
      filename,
      type: req.query.type,
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
app.post("/api/upload", [fsUpload.single("file")], async (req, res) => {
  console.log("file uploaded");
  try {
    return res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.log(error);
  }
});

// Get all post or profile or cover images of a perticular user
app.get("/api/images", (req, res) => {
  gfs.files
    .find()
    .sort({ uploadDate: 1 })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      let results = files.filter(
        (file) => file.metadata.username == req.query.username
      );

      return res.status(200).json(results);
    });
});

// To get the info of a single image
app.get("/api/images/info/:filename", async (req, res) => {
  const image = await gfs.files.findOne({ filename: req.params.filename });

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
app.get("/api/images/view/:filename", async (req, res) => {
  console.log("filename", req.params.filename);
  let image = await gfs.files.findOne({ filename: req.params.filename });
  console.log(image);

  // Check if image
  if (image.contentType === "image/jpeg" || image.contentType === "image/png") {
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
app.get("/api/images/download/:filename", async (req, res) => {
  // const { username, type } = req.query;
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
app.delete("/api/images/:filename", async (req, res) => {
  try {
    await gfs.remove({ filename: req.params.filename, root: "Images" });
  } catch (err) {
    return res.status(500).json({ err: "Something went wrong" });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
// app.use("/api/images", imageRoutes);

app.listen(process.env.PORT || APP_PORT, () => console.log(`Server started on port ${process.env.PORT || APP_PORT}`));

import multer from "multer";

const storage = multer.diskStorage({
  destination: new URL('.', import.meta.url).pathname + "public/images",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

export { upload };


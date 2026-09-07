import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname),
    );
  },
});
function fileFilter(req, file, cb) {
  console.log("MIME TYPE:", file.mimetype);
  console.log("FILE NAME:", file.originalname);

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith("image/") ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
}


function storyFileFilter(req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/quicktime" ||
    file.mimetype === "video/webm"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPEG, PNG, WebP, MP4, MOV, and WebM files are allowed."),
      false,
    );
  }
}
export const profilePicture = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB limit
});
export const coverPicture = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //10MB limit
});
export const storyMedia = multer({
  storage: storage,
  fileFilter: storyFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //10MB limit
});

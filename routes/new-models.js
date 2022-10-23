const express = require(`express`);
const multer = require(`multer`);

const newModels = require(`../controllers/new-models`);
const isAuth = require(`../middlewares/auth/is-auth`);
const user_val = require(`../middlewares/validators/user`).validateUserModel;
const class_val =
  require(`../middlewares/validators/class`).validateUserClassModel;
const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/announcement");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + `-` + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

router.post(`/new-admin`, user_val, newModels.newAdmin);

router.post(`/new-teacher`, user_val, newModels.newTeacher);

router.post(`/new-student`, user_val, newModels.newStudent);

router.post(`/new-class`, class_val, newModels.newClass);

router.post(`/new-exam`, newModels.newExam);

router.post(`/new-mark`, newModels.addMark);

router.post(
  `/new-announcement`,
  upload.single("image"),
  newModels.newAnnouncement
);
router.post(`/new-program`, newModels.newProgram);

module.exports = router;

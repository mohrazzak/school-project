const express = require(`express`);
const multer = require(`multer`);

const adminController = require(`../controllers/admin`);

const isAuth = require(`../middlewares/auth/is-auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
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

// add annoucment
router.post(
  `/add/announcement`,
  isAuth,
  isAdmin,
  upload.single("image"),
  adminController.addAnnouncement
);

// delete annoucment
router.delete(
  `/delete/announcement`,
  isAuth,
  isAdmin,
  adminController.deleteAnnouncement
);

// add student program
router.post(
  `/add/student-program`,
  isAuth,
  isAdmin,
  adminController.addStudentProgram
);

// edit student program
router.put(
  `/edit/student-program`,
  isAuth,
  isAdmin,
  adminController.editStudentProgram
);

// add teacher program
router.post( 
  `/add/teacher-program`,
  isAuth,
  isAdmin,
  adminController.addTeacherProgram
);

// edit teacher program
router.put(
  `/edit/teacher-program`,
  isAuth,
  isAdmin,
  adminController.editTeacherProgram
);

router.post(`/add/exam`, isAuth, isAdmin, adminController.addExam);

router.put(`/edit/exam`, isAuth, isAdmin, adminController.editExam);

router.delete(`/delete/exam`, isAuth, isAdmin, adminController.deleteExam);

router.post(`/add/mark`, isAuth, isAdmin, adminController.addMark);

router.put(`/edit/mark`, isAuth, isAdmin, adminController.editMark);

router.delete(`/delete/mark`, isAuth, isAdmin, adminController.deleteMark);

// Users

router.post(`/add/student`, isAuth, isAdmin, adminController.addStudent);

router.put(`/edit/student`, isAuth, isAdmin, adminController.editStudent);

// delete student
router.delete(
  `/delete/student`,
  isAuth,
  isAdmin,
  adminController.deleteStudent
);

//

router.post(`/add/teacher`, isAuth, isAdmin, adminController.addTeacher);

router.put(`/edit/teacher`, isAuth, isAdmin, adminController.editTeacher);

// delete teacher
router.delete(
  `/delete/teacher`,
  isAuth,
  isAdmin,
  adminController.deleteTeacher
);

//

router.post(`/add/admin`, isAuth, isAdmin, adminController.addAdmin);

router.put(`/edit/admin`, isAuth, isAdmin, adminController.editAdmin);

router.delete(`/delete/admin`, isAuth, isAdmin, adminController.deleteAdmin);

// fetch

router.get(`/all/students`, isAuth, isAdmin, adminController.allStudents);

router.get(`/all/teachers`, isAuth, isAdmin, adminController.allTeachers);

router.get(`/all/admins`, isAuth, isAdmin, adminController.allAdmins);

router.get(`/all/exams`, isAuth, isAdmin, adminController.allExams);

router.get(`/all/classses`, isAuth, isAdmin, adminController.allClasses);

module.exports = router;
  
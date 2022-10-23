const express = require(`express`);

const fetch = require(`../controllers/fetch`);
const isAuth = require(`../middlewares/auth/is-auth`);
const router = express.Router();
const { check} = require("express-validator");

router.post(
  `/class-students`,
  isAuth,
  [check("classId", "Please enter a valid class ID.").notEmpty().isNumeric()],
  fetch.studentsOfClass
);

router.post(
  `/teacher-students`,
  isAuth,
  [
    check("teacherId", "Please enter a valid teacher ID.")
      .notEmpty()
      .isNumeric(),
  ],
  fetch.studentsOfTeacher
);

router.post(
  `/class-teachers`,
  isAuth,
  [check("classId", "Please enter a valid class ID.").notEmpty().isNumeric()],
  fetch.teachersOfClass
);

router.post(
  `/friends`,
  isAuth,
  [
    check("studentId", "Please enter a valid student ID.")
      .notEmpty()
      .isNumeric(),
  ],
  fetch.friendsOfClass
);

router.post(`/exams`, fetch.exams);
router.post(`/marks`, isAuth, fetch.marksOfstudent);
router.post(`/program`, fetch.program);
router.get(`/classes`, fetch.allClasses);

module.exports = router;

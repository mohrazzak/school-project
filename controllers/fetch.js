const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const Student = require(`../models/student`);
const Admin = require(`../models/admin`);
const Teacher = require(`../models/teacher`);
const Class = require(`../models/class`);
const codes = require(`http-status-codes`).StatusCodes;
const Exam = require(`../models/exam`);
const Announcement = require(`../models/announcement`);
exports.studentsOfClass = async (req, res, next) => {
  try {
    const { classId } = req.body;
    const myClass = await Class.findOne({ prettyId: classId });
    if (!myClass) {
      const error = new Error("Error finding class.");
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    let students = myClass.students;
    if (students.length == 0) {
      const error = new Error("There is no students with this class.");
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    res.status(codes.ACCEPTED).json({
      message: "Class students fetched successfully",
      students: students,
    });
  } catch {
    const error = new Error(`Error fetching students.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.teachersOfClass = async (req, res, next) => {
  try {
    const { classId } = req.body;
    const myClass = await Class.findOne({ prettyId: classId });
    if (!myClass) {
      const error = new Error("Error finding class.");
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    res.status(codes.ACCEPTED).json({
      message: "Class teachers fetched successfully",
      teachers: myClass.teachers,
    });
  } catch {
    const error = new Error(`Error fetching teachers.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.teachersOfstudent = async (req, res, next) => {
  try {
    const studentId = req.userId;
    const student = await Student.findOne({ prettyId: studentId });
    const myClass = await Class.findOne({ prettyId: student.class.prettyId });
    if (!myClass) {
      const error = new Error("Error finding class.");
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    res.status(codes.ACCEPTED).json({
      message: "Class teachers fetched successfully",
      teachers: myClass.teachers,
    });
  } catch {
    const error = new Error(`Error fetching teachers.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.studentsOfTeacher = async (req, res, next) => {
  try {
    const { teacherId } = req.body;
    const teacher = await Teacher.findOne({ prettyId: teacherId });
    if (!teacher) {
      const error = new Error("Error finding teacher.");
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    let ids = [];
    teacher.classes.map((e) => {
      ids.push(e.prettyId);
    });
    let students = [];
    for (let i = 0; i < ids.length; i++) {
      const myClass = await Class.findOne({ prettyId: ids[i] });
      students.push(...myClass.students);
    }

    res.status(codes.ACCEPTED).json({
      message: "Class teachers fetched successfully",
      students,
    });
  } catch {
    const error = new Error(`Error fetching students.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.friendsOfClass = async (req, res, next) => {
  try {
    const studentId = req.userId;
    const student = await Student.findOne({ prettyId: studentId });

    const myClass = await Class.findOne({ prettyId: student.class.prettyId });
    if (!myClass || !student) {
      const error = new Error("Error finding class or student.");
      error.statusCode = 400;
      return next(error);
    }
    res.status(codes.ACCEPTED).json({
      message: "Students fetched successfully",
      students: myClass.students.filter(
        (student) => student.prettyId != studentId
      ),
    });
  } catch {
    const error = new Error(`Error fetching students.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.allClasses = async (req, res, next) => {
  const classes = await Class.find();
  res.json({ message: "Classes fetched successfully", classes: classes });
};
exports.allStudents = async (req, res, next) => {
  const students = await Student.find();
  res.json({ message: "Students fetched successfully", students: students });
};
exports.allStudents = async (req, res, next) => {
  const teachers = await Teacher.find();
  res.json({ message: "Teachers fetched successfully", teachers });
};
exports.allExams = async (req, res, next) => {
  const exams = await Exam.find();
  res.json({ message: "Exams fetched successfully", exams });
};

exports.exams = async (req, res, next) => {
  try {
    const studentId = req.userId;
    const student = await Student.findOne({ prettyId: studentId });
    const myClass = await Class.findOne({ prettyId: student.class.prettyId });
    res.status(codes.ACCEPTED).json({
      message: "Exams fetched ",
      exams: myClass.exams,
    });
  } catch {
    const error = new Error(`Error fetching exams.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.marksOfstudent = async (req, res, next) => {
  try {
    const studentId = req.userId;
    const student = await Student.findOne({ prettyId: studentId });
    console.log(
      student.marks.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      })
    );
    res.status(codes.ACCEPTED).json({
      message: "marks fetched ",
      marks: student.marks,
    });
  } catch {
    const error = new Error(`Error fetching marks.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.userInfo = async (req, res, next) => {
  try {
    const studentId = req.userId;
    const student = await Student.findOne({ prettyId: studentId });
    res.status(codes.ACCEPTED).json({
      message: "User fetched ",
      student: student,
    });
  } catch {
    const error = new Error(`Error fetching User.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.announcements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ updatedAt: -1 });
    res.json({ message: "Announcement fetched", announcements: announcements });
  } catch {
    const error = new Error(`Error fetching User.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.program = async (req, res, next) => {
  try {
    const studentId = req.userId;
    const student = await Student.findOne({ prettyId: studentId });
    const myClass = await Class.findOne({ prettyId: student.class.prettyId });
    res.json({ message: "Student program fetched", program: myClass.program });
  } catch {
    const error = new Error(`Error fetching Program.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

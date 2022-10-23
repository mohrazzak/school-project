const bcrypt = require(`bcrypt`);
const Student = require(`../models/student`);
const Admin = require(`../models/admin`);
const Teacher = require(`../models/teacher`);
const dClass = require(`../models/class`);
const Exam = require(`../models/exam`);
const codes = require(`http-status-codes`).StatusCodes;
const Announcement = require(`../models/announcement`);
const crypto = require(`crypto`);
exports.newAdmin = async (req, res, next) => {
  try {
    const { password, name, gender, email, phone, place } = req.body;
    const birth = {
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
    };
    const admin = new Admin({
      name: name,
      password: await bcrypt.hash(password, 10),
      gender,
      birth,
      email,
      phone,
      place,
    });
    await admin.save();
    res.status(codes.CREATED).json({ message: "Admin created.", admin });
  } catch {
    const error = new Error("Error creating new admin.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.newTeacher = async (req, res, next) => {
  try {
    const { password, name, gender, email, phone, place } = req.body;
    const birth = {
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
    };
    const teacher = new Teacher({
      name: name,
      password: await bcrypt.hash(password, 10),
      classes: [],
      gender: gender,
      birth,
      email,
      phone,
      place,
    });
    await teacher.save();
    res.status(codes.CREATED).json({ message: "Teacher created.", teacher });
  } catch {
    const error = new Error("Error creating new teacher.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.newStudent = async (req, res, next) => {
  try {
    const { password, name, gender, email, phone, place } = req.body;
    const birth = {
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
    };
    const student = new Student({
      name: name,
      password: await bcrypt.hash(password, 10),
      gender: gender,
      birth,
      email,
      phone,
      place,
      accessTokenExpiration: Date.now() + 97200000,
      accessToken: crypto.randomBytes(8).toString("hex"),
    });
    await student.save();
    res
      .status(codes.CREATED)
      .json({ message: "Student created.", student: student });
  } catch {
    const error = new Error("Error creating new student.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.newClass = async (req, res, next) => {
  // try {
  const { name } = req.body;
  const myClass = new dClass({
    name: name,
    teachers: [],
    students: [],
    exams: [],
  });

  await myClass.save();
  res.status(codes.CREATED).json({ message: "class createad.", myClass });
  // } catch {
  //   const error = new Error("Error creating new class.");
  //   error.statusCode = codes.INTERNAL_SERVER_ERROR;
  //   return next(error);
  // }
};

exports.newExam = async (req, res, next) => {
  try {
    const { subject, desc, fullMark } = req.body;

    const At = new Date(req.body.year, req.body.month - 1, req.body.day + 1);
    console.log(At);
    const exam = new Exam({
      subject: subject,
      desc: desc,
      At: At,
      fullMark: fullMark,
    });

    await exam.save();

    res.status(codes.CREATED).json({ message: "exam createad.", exam });
  } catch {
    const error = new Error("Error creating new exam.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.addMark = async (req, res, next) => {
  try {
    const studentId = req.body.studentId;
    const examId = req.body.examId;
    const exam = await Exam.findOne({ prettyId: examId });
    const mark = req.body.mark;
    const student = await Student.findOne({ prettyId: studentId });

    let a = student.marks.find((e) => {
      if (e.examPrettyId == examId) return true;
    });
    console.log(Date.now() + 10800000);
    if (a) {
      const error = new Error("Exam already added to this student");
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    student.marks.push({
      examPrettyId: examId,
      mark,
      fullMark: exam.fullMark,
      subject: exam.subject,
      At: Date.now() + 10800000,
    });
    await student.save();
    res.status(codes.ACCEPTED).json({
      message: "mark added ",
      students: student.marks,
    });
  } catch {
    const error = new Error(`Error adding mark.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.newAnnouncement = async (req, res, next) => {
  const { title, content } = req.body;
  let announcement;
  if (req.file) {
    announcement = new Announcement({
      title,
      content,
      image:
        "https://e-school-syr.herokuapp.com/" +
        req.file.path.replace("\\", "/").replace("\\", "/"),
    });
  } else {
    announcement = new Announcement({
      title,
      content,
      image:
        "https://www.simplilearn.com/ice9/free_resources_article_thumb/COVER-IMAGE_Digital-Selling-Foundation-Program.jpg",
    });
  }
  await announcement.save();
  res.status(codes.ACCEPTED).json({
    message: "Announcement published.",
    announcement: announcement,
  });
};

exports.newProgram = async (req, res) => {
  const { monday, tuesday, wednesday, thursday, friday, prettyId } = req.body;
  const program = [monday, tuesday, wednesday, thursday, friday];
  const myClass = await dClass.findOne({ prettyId: prettyId });
  myClass.program = program;
  await myClass.save();
  res.json({ message: "Program added/Edited" });
};

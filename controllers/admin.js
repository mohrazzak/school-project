const codes = require(`http-status-codes`).StatusCodes;
const Student = require(`../models/student`);
const Admin = require(`../models/admin`);
const Class = require(`../models/class`);
const Teacher = require(`../models/teacher`);
const Announcement = require(`../models/announcement`);
const Exam = require(`../models/exam`);
const bcrypt = require(`bcrypt`);
const crypto = require(`crypto`);

exports.addAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    let announcement;
    if (req.file) {
      const image = req.file.path.replace("\\", "/").replace("\\", "/");
      announcement = new Announcement({
        title,
        content,
        image: image,
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
      message: "Announcement adeded succesfully.",
      announcement: announcement,
    });
  } catch {
    const error = new Error(`Error adding announcement.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const { prettyId } = req.body;
    const announcement = await Announcement.findOne({ prettyId: prettyId });
    if (!announcement) {
      const error = new Error(`Error finding announcement.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    const mine = announcement.image.startsWith(
      "https://e-school-syr.herokuapp.com/images/announcement/"
    );
    if (mine) {
      deleteHelper(announcement.image);
    }
    await Announcement.deleteOne({ prettyId: prettyId });
    res.json({ message: "Announcement deleted succesfully." });
  } catch {
    const error = new Error(`Error deleting announcement.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.addStudentProgram = async (req, res) => {
  try {
    const { monday, tuesday, wednesday, thursday, friday, prettyId } = req.body;
    const program = [monday, tuesday, wednesday, thursday, friday];
    const myClass = await Class.findOne({ prettyId: prettyId });
    if (!myClass) {
      const error = new Error(`Error finding Class.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    myClass.program = program;
    await myClass.save();
    res.json({ message: "Program added succesfully", program });
  } catch {
    const error = new Error(`Error adding student program.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.editStudentProgram = async (req, res) => {
  try {
    const { monday, tuesday, wednesday, thursday, friday, prettyId } = req.body;
    const program = [monday, tuesday, wednesday, thursday, friday];
    const myClass = await Class.findOne({ prettyId: prettyId });
    if (!myClass) {
      const error = new Error(`Error finding Class.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    myClass.program = program;
    await myClass.save();
    res.json({ message: "Program edited", program });
  } catch {
    const error = new Error(`Error adding student program.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.addTeacherProgram = async (req, res, next) => { 
  try {
    const teacherId = req.body.teacherId;
    const teacher = await Teacher.findOne({ prettyIdent: teacherId });
    if (!teacher) {
      const error = new Error(`Error finding teacher.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    const { monday, tuesday, wednesday, thursday, friday } = req.body;
    const program = [monday, tuesday, wednesday, thursday, friday];
    teacher.program = program;
    await teacher.save();
    res.json({ message: "Program added", program });
  } catch {
    const error = new Error(`Error adding teacher program.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.editTeacherProgram = async (req, res, next) => {
  try {
    const teacherId = req.body.teacherId;
    const teacher = await Teacher.findOne({ prettyIdent: teacherId });
    if (!teacher) {
      const error = new Error(`Error finding teacher.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    const { monday, tuesday, wednesday, thursday, friday } = req.body;
    const program = [monday, tuesday, wednesday, thursday, friday];
    teacher.program = program;
    await teacher.save();
    res.json({ message: "Program edited", program });
  } catch {
    const error = new Error(`Error adding teacher program.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.addExam = async (req, res, next) => {
  try {
    const { subject, desc, fullMark } = req.body;
    const At = new Date(req.body.year, req.body.month - 1, req.body.day + 1);
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

exports.editExam = async (req, res, next) => {
  try {
    const { prettyId, subject, desc, fullMark } = req.body;
    const exam = await Exam.findOne({ prettyId: prettyId });
    if (!exam) {
      const error = new Error(`Error finding exam.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    const At = new Date(req.body.year, req.body.month - 1, req.body.day + 1);
    exam.subject = subject;
    exam.desc = desc;
    exam.fullMark = fullMark;
    exam.At = At;
    await exam.save();
    res.status(codes.CREATED).json({ message: "exam edited.", exam });
  } catch {
    const error = new Error("Error editing exam.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const { prettyId } = req.body;
    await Exam.deleteOne({ prettyId: prettyId });
    res.status(codes.CREATED).json({ message: "exam deleted." });
  } catch {
    const error = new Error("Error deleting exam.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.addMark = async (req, res, next) => {
  try {
    const { studentId, examId, mark } = req.body;
    const exam = await Exam.findOne({ prettyId: examId });
    const student = await Student.findOne({ prettyId: studentId });
    if (!exam || !student) {
      const error = new Error(`Error finding student or exam.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    let a = student.marks.find((e) => {
      if (e.examPrettyId == examId) return true;
    });
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
      message: "Mark added ",
      students: student.marks,
    });
  } catch {
    const error = new Error(`Error adding mark.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.editMark = async (req, res, next) => {
  try {
    const { studentId, examId, mark } = req.body;
    const exam = await Exam.findOne({ prettyId: examId });
    const student = await Student.findOne({ prettyId: studentId });
    if (!exam || !student) {
      const error = new Error(`Error finding student or exam.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    for (let i = 0; i < student.marks.length; i++) {
      if (student.marks[i].examPrettyId == exam.prettyId) {
        student.marks[i].mark = mark;
      }
    }
    await student.save();
    res.status(codes.ACCEPTED).json({
      message: "Mark edited ",
      marks: student.marks,
    });
  } catch {
    const error = new Error(`Error editing mark.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.deleteMark = async (req, res, next) => {
  try {
    const { studentId, examId } = req.body;
    const student = await Student.findOne({ prettyId: studentId });
    if (!student) {
      const error = new Error(`Error finding student.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    student.marks.filter((m) => m.examPrettyId != examId);
    await student.save();
    res.status(codes.ACCEPTED).json({
      message: "Mark added ",
      students: student.marks,
    });
  } catch {
    const error = new Error(`Error deleting mark.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

// USERS
exports.addAdmin = async (req, res, next) => {
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

exports.editAdmin = async (req, res, next) => {
  try {
    const { prettyId, name, gender, email, phone, place } = req.body;
    const birth = {
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
    };
    const admin = await Admin.findOne({ prettyId: prettyId });
    if (!admin) {
      const error = new Error(`Error finding admin.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    admin.name = name;
    admin.gender = gender;
    admin.email = email;
    admin.phone = phone;
    admin.place = place;
    admin.birth = birth;
    await admin.save();
  } catch {
    const error = new Error("Error editing admin.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const { prettyId } = req.body;
    await Admin.deleteOne({ prettyId: prettyId });
  } catch {
    const error = new Error("Error deleting admin.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.addTeacher = async (req, res, next) => {
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
      gender,
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

exports.editTeacher = async (req, res, next) => {
  try {
    const { prettyId, name, gender, email, phone, place, birth, classes } =
      req.body;
    editedClasses = classes.map(async (c) => {
      var myClass = await Class.findOne({ prettyId: c.prettyId });
      return {
        name: myClass.name,
        prettyId: myClass.prettyId,
        _id: myClass._id,
      };
    });
    const teacher = await Teacher.findOne({ prettyId: prettyId });
    teacher.name = name;
    teacher.gender = gender;
    teacher.email = email;
    teacher.phone = phone;
    teacher.place = place;
    teacher.birth = birth;
    teacher.classes = editedClasses;
    await teacher.save();
    res.status(codes.CREATED).json({ message: "Teacher created.", teacher });
  } catch {
    const error = new Error("Error creating new teacher.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    const { prettyId } = req.body;
    const teacher = await Teacher.findOne({ prettyId: prettyId });
    if (!teacher) {
      const error = new Error(`Error finding teacher.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    for (let i = 0; i < teacher.classes.length; i++) {
      var myClass = await Class.findOne({
        prettyId: teacher.classes[i].prettyId,
      });
      myClass.teachers = myClass.teachers.filter((t) => t.prettyId != prettyId);
      await myClass.save();
    }
    await Teacher.deleteOne({ prettyId: prettyId });
    res.status(codes.CREATED).json({ message: "Teacher deleted." });
  } catch {
    const error = new Error("Error deleting teacher.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.addStudent = async (req, res, next) => {
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
      .json({ message: "Student created succesfully.", student: student });
  } catch {
    const error = new Error("Error creating new student.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.editStudent = async (req, res, next) => {
  try {
    const { prettyId, name, gender, email, phone, place } = req.body;
    const student = await Student.findOne({ prettyId: prettyId });

    var theClass;
    if (student.class.prettyId) {
      const myClass = await Class.findOne({ prettyId: student.class.prettyId });
      if (!myClass) {
        const error = new Error(`Error finding class.`);
        error.statusCode = codes.INTERNAL_SERVER_ERROR;
        return next(error);
      }
      theClass = {
        _id: myClass._id,
        name: myClass.name,
        prettyId: myClass.prettyId,
      };
    }
    if (!student) {
      const error = new Error(`Error finding student.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }

    const birth = {
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
    };

    student.name = name;
    student.gender = gender;
    student.email = email;
    student.phone = phone;
    student.place = place;
    student.birth = birth;
    student.class = theClass;
    await student.save();
    res
      .status(codes.CREATED)
      .json({ message: "Student edited.", student: student });
  } catch {
    const error = new Error("Error creating new student.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { prettyId } = req.body;
    const student = await Student.findOne({ prettyId: prettyId });
    var myClass;
    if (student.class.prettyId) {
      myClass = await Class.findOne({
        prettyId: student.class.prettyId,
      });
      if (!myClass) {
        const error = new Error(`Error finding class.`);
        error.statusCode = codes.INTERNAL_SERVER_ERROR;
        return next(error);
      }
      myClass.students = myClass.students.filter(
        (s) => s.prettyId != student.prettyId
      );
      await myClass.save();
    }
    if (!student) {
      const error = new Error(`Error finding student.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    await Student.deleteOne({ prettyId: prettyId });

    res.json({ message: "Student deleted" });
  } catch {
    const error = new Error("Error deleting student.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.allClasses = async (req, res, next) => {
  try {
    const classes = await Class.find();
    if (!classes) {
      const error = new Error(`Error finding classes.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    res.json({ message: "Classes fetched successfully", classes: classes });
  } catch {
    const error = new Error("Error fetching classes.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.allStudents = async (req, res, next) => {
  try {
    const students = await Student.find();
    if (!students) {
      const error = new Error(`Error finding students.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    res.json({ message: "Students fetched successfully", students: students });
  } catch {
    const error = new Error("Error fetching students.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.allAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();
    if (!admins) {
      const error = new Error(`Error finding admins.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    res.json({ message: "Admins fetched successfully", admins });
  } catch {
    const error = new Error("Error fetching admins.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.allTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find();
    if (!teachers) {
      const error = new Error(`Error finding teachers.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    res.json({ message: "Teachers fetched successfully", teachers });
  } catch {
    const error = new Error("Error fetching teachers.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};
exports.allExams = async (req, res, next) => {
  try {
    const exams = await Exam.find();
    if (!exams) {
      const error = new Error(`Error finding exams.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    }
    res.json({ message: "Exams fetched successfully", exams });
  } catch {
    const error = new Error("Error fetching exams.");
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

const fs = require("fs");
const path = require(`path`);
function deleteHelper(filePath) {
  filePath = filePath.split(".com")[1];
  filePath = path.join(__dirname, "..", filePath);
  fs.unlinkSync(filePath);
}

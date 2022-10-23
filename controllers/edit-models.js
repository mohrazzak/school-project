const bcrypt = require(`bcrypt`);
const Student = require(`../models/student`);
const Admin = require(`../models/admin`);
const Teacher = require(`../models/teacher`);
const dClass = require(`../models/class`);
const codes = require(`http-status-codes`).StatusCodes;

exports.editPassword = async (req, res, next) => {
  try {
    const prettyId = req.userId;
    const role = req.role;
    const { newPassword, oldPassword } = req.body;
    let user;
    if (prettyId.length == 0) {
      const error = new Error(`Please insert an id.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    } else if (role == "student") {
      // student
      user = await Student.findOne({ prettyId: prettyId });
    } else if (role == "teacher") {
      // Teacher
      user = await Teacher.findOne({ prettyId: prettyId });
    } else {
      user = await Admin.findOne({ prettyId: prettyId });
    }
    if (!user) {
      const error = new Error(`User not found.`);
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    let result = await bcrypt.compare(oldPassword, user.password);
    if (
      (!result && oldPassword != user.accessToken) ||
      (oldPassword == user.accessToken &&
        user.accessTokenExpiration < Date.now())
    ) {
      const error = new Error(`Input values not correct.`);
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(codes.ACCEPTED).json({ message: `Password changed` });
  } catch {
    const error = new Error(`Updating password failed.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.editName = async (req, res, next) => {
  try {
    const { prettyId, name } = req.body;
    let user;
    if (prettyId.length == 0) {
      const error = new Error(`Please insert an id.`);
      error.statusCode = codes.INTERNAL_SERVER_ERROR;
      return next(error);
    } else if (prettyId.length >= 1000) {
      // student
      user = await Student.findOne({ prettyId: prettyId });
    } else if (prettyId.length >= 100) {
      // Teacher
      user = await Teacher.findOne({ prettyId: prettyId });
    } else {
      user = await Admin.findOne({ prettyId: prettyId });
    }
    if (!user) {
      const error = new Error(`User not found.`);
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    user.name = name;
    await user.save();
  } catch {
    const error = new Error(`Updating name failed.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

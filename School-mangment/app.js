require(`dotenv`).config();
const express = require(`express`);
const mongoose = require(`mongoose`);
const helmet = require(`helmet`);
const morgan = require(`morgan`);
const compression = require(`compression`);

const authRoutes = require(`./routes/auth`);
const userRoutes = require(`./routes/new-models`);
const connection = require(`./routes/connection`);
const editRoutes = require(`./routes/edit`);
const studentRoutes = require(`./routes/student`);
const commonRoutes = require(`./routes/common`);
const adminRoutes = require(`./routes/admin`);
const teacherRoutes = require(`./routes/teacher`);
const fetch = require(`./routes/fetch`);
const path = require(`path`);
const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  "/images/announcement",
  express.static(path.join(__dirname, "images", "announcement"))
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authRoutes);
// app.use(userRoutes);
// app.use(connection);
// app.use(fetch);
// app.use(editRoutes);
app.use(`/student`, studentRoutes);
app.use(commonRoutes);
app.use(`/admin`, adminRoutes);
app.use(`/teacher`, teacherRoutes);

app.use(helmet());
app.use(compression());
app.use(morgan("tiny"));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Sorry, page not found" });
});

mongoose
  .connect("mongodb+srv://test:test@cluster0.ir5x9.mongodb.net/school")
  .then(app.listen(process.env.PORT || 3000));

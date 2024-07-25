require("dotenv").config({ path: "./config/.env" });
const express = require("express");
// const passport = require("passport");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3333;
// app.use("/uploads", express.static("uploads"));
// app.use("/upload", express.static("/tmp"));


const isProduction = process.env.NODE_ENV === 'production';
console.log("🚀 ~ isProduction:", isProduction);
 
const liveStoragePath = process.env.LIVE_STORAGE_PATH || '/tmp';
const localStoragePath = process.env.LOCAL_STORAGE_PATH || './upload';
const storagePath = isProduction ? liveStoragePath : localStoragePath;
 
console.log("🚀 ~ liveStoragePath:", liveStoragePath);
console.log("🚀 ~ localStoragePath:", localStoragePath);
console.log("🚀 ~ storagePath:", storagePath);

app.get("/", (req, res) => {
  res.send("This is Updated Backend ");
});

const userRouter = require("./Routers/userRoute");
// const adminRouter = require("./app/Routers/adminRoute");

require("./config/Connect");
app.use(express.json());
app.use(cors());
// require("./config/passport");
// app.use(passport.initialize());
app.use(userRouter);
// app.use(adminRouter);
// app.use("/upload", express.static("upload"));

app.all("*", (req, res) => {
  res.status(404).send("URL Not Found");
});

app.listen(PORT, () => {
  console.log(`Server Is listening On http://localhost:${PORT}`);
});

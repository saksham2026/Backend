import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from '../routers/user.routes.js'
const app = express();

app.use(
  cors({
    origin:'https://retrocraft-fontend.onrender.com',
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16Kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/user',userRoute);
app.use("/", (req, res) => {
  res.json({
    message: "hello",
  });
});

export default app;

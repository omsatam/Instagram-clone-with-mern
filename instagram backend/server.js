import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Pusher from "pusher";
import dbModel from "./dbModel.js";
//app config
const app = express();
const port = process.env.PORT || 8080;

const pusher = new Pusher({
  appId: "1194876",
  key: "c533e34dac2e9d3f5062",
  secret: "c814064e76a4d1fde753",
  cluster: "ap2",
  useTLS: true,
});

//admin: Cq6F4ZKN19tMcuX4
//middlewares
app.use(express.json());
app.use(cors());

//db config
const connection_url =
  "mongodb+srv://admin:Cq6F4ZKN19tMcuX4@cluster0.2mt04.mongodb.net/instagramDB?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("DB connected");

  const changeStream = mongoose.connection.collection("posts").watch();

  changeStream.on("change", (change) => {
    console.log("Change triggered change...");
    console.log(change);
    console.log("en of change");

    if (change.operationType === "insert") {
      console.log("triggering pusher image upload");
      const postDetails = change.fullDocument;
      pusher.trigger("posts", "inserted", {
        user: postDetails.user,
        caption: postDetails.caption,
        image: postDetails.image,
      });
    } else {
      console.log("unknown trigger from pusher");
    }
  });
});

//api routes"
app.get("/", (req, res) => res.status(200).send("hello world"));
app.get("/sync", (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
app.post("/upload", (req, res) => {
  const body = req.body;
  dbModel.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
//listener
app.listen(port, () => console.log(`listening on localhost:${port}`));

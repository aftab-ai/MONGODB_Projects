const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const { maxLength } = require("buffer");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Connect with MONGODB
main()
  .then(() => {
    console.log("Connection Successful!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/TO_DO_APP");
}

// Schema Define
const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    tequired: true,
    maxLength: 50,
  },
});

// Create a model
const List = mongoose.model("List", taskSchema);

// Index Route
app.get("/", async (req, res) => {
  let lists = await List.find();
  res.render("index.ejs", { lists });
});

// Create Route
app.post("/", async (req, res) => {
  let { task } = req.body;
  let newList = new List({
    task: task,
  });
  newList
    .save()
    .then((res) => {
      console.log("Task addedd!");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
});

// Destroy Route
app.delete("/:id", async (req, res) => {
  let { id } = req.params;
  await List.findByIdAndDelete(id);
  console.log("Task Deleted!");
  res.redirect("/");
});

app.listen("8080", () => {
  console.log(`Server is running at port: 8080`);
});

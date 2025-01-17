const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors"); 
const compression = require('compression');

const post = require("./routes/Post");
const auth = require('./routes/auth')
const event = require('./routes/Event')
const resource = require('./routes/Resource')
const college = require('./routes/College')
const bodyParser = require('body-parser')

const port = 8000;
const app = express();

mongoose.set("strictQuery", false);

const db = "mongodb+srv://Khushi:Khushi@cluster0.6b9gc.mongodb.net/FeedBox-Club";
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("connection successful 😎😎")
}).catch((err)=>console.log(err))

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(compression())

app.use("/", auth);
app.use("/", post);
app.use("/", event);
app.use("/", resource);
app.use("/", college);

app.listen(port, console.log(`server is listening on the port: ${port}`));


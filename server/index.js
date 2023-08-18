const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const commentRoute = require("./routes/comments");
// const contactRoute = require("./routes/contactQueries");
const multer = require("multer");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
let bodyParser = require('body-parser')
const cors = require('cors');
app.use(cors());


//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  


dotenv.config();

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "My Brand API",
			version: "1.0.0",
			description: "A simple Express API",
		},
    components: {
      securitySchemes: {
          bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
          }
      }
  },
  security: [{
      bearerAuth: []
  }],

		servers: [
			{
				url: "http://localhost:5000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.set('strictQuery', true)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
mongoose
  .connect('mongodb+srv://bstwagir:123456A-z@cluster0.rchjodm.mongodb.net/Docker?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   // useCreateIndex: true,
   // useFindAndModify:true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));



  app.use("/server/auth",authRoute);
  app.use("/server/users",userRoute);
  // app.use("/server/posts",postRoute);
  // app.use("/server/contactQueries",contactRoute);
  // app.use("/server/posts",commentRoute);


  module.exports = app.listen("5000", () => {
   console.log("Backend is running.");
 });

  

  
  
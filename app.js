
import express from "express" 
import * as dotenv from "dotenv" 
import routes from "./routes/routes.js"
import db from "./db/db.js"
import bodyParser from "body-parser"
import path from "path";
import {fileURLToPath} from "url";
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5002;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// @ts-ignore
db.sync().then((console.log("connected"))).catch(error => console.log(error))

// les routes 
app.use(routes)

app.get('/home', (req, res) => {
        res.render('home')
    })
app.get('/login', (req, res) => {
        res.render('login')
    })
app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})
const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (_, res) => {
    res.render("login");
});

app.post("/create",  (req, res) => {
    let {username, email, password} = req.body;

    bcrypt.genSalt(10, (_, salt) => {
        bcrypt.hash(password, salt, async (_, hash) => {
            let createdUser = await userModel.create({
                username,
                email,
                password: hash
            });

            let token = jwt.sign({email}, "secretKey");
            res.cookie("token", token);
            res.send(createdUser);
        })
    })
}); 

app.get("/login", (_, res) => {
    res.render("index");
});

app.post("/login", async (req, res) => {
    let user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send("Something went wrong..!");

    bcrypt.compare(req.body.password, user.password, (_, result) => {
        if(result){
            let token = jwt.sign({email: user.email}, "secretKey");
            res.cookie("token", token);
            res.send("You are logged in..");
        } 
        else return res.send("Unable to log in!")
    });
});

app.get("/logout", (_, res) => {
    res.cookie("token", "");
    res.redirect("/");
});

app.listen(3001, () => {
    console.log("Server listening...");
});
const express  = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { post } = require("request");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
    // console.log("Success");
});

app.post("/", function(req, res){
    var firstName = req.body.fn;
    var lastName = req.body.ln;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/a59d930dbf";
    const options = {
        method:"POST",
        auth:"Pri:7900799a8aafa630a618a2d4b0934fe6-us12"
    }
    const request = https.request(url, options, function(response){
        // console.log(statusCode);

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });
    
    request.write(jsonData);
    request.end();

    console.log(firstName, lastName, email);
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server Running");
});

// 340623b06643bee454ccbefef9e86182-us11
// 7900799a8aafa630a618a2d4b0934fe6-us12
// a59d930dbf
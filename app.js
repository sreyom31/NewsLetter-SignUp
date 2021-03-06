const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})
app.post('/', function (req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const URL = "https://us6.api.mailchimp.com/3.0/lists/<LIST ID>";
    const options = {
        method: "POST",
        auth: "sreyom31:<API KEY>"
    }
    const request = https.request(URL, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else res.sendFile(__dirname + "/failure.html");


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});


app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("listening on port 3000");
})

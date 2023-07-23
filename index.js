// Requiring in-built https for creating
// https server
const https = require("https");
  
// Express for handling GET and POST request
const express = require("express");
const app = express();
  
// Requiring file system to use local files
const fs = require("fs");

//encryption stuffs
const crypto = require("crypto").webcrypto;
  
// Parsing the form of body to take
// input from forms
const bodyParser = require("body-parser");
const { parse } = require("path");

var valid_tokens = [];
var candidates = ["Alex Schmidt", "Ashlen Plasek", "Daniel Franzen", "Ethan Hunt", "Ewan Newbold", "Galen Newbold", "Jordan Hofstrand", "Jordin Roxberg", "Nick Mettler", "Rochester McLain", "Tanti Newbold", "Thomas Berge"];
var votes = [0,0,0,0,0,0,0,0,0,0,0,0];
var start_vote_index = 0;

var status_updates = [];

var list_of_used_tokens = [];
var list_of_used_ranks = [];

fs.readFile('./valid_tokens.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    valid_tokens = JSON.parse(data);
  });
  
// Configuring express to use body-parser
// as middle-ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
// Get request for root of the app
app.get("/", function (req, res) {
  
  // Sending index.html to the browser
  res.sendFile(__dirname + "/index.html");
});

app.get("/polling.js", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/polling.js");
  });

app.get("/style.css", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/style.css");
  });

app.get("/results.html", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/results.html");
  });

app.get("/results.js", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/results.js");
  });

app.get("/error.html", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/error.html");
  });

app.get("/vote.html", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/vote.html");
  });

app.get("/config.html", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/config.html");
  });

app.get("/config.js", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/config.js");
  });

app.get("/home.js", function (req, res) {
    
    // Sending index.html to the browser
    res.sendFile(__dirname + "/home.js");
  });

  
// Post request for geetting input from
// the form
app.post("/mssg", function (req, res) {
  
  // Logging the form body
  
  // Redirecting to the root
  res.redirect("/");
});

app.post("/request_ballot/", function (req, res) {
    
    // Redirecting to the root
    res.status(200).json({ "vote_index":start_vote_index, "candidates":candidates });
  });

app.post("/clear_votes/", function (req, res) {

    if (req.body["token"] == process.env.ACRONYM_POLLING_CONFIG_TOKEN) {
        // Redirecting to the root
        res.redirect("./config.html")
        votes = new Array(candidates.length).fill(0);
        list_of_used_tokens = [];
        list_of_used_ranks = [];
    } else {
        res.status(200).json({"message":"NOK"});
    }
  });

app.post("/change_candidates/", function (req, res) {

    if (req.body["token"] == process.env.ACRONYM_POLLING_CONFIG_TOKEN) {
        // Redirecting to the root
        
        if (Array.isArray(req.body["candidates"])) {
            candidates = req.body["candidates"]
            votes = new Array(candidates.length).fill(0);
            res.redirect("./config.html");
        } else {
            res.status(200).json({"message":"NOK"});
            console.log(req.body["candidates"]);
            console.log("Not an array!");
        }
        
    } else {
        res.status(200).json({"message":"NOK"});
        console.log("BAD AUTH!");
    }
  });

app.post("/update_index/", function (req, res) {

    if (req.body["token"] == process.env.ACRONYM_POLLING_CONFIG_TOKEN) {
        start_vote_index = parseInt(req.body["index"]);
        votes = new Array(candidates.length).fill(0);
        res.redirect("./config.html")
      } else {
        res.status(200).json({"message":"NOK"});
      }
  });

app.post("/new_status/", function (req, res) {

    if (req.body["token"] == process.env.ACRONYM_POLLING_CONFIG_TOKEN) {
        status_updates.push(req.body["message"]);
        res.redirect("./config.html")
      } else {
        res.status(200).json({"message":"NOK"});
      }
  });

app.post("/clear_status/", function (req, res) {

    if (req.body["token"] == process.env.ACRONYM_POLLING_CONFIG_TOKEN) {
        status_updates = [];
        res.redirect("./config.html")
      } else {
        res.status(200).json({"message":"NOK"});
      }
  });

app.post("/request_status/", function (req, res) {
    res.status(200).json({"message":"OK", "data": status_updates});
  });

app.post("/request_results/", function (req, res) {

    // Redirecting to the root
    res.status(200).json({ "votes":votes, "candidates":candidates });
  });

  app.post("/vote/", function (req, res) {
    parse_incoming_data(res, req);
  });

  async function parse_incoming_data(res, req) {
    var found_valid_vote = false;
    Loop1:
    for (let x in valid_tokens) {
        for (let y in arrayRange(1, parseInt(candidates.length), 1)) {
            for (let z in arrayRange(0, parseInt(candidates.length)-1, 1)) {
                var data = await compose_data(arrayRange(1, parseInt(candidates.length), 1)[y], valid_tokens[x], arrayRange(0, parseInt(candidates.length)-1, 1)[z]);
                if (data["encrypt"] == req.body["data"]) {
                    if (list_of_used_tokens.includes(data["token"] + data["index"])) {
                        found_valid_vote = false;
                        break Loop1;
                    }

                    if (list_of_used_ranks.includes(data["token"] + data["vote"])) {
                        found_valid_vote = false;
                        break Loop1;
                    }
                    votes[data["index"]-start_vote_index] += (parseInt(candidates.length) - parseInt(data["vote"]))
                    found_valid_vote = true;
                    list_of_used_tokens.push(data["token"] + data["index"]);
                    list_of_used_ranks.push(data["token"] + data["vote"]);
                    break Loop1;
                }
            }
        }
    }

    if (found_valid_vote == true) {
        res.status(200).json({ "message":"OK", "data": req.body["data"]});
    } else {
        res.status(200).json({ "message":"NOK", "data": req.body["data"]});
        
    }
  }
  
// Creating object of key and certificate
// for SSL
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};
  
// Creating https server by passing
// options and app object
https.createServer(options, app)
.listen(443, function (req, res) {
  console.log("Server started at port 443");
});








async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }
  
  async function compose_data(data, salt, index) {
    let composed_pre_hash = data.toString() + salt.toString() + index.toString();
    return {"encrypt":await digestMessage(composed_pre_hash), "vote":data, "token":salt, "index":index};
  }
  
  const arrayRange = (start, stop, step) =>
  Array.from(
  { length: (stop - start) / step + 1 },
  (value, index) => start + index * step
  );
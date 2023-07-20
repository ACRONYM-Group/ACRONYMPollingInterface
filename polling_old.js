const url = "https://127.0.0.1:8080";

ballot_data = send_post("request_ballot", ["request_ballot"]);
ballot_reference = []

voting_token = "?";

function send_vote() {
    //send_post("vote", {"vote_token": ballot_reference[0].value, "vote_index": ballot_data["vote_index"]+0, "vote_data":ballot_reference[2].value});
    for (x in ballot_data["voters"]) {
        console.log(x);
        send_post("vote", {"vote_token": voting_token.value, "vote_index": ballot_data["vote_index"]+x, "vote_data":ballot_reference[x].value});
    }
    update_ballot_data();
}

function send_post(request_type, data) {
    fetch(url + "/" + request_type + "/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Response:", data);
          if (request_type == "request_ballot") {
            ballot_data = data;
            update_ballot_data();
          }

          //return data;
        })
        .catch(error => {
          console.error("Error:", error);
        });
}

function update_ballot_data() {
    document.getElementById("form").innerHTML = "";
    ballot_reference = [];

    voting_token = add_new_ballot_line(16, 1, "Voting Token", false);
    add_new_ballot_blank();
    for (x in ballot_data["voters"]) {
        add_new_ballot_line(2, 1, ballot_data["voters"][x], true);
    }

}

function add_new_ballot_line(cols, rows, name, store_ref) {
    outer_div = document.createElement("div");
    outer_div.className = "ballot_line";

    label = document.createElement("label");
    label.innerHTML = name;

    textarea = document.createElement("textarea");
    textarea.className = "ballot_text_area";
    textarea.cols = cols;
    textarea.rows = rows;

    outer_div.appendChild(label);
    outer_div.appendChild(textarea);

    document.getElementById("form").appendChild(outer_div, document.getElementById("insert_point"));

    if (store_ref) { 
        ballot_reference.push(textarea);
    }

    return textarea;
}

function add_new_ballot_blank() {
    outer_div = document.createElement("br");
    document.getElementById("form").appendChild(outer_div, document.getElementById("insert_point"));
}
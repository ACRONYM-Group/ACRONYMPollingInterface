const url = "https://polling.scienceandpizza.com";

ballot_data = send_post("request_ballot", ["request_ballot"]);
ballot_reference = []

voting_token = add_new_ballot_line(16, 1, "Config Token", false);
candidates_list = add_new_ballot_line(16, 16, "Candidates List", false);
status_update = add_new_ballot_line(32, 8, "Status Update", false);


function update_candidates() {
    send_post("change_candidates", {"candidates": candidates_list.value.split("\n"), "token":voting_token.value});
}

function clear_votes() {
    send_post("clear_votes", {"candidates": candidates_list.value, "token":voting_token.value});
}

function update_index() {
    send_post("update_index", {"index": index_number.value, "token":voting_token.value});
}

function send_status() {
    send_post("new_status", {"message": status_update.value, "token":voting_token.value});
}

function clear_status() {
    send_post("clear_status", {"token":voting_token.value});
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
          if (data["message"] == "NOK") {
            window.location.href = url + '/error.html';
          }

          //return data;
        })
        .catch(error => {
          console.error("Error:", error);
        });
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
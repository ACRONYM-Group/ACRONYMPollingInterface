
const url = "https://127.0.0.1:8080";

function request_updates() {
    send_post("request_status");
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
          if (request_type == "request_status") {
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

    for (var x = ballot_data["data"].length - 1; x >= 0; x--) {
        add_new_ballot_line(2, 1, ballot_data["data"][x], true);
    }

}

function add_new_ballot_line(cols, rows, name, store_ref) {
    outer_div = document.createElement("div");
    outer_div.className = "status_line";

    label = document.createElement("label");
    label.innerHTML = name;

    outer_div.appendChild(label);

    document.getElementById("form").appendChild(outer_div, document.getElementById("insert_point"));
}

function add_new_ballot_blank() {
    outer_div = document.createElement("br");
    document.getElementById("form").appendChild(outer_div, document.getElementById("insert_point"));
}

request_updates();
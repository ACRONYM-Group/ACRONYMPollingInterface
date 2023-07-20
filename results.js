
const url = "https://polling.scienceandpizza.com";

function request_updates() {
    send_post("request_results");
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
          if (request_type == "request_results") {
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

    for (x in ballot_data["candidates"]) {
        add_new_ballot_line(2, 1, ballot_data["candidates"][x], ballot_data["votes"][x], true);
    }

}

function add_new_ballot_line(cols, rows, name, number, store_ref) {
    outer_div = document.createElement("div");
    outer_div.className = "ballot_line";

    label = document.createElement("label");
    label.innerHTML = name;

    result_area = document.createElement("label");
    result_area.innerHTML = number;
    result_area.className = "ballot_text_area";

    outer_div.appendChild(label);
    outer_div.appendChild(result_area);

    document.getElementById("form").appendChild(outer_div, document.getElementById("insert_point"));
}

function add_new_ballot_blank() {
    outer_div = document.createElement("br");
    document.getElementById("form").appendChild(outer_div, document.getElementById("insert_point"));
}

request_updates();
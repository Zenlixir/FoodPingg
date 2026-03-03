function addFood() {
    let name = document.getElementById("foodName").value;
    let date = document.getElementById("expiryDate").value;

    if (name === "" || date === "") {
        alert("Sila masukkan nama dan tarikh luput!");
        return;
    }

    let parts = date.split("/");
    if (parts.length !== 3) {
        alert("Format tarikh mesti DD/MM/YY");
        return;
    }

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let year = 2000 + parseInt(parts[2], 10);

    let expiryDate = new Date(year, month, day);
    let now = new Date();
    now.setHours(0,0,0,0);

    let diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    let table = document.getElementById("foodTable");
    let row = table.insertRow();

    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = date;

    let statusCell = row.insertCell(2);

    // 🔥 STATUS + WARNA + KIRAAN HARI
    if (diffDays > 3) {
        statusCell.innerHTML = "🟢 Lagi " + diffDays + " hari";
        statusCell.style.color = "green";
    } 
    else if (diffDays > 0) {
        statusCell.innerHTML = "🟡 Lagi " + diffDays + " hari";
        statusCell.style.color = "orange";
    } 
    else if (diffDays === 0) {
        statusCell.innerHTML = "🔴 Expired Hari Ini";
        statusCell.style.color = "red";
        row.classList.add("expired-row");
    } 
    else {
        statusCell.innerHTML = "🔴 Expired";
        statusCell.style.color = "red";
        row.classList.add("expired-row");
    }

    // 🔹 BUTTON DELETE (Sudah Diambil)
    let delCell = row.insertCell(3);
    let delBtn = document.createElement("button");
    delBtn.innerHTML = "Delete";
    delBtn.style.backgroundColor = "#007bff";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.borderRadius = "5px";
    delBtn.style.padding = "5px 10px";
    delBtn.style.cursor = "pointer";

    delBtn.onclick = function() {
        table.deleteRow(row.rowIndex);
    };

    delCell.appendChild(delBtn);

    // Clear input
    document.getElementById("foodName").value = "";
    document.getElementById("expiryDate").value = "";
}

// 🔹 BUTTON DELETE ALL EXPIRED
function deleteAllExpired() {
    let table = document.getElementById("foodTable");

    for (let i = table.rows.length - 1; i > 0; i--) {
        let row = table.rows[i];
        let statusText = row.cells[2].innerText;

        if (statusText.includes("Expired")) {
            table.deleteRow(i);
        }
    }
}

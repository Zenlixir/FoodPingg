document.addEventListener("DOMContentLoaded", function () {
    renderTable();
});

function getFoods() {
    return JSON.parse(localStorage.getItem("foods")) || [];
}

function saveFoods(foods) {
    localStorage.setItem("foods", JSON.stringify(foods));
}

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

    let foods = getFoods();
    foods.push({ name, date });
    saveFoods(foods);

    renderTable();

    document.getElementById("foodName").value = "";
    document.getElementById("expiryDate").value = "";
}

function parseDate(dateStr) {
    let parts = dateStr.split("/");
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let yearRaw = parseInt(parts[2], 10);

    let year = yearRaw < 100 ? 2000 + yearRaw : yearRaw;

    return new Date(year, month, day);
}

function renderTable() {
    let table = document.getElementById("foodTable");

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    let foods = getFoods();

    foods.forEach((food, index) => {
        let expiryDate = parseDate(food.date);
        let now = new Date();
        now.setHours(0, 0, 0, 0);

        let diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        let row = table.insertRow();
        row.insertCell(0).innerHTML = food.name;
        row.insertCell(1).innerHTML = food.date;

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
        delBtn.style.backgroundColor = "rgb(90 35 55)";
        delBtn.style.color = "white";
        delBtn.style.border = "none";
        delBtn.style.borderRadius = "16px";
        delBtn.style.padding = "5px 10px";
        delBtn.style.cursor = "pointer";

        delBtn.onclick = function () {
            foods.splice(index, 1);
            saveFoods(foods);
            renderTable();
        };

        delCell.appendChild(delBtn);
    });
}

// 🔹 BUTTON DELETE ALL EXPIRED
function deleteAllExpired() {
    let foods = getFoods();

    let updatedFoods = foods.filter(food => {
        let expiryDate = parseDate(food.date);
        let now = new Date();
        now.setHours(0, 0, 0, 0);

        return expiryDate >= now;
    });

    saveFoods(updatedFoods);
    renderTable();
}


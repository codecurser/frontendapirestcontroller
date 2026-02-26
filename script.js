const baseURL = "http://localhost:8080/users";

function showDashboard() {
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("usersPage").classList.add("hidden");
}

function showUsers() {
    document.getElementById("usersPage").classList.remove("hidden");
    document.getElementById("dashboard").classList.add("hidden");
    loadUsers();
}

function openModal() {
    document.getElementById("userModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("userModal").classList.add("hidden");
}

function showRateLimit() {
    const banner = document.getElementById("rateLimitBanner");
    banner.innerText = "🚫 Rate Limit Exceeded! Please wait.";
    banner.classList.remove("hidden");
}

async function loadUsers() {
    try {
        const res = await fetch(baseURL);
        if (res.status === 429) {
            showRateLimit();
            return;
        }
        const data = await res.json();

        document.getElementById("totalUsers").innerText = data.length;

        const table = document.getElementById("userTable");
        table.innerHTML = "";

        data.forEach(user => {
            table.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
    }
}

async function addUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
        const res = await fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });

        if (res.status === 429) {
            showRateLimit();
            return;
        }

        closeModal();
        loadUsers();
    } catch (err) {
        console.error(err);
    }
}

async function deleteUser(id) {
    try {
        const res = await fetch(`${baseURL}/${id}`, {
            method: "DELETE"
        });

        if (res.status === 429) {
            showRateLimit();
            return;
        }

        loadUsers();
    } catch (err) {
        console.error(err);
    }
}

loadUsers();

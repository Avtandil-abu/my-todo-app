import "./style.css"

const button = document.getElementById("send-btn");
const myInput = document.getElementById("myInput");
const myDiv = document.getElementById("container");

async function myTodo() {

    try {
        const response = await fetch("http://localhost:3000/api/todos");
        const getData = await response.json();
        console.log("წამოსაღები დავალებები:", getData);
        myDiv.innerHTML = "";

        getData.forEach(todo => renderSingleTodo(todo));

    } catch (error) {
        console.error("შეცდომა მონაცემების წამოღებისას:", error);

    }

}

myTodo();
async function addTodo() {
    const taskTitle = myInput.value.trim();
    if (taskTitle === "") {
        alert("სათაური სვალდებულოა");
        return;
    }
    try {
        button.disabled = true;
        button.innerText = "igzavneba...";

        const response = await fetch("http://localhost:3000/api/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: taskTitle
            })
        });
        const data = await response.json();

        if (response.status === 201) {
            renderSingleTodo(data);
            myInput.value = "";
        } else if (response.status === 400) {
            alert("shecdoma: " + data.error);
            console.error("detalebi:", data);
        }
    } catch (error) {
        alert("ragac gafuchda:");
    } finally {
        button.disabled = false;
        button.innerText = "damateba";
    }
    //console.error("shecdomaa", errorData.error);
}
function renderSingleTodo(todo) {
    const todoBox = document.createElement("div");
    todoBox.className = "flex items-center justify-between bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all animate-pop";

    const leftSide = document.createElement("div");
    leftSide.className = "flex items-center gap-4";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.className = "w-5 h-5 cursor-pointer accent-blue-500";

    const p = document.createElement("p");
    p.innerText = todo.title;
    p.className = todo.done
        ? "line-through text-gray-400 italic"
        : "text-gray-700 font-semibold text-lg";

    checkbox.addEventListener("change", async () => {
        try {
            const updated = await updateTodo(todo.id, {
                title: todo.title,
                done: checkbox.checked
            });
            ;
            p.className = updated.done ? "line-through text-gray-400 italic" : "text-gray-700 font-semibold text-lg";
            todo.done = updated.done;

        } catch (error) {
            alert("შეცდომა: " + error.message);
            checkbox.checked = !checkbox.checked;
        }
    });

    const delBtn = document.createElement("button");
    delBtn.innerText = "წაშლა";
    delBtn.className = "bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold";

    delBtn.addEventListener("click", () =>
        deleteTodo(todo.id, todoBox));
    console.log("ეს არი წასაშლელი ელემენტის აიდი:", todo.id)

    //todoBox.appendChild(checkbox);
    //todoBox.appendChild(p);
    leftSide.append(checkbox, p);
    todoBox.append(leftSide, delBtn);
    myDiv.appendChild(todoBox);
}

async function updateTodo(id, updateData) {
    try {
        const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
        });
        const data = await response.json();

        if (response.status === 200) {
            return data;
        } else {
            throw new Error(data.error || "mocemuli ID s davaleba ar arsebobs")
        }
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
}
async function deleteTodo(id, elementToRemove) {
    try {
        const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (response.status === 200) {
            elementToRemove.style.transition = "all 0.3s ease";
            elementToRemove.style.opacity = "0";
            elementToRemove.style.transform = "translateX(30px)";

            setTimeout(() => {
                elementToRemove.remove();
            }, 300);

            console.log("waishala:", data.message);
        } else if (response.status === 404) {
            alert("მოცემული ID ს დავალება არ არსებობს!");
            console.error("Error:", data.error);
        }
    } catch (error) {
        alert("ver waishala");
    }
}
function createProfileCard() {
    const card = document.createElement("div");
    card.className = "card-container";

    const img = document.createElement("img");
    img.src = "https://randomuser.me/api/portraits/men/1.jpg";
    img.className = "profile-img";

    const name = document.createElement("h2");
    name.innerText = "ლევან აბუაშვილი";
    name.className = "user-name";

    const status = document.createElement("span");
    status.innerText = "Online";
    status.className = "user-status";

    card.append(img, name, status);
    document.getElementById("profile-container").appendChild(card);
}

createProfileCard();

function renderPricingCard() {
    const container = document.getElementById("pricing-container");
    container.innerHTML = "";
    container.className = "p-6 space-y-4 bg-blue-500 flex flex-col items-center border border-red-200 border-2 rounded-3xl w-96";

    const card = document.createElement("div");
    card.className = "rounded-3xl bg-purple-500 shadow-xl flex flex-col items-stretch border-2 p-8 space-y-4";

    const title = document.createElement("h3");
    title.innerText = "Pro Plan";
    title.className = "text-3xl text-center";

    const price = document.createElement("h1");
    price.innerText = "$29 / თვე";
    price.className = "text-xl text-center font-bold text-blue-700";

    const line1 = document.createElement("span");
    line1.innerText = "✅ Unlimited Projects";
    line1.className = "text-gray-600 text-sm";

    const line2 = document.createElement("span");
    line2.innerText = "✅ 24/7 Support";
    line2.className = "text-gray-600 text-sm";

    const line3 = document.createElement("span");
    line3.innerText = "✅ Advanced Analytics";
    line3.className = "text-gray-600 text-sm";

    const getStartedBtn = document.createElement("button");
    getStartedBtn.innerText = "Get Started";
    getStartedBtn.className = "cursor-pointer rounded-3xl border-2 w-full bg-blue-500 text-white hover:bg-blue-700 p-2";

    getStartedBtn.addEventListener("click", () => {
        alert("თქვენ აირჩიეთ პრო პლანი!");
    });

    card.append(title, price, getStartedBtn, line1, line2, line3);
    container.appendChild(card);
}
renderPricingCard();

myInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addTodo();
    }
});
button.addEventListener("click", addTodo);

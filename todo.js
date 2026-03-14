

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function renderTodos() {
  list.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    li.textContent = todo.text;

    li.addEventListener("click", () => {
      todos[index].completed = !todos[index].completed;
      saveAndRender();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.setAttribute("aria-label", "Delete task");

    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      todos.splice(index, 1);
      saveAndRender();
    });

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(todos));
  renderTodos();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = input.value.trim();

  if (taskText === "") return;

  todos.push({ text: taskText, completed: false });
  input.value = "";
  saveAndRender();
});

renderTodos();

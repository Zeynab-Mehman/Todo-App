// Get todo input and list
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const filterButtons = document.querySelector(".btn-group");
const clearCompletedButton = document.querySelector("#clear-completed");

// Add event listener to form submit
document.querySelector("#todo-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission
  const task = todoInput.value;
  if (task !== "") {
    addTask(task);
    todoInput.value = ""; // Clear the input
    filterButtons.style.display = "flex"; // Show the filter buttons
    clearCompletedButton.style.display = "block"; // Show the clear completed button
  }
});

// Add event listener to list for click events
todoList.addEventListener("click", function (e) {
  const target = e.target;
  const parent = target.parentElement;
  const taskId = parent.getAttribute("data-id");

  // Check if the clicked element is a remove button
  if (target.classList.contains("remove")) {
    removeTask(taskId);
  }

  // Check if the clicked element is a task checkbox
  if (target.classList.contains("task-checkbox")) {
    const completed = target.checked;
    toggleTaskCompletion(taskId, completed);
  }
});

// Add event listener to filter buttons
document.querySelector("#all-tasks").addEventListener("click", function () {
  filterTasks("all");
});
document.querySelector("#active-tasks").addEventListener("click", function () {
  filterTasks("active");
});
document.querySelector("#completed-tasks").addEventListener("click", function () {
  filterTasks("completed");
});

// Add event listener to clear completed button
clearCompletedButton.addEventListener("click", function () {
  removeCompletedTasks();
});

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", function () {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  for (const task of storedTasks) {
    addTaskToDOM(task.id, task.task, task.completed);
  }
  filterTasks("all"); // Apply the "All" filter initially
  if (storedTasks.length === 0) {
    filterButtons.style.display = "none"; // Hide the filter buttons
    clearCompletedButton.style.display = "none"; // Hide the clear completed button
  }
});

// Add a new task
function addTask(task) {
  const taskId = Date.now().toString(); // Generate a unique ID for the task
  const newTask = {
    id: taskId,
    task: task,
    completed: false
  };

  addTaskToDOM(taskId, task, false);
  saveTask(newTask);
}

// Add task to the DOM
function addTaskToDOM(taskId, task, completed) {
    if (task) {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.setAttribute("data-id", taskId);
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "mr-3 task-checkbox";
      checkbox.checked = completed;
  
      const taskText = document.createElement("span");
      taskText.innerText = task;
      if (completed) {
        listItem.classList.add("completed");
      }
  
      const removeButton = document.createElement("button");
      removeButton.className = "btn btn-danger btn-sm remove";
      removeButton.innerText = "Remove";
  
      listItem.appendChild(checkbox);
      listItem.appendChild(taskText);
      listItem.appendChild(removeButton);
  
      todoList.appendChild(listItem);
    }
  }
  

// Save task to local storage
function saveTask(task) {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(storedTasks));
}

// Toggle task completion
function toggleTaskCompletion(taskId, completed) {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = storedTasks.find(t => t.id === taskId);
  if (task) {
    task.completed = completed;
    if (completed) {
      document.querySelector(`li[data-id="${taskId}"]`).classList.add("completed");
    } else {
      document.querySelector(`li[data-id="${taskId}"]`).classList.remove("completed");
    }
    localStorage.setItem("tasks", JSON.stringify(storedTasks));
  }
}

// Remove a task
function removeTask(taskId) {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = storedTasks.filter(t => t.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  document.querySelector(`li[data-id="${taskId}"]`).remove();
}

// Filter tasks based on completion status
function filterTasks(status) {
  const tasks = Array.from(document.querySelectorAll(".list-group-item"));
  tasks.forEach(task => {
    const taskId = task.getAttribute("data-id");
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedTask = storedTasks.find(t => t.id === taskId);
    if (status === "all") {
      task.style.display = "block";
    } else if (status === "active") {
      task.style.display = storedTask && !storedTask.completed ? "block" : "none";
    } else if (status === "completed") {
      task.style.display = storedTask && storedTask.completed ? "block" : "none";
    }
  });
}

// Remove all completed tasks
function removeCompletedTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = storedTasks.filter(t => !t.completed);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  filterTasks("all");
}

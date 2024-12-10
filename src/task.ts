const input = document.querySelector<HTMLInputElement>(".form-input");
const addBtn = document.querySelector<HTMLButtonElement>(".add-btn");
const allTasksDiv = document.querySelector<HTMLUListElement>(".task-list");

let taskId = 1;

type Task = {
  id: number;
  task: string;
  completed: boolean;
};

const getTasks = (): Task[] => {
  const storedItems = localStorage.getItem("tasks");
  if (storedItems) {
    const allTasks: Task[] = JSON.parse(storedItems);
    return allTasks;
  }
  return [];
};

const tasks: Task[] = getTasks();

const addTask = (task: Task): void => {
  tasks.push(task);
  updateStorage();
  displayTask();
};

const deleteTask = (element: HTMLElement): void => {
  const taskIdToDelete = parseInt(element.closest("li")?.id || "0");
  const taskIndex = tasks.findIndex((task) => task.id === taskIdToDelete);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    updateStorage();
    displayTask();
  }
};

const completedTask = (element: HTMLElement): void => {
  console.log(element.parentElement?.children[1].classList)
  
  const taskIdToComplete = parseInt(element.closest("li")?.id || "0");
  const task = tasks.find((task) => task.id === taskIdToComplete);
  if (task) {
    task.completed = !task.completed; // Toggle the completed status
    element.parentElement?.children[1].classList.add('cross')
    updateStorage(); // Update local storage
    displayTask(); // Re-render the task list
  }
};

addBtn?.addEventListener("click", () => {
  if (!input?.value) {
    alert("Task field cannot be empty");
    return;
  }
  const task: Task = {
    id: taskId++,
    task: input.value,
    completed: false,
  };
  addTask(task);
  input.value = "";
});

const updateStorage = (): void => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const displayTask = (): void => {
  allTasksDiv!.innerHTML = ""; // Clear the existing task list before re-rendering

  tasks.forEach((task) => {
    const li: HTMLLIElement = document.createElement("li");
    li.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "bg-gray-50",
      "border",
      "border-gray-300",
      "rounded-lg",
      "px-4",
      "py-2",
      "shadow"
    );
    li.id = task.id.toString();

    // Create the inner div (for the checkbox and label)
    const div = document.createElement("div");
    div.classList.add("flex", "items-center");

    // Create the checkbox input
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `taskCheckbox-${task.id}`;
    checkbox.classList.add(
      "h-5",
      "w-5",
      "text-blue-500",
      "focus:ring-blue-400",
      "focus:ring-2",
      "rounded"
    );
    checkbox.checked = task.completed;

    // Create the label for the checkbox
    const label = document.createElement("label");
    label.setAttribute("for", `taskCheckbox-${task.id}`);
    label.classList.add("ml-3", "text-gray-800");
    label.textContent = task.task;

    // Append the checkbox and label to the div
    div.appendChild(checkbox);
    div.appendChild(label);

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "text-red-500",
      "hover:text-red-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-red-400"
    );
    deleteButton.id = "delete";
    deleteButton.textContent = "Delete";

    // Append the div and button to the `li`
    li.appendChild(div);
    li.appendChild(deleteButton);

    // Append the `li` to the taskDiv
    allTasksDiv?.appendChild(li);
  });
};
displayTask();

allTasksDiv?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.id === "delete") {
    deleteTask(target);
  } else if (target.closest("input[type='checkbox']")) {
    completedTask(target);
  }
});

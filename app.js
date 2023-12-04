import { initDB, addTask, getAllTasks } from './db';

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const dateInput = document.getElementById('dateInput');
  const photoInput = document.getElementById('photoInput');
  const taskList = document.getElementById('taskList');

  window.addTask = () => {
    const taskTitle = taskInput.value.trim();
    const taskDescription = descriptionInput.value.trim();
    const taskDate = dateInput.value.trim();
    const taskPhoto = photoInput.files[0];

    if (taskTitle !== '') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const task = {
            title: taskTitle,
            description: taskDescription,
            date: taskDate,
            photo: taskPhoto,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            },
            timestamp: new Date().toLocaleString()
          };

          addTask(task);
          clearInputs();
          loadTasks();
        },
        (error) => {
          console.error('Erro ao obter a localização:', error);

          const taskWithoutLocation = {
            title: taskTitle,
            description: taskDescription,
            date: taskDate,
            photo: taskPhoto,
            timestamp: new Date().toLocaleString()
          };

          addTask(taskWithoutLocation);
          clearInputs();
          loadTasks();
        }
      );
    }
  };

  function clearInputs() {
    taskInput.value = '';
    descriptionInput.value = '';
    dateInput.value = '';
    photoInput.value = '';
  }

  function loadTasks() {
    getAllTasks((tasks) => {
      renderTasks(tasks);
    });
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';

    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${task.title}</strong><br>
        Descrição: ${task.description}<br>
        Data: ${task.date}<br>
        Localização: ${task.location ? `Lat: ${task.location.latitude}, Lon: ${task.location.longitude}` : 'N/A'}<br>
        <img src="${task.photo ? URL.createObjectURL(task.photo) : ''}" alt="Task Photo" width="100">
      `;
      taskList.appendChild(li);
    });
  }

  // Initialize the DB
  initDB();

  // Load tasks initially
  loadTasks();
});

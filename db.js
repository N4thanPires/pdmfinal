let db;

export function initDB() {
  const request = indexedDB.open('TarefasDB', 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore('tarefas', { keyPath: 'id', autoIncrement: true });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
  };

  request.onerror = (event) => {
    console.error('Erro ao abrir o banco de dados:', event.target.error);
  };
}

export function addTask(task) {
  const transaction = db.transaction(['tarefas'], 'readwrite');
  const store = transaction.objectStore('tarefas');
  const request = store.add(task);

  request.onsuccess = () => {
    console.log('Tarefa adicionada com sucesso:', task);
  };

  request.onerror = (event) => {
    console.error('Erro ao adicionar a tarefa:', event.target.error);
  };
}

export function getAllTasks(callback) {
  const transaction = db.transaction(['tarefas'], 'readonly');
  const store = transaction.objectStore('tarefas');
  const request = store.getAll();

  request.onsuccess = () => {
    const tasks = request.result;
    callback(tasks);
  };

  request.onerror = (event) => {
    console.error('Erro ao obter as tarefas:', event.target.error);
    callback([]);
  };
}

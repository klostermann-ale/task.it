const express = require('express');
const app = express();
const fs = require('fs')

app.use(express.json());
app.use(express.static('public'));


let tasks = [];

// Carrega as tarefas salvas no arquivo JSON
function loadTasks() {
  try {
    const data = fs.readFileSync('tasks.json', 'utf8');
    tasks = JSON.parse(data);
  } catch (error) {
    tasks = [];
  }
}

// Salva as tarefas no arquivo JSON
function saveTasks() {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
}

// Carrega as tarefas ao iniciar o servidor
loadTasks();


app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  const newTask = { id: Date.now(), title, status: 'pendente' };
  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});


app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
  if (title) task.title = title;
  if (status) task.status = status;
  saveTasks();
  res.json(task);
});


app.delete('/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  saveTasks();
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000 ');
});

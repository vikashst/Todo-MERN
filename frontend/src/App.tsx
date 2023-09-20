import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setTodos(res.data);
    });
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    axios.post(API_URL, { text: newTodo, completed: false }).then((res) => {
      setTodos([...todos, res.data]);
      setNewTodo('');
    });
  };

  const toggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    );
    axios.put(`${API_URL}/${id}`, { completed: updatedTodos }).then(() => {
      setTodos(updatedTodos);
    });
  };

  const deleteTodo = (id: string) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    });
  };

  return (
    <div className="App">
      <h1>MERN Todo App</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              className={todo.completed ? 'completed' : ''}
              onClick={() => toggleComplete(todo._id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

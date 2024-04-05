document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const descInput = document.getElementById('descInput');
    const todosContainer = document.getElementById('todos');
    const completedTodosContainer = document.getElementById('completedTodos');
    const API_ENDPOINT = 'https://crudcrud.com/api/93417e36b99147c9b7982aa779b1fc59/myTodo';

    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const todo = todoInput.value.trim();
        const desc = descInput.value.trim();
        if (todo !== '') {
            addTodoToList(todo, desc);
            todoInput.value = '';
            descInput.value = '';
        }
    });

    todosContainer.addEventListener('click', handleClick);
    completedTodosContainer.addEventListener('click', handleClick);

    displayTodos();

    function addTodoToList(todo, desc) {
        const newTodo = {
            todo,
            desc,
            completed: false
        };
        fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add todo');
                }
                displayTodos();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayTodos() {
        fetch(API_ENDPOINT)
            .then(response => response.json())
            .then(data => {
                todosContainer.innerHTML = '';
                completedTodosContainer.innerHTML = '';
                data.forEach(todo => {
                    const li = document.createElement('li');
                    li.dataset.id = todo._id;
                    li.innerHTML = `
                    <span>${todo.todo} - ${todo.desc}</span>
                    <button class="toggle">${todo.completed ? 'Undo' : 'Done'}</button>
                    <button class="delete">Delete</button>
                `;
                    if (todo.completed) {
                        completedTodosContainer.appendChild(li);
                    } else {
                        todosContainer.appendChild(li);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function deleteTodo(id) {
        fetch(`${API_ENDPOINT}/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete todo');
                }
                displayTodos();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function toggleTodoStatus(id) {
        fetch(`${API_ENDPOINT}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch todo details');
                }
                return response.json();
            })
            .then(todo => {
                const updatedTodo = {
                    todo: todo.todo,
                    desc: todo.desc,
                    completed: !todo.completed
                };
                return fetch(`${API_ENDPOINT}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedTodo)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update todo status');
                }
                displayTodos();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function handleClick(event) {
        const id = event.target.parentElement.dataset.id;
        if (event.target.classList.contains('delete')) {
            deleteTodo(id);
        } else if (event.target.classList.contains('toggle')) {
            toggleTodoStatus(id);
        }
    }
});
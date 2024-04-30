document.addEventListener('DOMContentLoaded', async function() {
    const todoForm = document.getElementById('todoForm');
    const todoInput = document.getElementById('todoInput');
    const descInput = document.getElementById('descInput');
    const todosContainer = document.getElementById('todos');
    const completedTodosContainer = document.getElementById('completedTodos');
    const API_ENDPOINT = 'https://crudcrud.com/api/ee49fc426d5149858855b53e57b8e0bf/myTodo';

    async function addTodoToList(todo, desc) {
        const newTodo = {
            todo,
            desc,
            completed: false
        };
        try {
            await axios.post(API_ENDPOINT, newTodo);
            await displayTodos();
        } catch (err) {
            console.log(err);
        }
    }

    async function displayTodos() {
        try {
            const response = await axios.get(API_ENDPOINT);
            todosContainer.innerHTML = '';
            completedTodosContainer.innerHTML = '';
            let count = 0;
            response.data.forEach(todo => {
                const li = document.createElement('li');
                li.dataset.id = todo._id;
                
                li.innerHTML = `
                    <span><strong>${todo.todo}</strong> - ${todo.desc}</span>
                    <button class="toggle">${todo.completed ? 'Undo' : 'Mark as done'}</button>
                    <button class="delete">Delete</button>
                `;
                if (todo.completed) {
                    completedTodosContainer.appendChild(li);
                } else {
                    todosContainer.appendChild(li);
                }
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function deleteTodo(id) {
        try {
            await axios.delete(`${API_ENDPOINT}/${id}`);
            await displayTodos();
        } catch (err) {
            console.log(err);
        }
    }

    async function toggleTodoStatus(id) {
        try {
            const response = await axios.get(`${API_ENDPOINT}/${id}`);
            const todo = response.data;
            const updatedTodo = {
                todo: todo.todo,
                desc: todo.desc,
                completed: !todo.completed
            };
            await axios.put(`${API_ENDPOINT}/${id}`, updatedTodo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await displayTodos();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function handleClick(event) {
        const id = event.target.parentElement.dataset.id;
        if (event.target.classList.contains('delete')) {
            deleteTodo(id);
        } else if (event.target.classList.contains('toggle')) {
            toggleTodoStatus(id);
        }
    }

    todoForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const todo = todoInput.value.trim();
        const desc = descInput.value.trim();
        if (todo !== '') {
            await addTodoToList(todo, desc);
            todoInput.value = '';
            descInput.value = '';
        }
    });

    todosContainer.addEventListener('click', handleClick);
    completedTodosContainer.addEventListener('click', handleClick);
    await displayTodos();
});

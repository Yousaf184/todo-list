const Storage = (() => {
    function saveToLocalStorage(todoText) {
        let todos = readFromLocalStorage();

        // empty local storage
        if (!todos) todos = [];

        const todo = { id: Date.now(), text: todoText, completed: false };
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        return todo;
    }

    function readFromLocalStorage() {
        const todos = localStorage.getItem('todos');
        return !todos ? [] : JSON.parse(todos);
    }

    function removeFromLocalStorage(todoID) {
        let todos = readFromLocalStorage();
        todos = todos.filter(t => t.id != todoID);

        if (todos.length === 0) {
            localStorage.removeItem('todos');
            return;
        }

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function toggleTodoCompleteStatus(todoID) {
        let todos = readFromLocalStorage();

        todos = todos.map(t => {
            if (t.id == todoID) t.completed = !t.completed;
            return t;
        });

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    return { readFromLocalStorage, saveToLocalStorage, removeFromLocalStorage, toggleTodoCompleteStatus };
})();

const UI = ((Storage) => {
    const $container = document.querySelector('.container');
    const $btn = document.getElementById('btn');
    const $inputField = document.querySelector('.input-field');

    $inputField.addEventListener('keyup', (e) => {
        // if ENTER key pressed
        if (e.keyCode === 13) {
            saveTodo($inputField.value);
        }
    });

    $btn.addEventListener('click', (e) => saveTodo($inputField.value));

    $container.addEventListener('click', (e) => {
        const $todo = e.target.parentElement.parentElement;

        if (e.target.classList.contains('fa-trash')) {
            const $todo = e.target.parentElement.parentElement;
            $todo.remove();
            // remove from local storage
            Storage.removeFromLocalStorage(getTodoID($todo));
            return;
        }

        if (e.target.nodeName === 'I') {
            $todo.classList.toggle('completed');
            e.target.classList.toggle('fa-times');
            e.target.classList.toggle('fa-check');
            // change todo complete status in local storage
            Storage.toggleTodoCompleteStatus(getTodoID($todo));
        }
    });

    function saveTodo(todoText) {
        if (todoText !== '') {
            const todo = Storage.saveToLocalStorage(todoText);
            $container.insertAdjacentHTML('beforeend', getTodoHTMLMarkup(todo));
            $inputField.value = '';
        }
    }

    function getTodoID($todo) {
        return $todo.querySelector('.todo-id').textContent;
    }

    function getTodoHTMLMarkup(todo) {
        return `
            <div class="${todo.completed ? 'todo completed' : 'todo'}">
                <span>
                <span class="todo-id">${todo.id}</span>
                <span>${todo.text}</span>
                </span>
                <div class="todo-actions">
                <i class="${todo.completed ? 'fas fa-times' : 'fas fa-check'}"></i>
                <i class="fas fa-trash"></i>
                </div>
            </div>
        `;
    }

    return {
        container: $container,
        inputField: $inputField,
        getTodoHTMLMarkup
    };
})(Storage);

const App = ((Storage, UI) => {
    function initApp() {
        const todos = Storage.readFromLocalStorage();
        if (todos.length === 0) return;
        todos.forEach(t => UI.container.insertAdjacentHTML('beforeend', UI.getTodoHTMLMarkup(t)));
    }

    return { initApp };
})(Storage, UI);

App.initApp();
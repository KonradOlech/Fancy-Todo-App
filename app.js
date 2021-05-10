// Selectors
const newTodoInput = document.getElementById('newTodoInput');
const todoList = document.getElementById('todoList')

let todos = [];

function createTodo(todosArr, input) {
    const newTodo = {
        id: generateId(todosArr),
        isDone: false,
        content: input.value
    }

    todosArr.push(newTodo)
    reloadTodos(todosArr)
    showRemainingCounter(todos)

}

function getTodo(input) {
    const id = Number(input.dataset.todoId);
    const isDone = input.querySelector('.checkbox').checked;
    const content = input.querySelector('.newTodoInput').value;

    return {id, isDone, content}

}

function reloadTodos(todosArr) {
    todoList.innerHTML = ''
    todosArr.forEach(todo => buildTodoComponent(todo))
}

function generateId(arr) {
    const allId = arr.map(i => i.id);
    let newId;
    do {
        newId = Math.floor(Math.random() * 256);
    } while (allId.includes(newId));

    return newId
}

function deleteTodo(item, todosArr) {
    todos = todosArr.filter(x => x.id !== item.id);
     showRemainingCounter(todos)
}

function deleteCompletedTodos(todosArr) {
    const newTodos = filterTodos(todosArr, 'active');
    console.log(newTodos)
}

function changeTodo(item, todosArr) {
    todos = todosArr.map(todo => (todo.id === item.id) ? item : todo);
    showRemainingCounter(todos)
}

function showRemainingCounter(todosArr) {
    const uncompletedTodos = todosArr.filter(todo => todo.isDone === false);
    const counter = document.getElementById('remainingCounter');
    counter.innerText = `${uncompletedTodos.length} items left`

}

function filterTodos(todosArr, filter) {
    let filteredTodos;
    switch (filter) {
        case 'all':
            filteredTodos = todosArr;
            break;
        
        case 'active':
            filteredTodos = todosArr.filter(todo => todo.isDone === false);
            break;
        
        case 'completed':
            filteredTodos = todosArr.filter(todo => todo.isDone === true);
            break;
    }

    return filteredTodos
}




function buildTodoComponent(props) {
    const { id, isDone, content } = props;
    const todo = document.createElement('div');
    todo.classList.add('todo-item');
    todo.dataset.todoId = id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = 'done'
    checkbox.defaultChecked = isDone;
    checkbox.classList.add('checkbox');

    checkbox.addEventListener('click', e => changeTodo(getTodo(e.target.parentNode), todos))

    const text = document.createElement('input');
    text.type = 'text';
    text.value = content;
    text.classList.add('newTodoInput');

    text.addEventListener('keydown', e => {
        if (e.key === "Enter") {
            changeTodo(getTodo(e.target.parentNode), todos)
        }
    })

    const deleteBtn = document.createElement('a');
    deleteBtn.classList.add('deleteBtn');

    deleteBtn.addEventListener('click', e => {
        const i = (getTodo(e.target.parentNode));
        console.log(i, todos)
        deleteTodo(i, todos)
        reloadTodos(todos)
    })

    todo.appendChild(checkbox);
    todo.appendChild(text);
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo)
}

newTodoInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        createTodo(todos, e.target)
        e.target.value = ''
    }
})

const filterSelectors = document.querySelectorAll('#filterOption');

filterSelectors.forEach(selector => {
    selector.addEventListener("click", e => {
        reloadTodos(filterTodos(todos, e.target.dataset.filter))
        filterSelectors.forEach(selector => selector.classList.remove('filterSelected'));
        e.target.classList.add('filterSelected');

    })
})

const clearCompleted = document.getElementById('clearCompleted');
clearCompleted.addEventListener('click', e => {
    todos = filterTodos(todos, 'active')
    reloadTodos(todos)
} )






// Selectors
const newTodoInput = document.getElementById('newTodoInput');
const todoList = document.getElementById('todoList');
const filterSelectors = document.querySelectorAll('.filterOption');
const clearCompleted = document.getElementById('clearCompleted');
const colorModeBtn = document.getElementById('colorModeBtn');

colorModeBtn.addEventListener('click', (e) => {
	changeColorMode();
	if (document.body.classList.contains('light-mode')) {
		e.target.src = '/images/icon-sun.svg';
	} else {
		e.target.src = '/images/icon-moon.svg';
	}
});

class State {
	constructor() {
		this.currentState = 'all';
		this.stateOptions = ['all', 'active', 'completed'];
	}

	setState(value) {
		reloadTodos(filterTodos(value));
		this.currentState = value;
		this.stateOptions.forEach((option) =>
			document
				.querySelectorAll(`[data-filter="${option}"]`)
				.forEach((selector) => selector.classList.remove('filterSelected')),
		);
		document
			.querySelectorAll(`[data-filter="${value}"]`)
			.forEach((selector) => selector.classList.add('filterSelected'));
	}
}

const state = new State();

window.addEventListener('DOMContentLoaded', () => {
	state.setState('all');
	showRemainingCounter(loadTodos());
});

newTodoInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		createTodo(e.target);
		e.target.value = '';
	}
});

filterSelectors.forEach((selector) => {
	selector.addEventListener('click', (e) =>
		state.setState(e.target.dataset.filter),
	);
});

clearCompleted.addEventListener('click', (e) => {
	const completedTodos = filterTodos('completed');
	completedTodos.forEach((todo) => deleteTodo(todo));
	state.setState(state.currentState);
});

function changeColorMode() {
	document.body.classList.toggle('dark-mode');
	document.body.classList.toggle('light-mode');
}

function createTodo(input) {
	function generateId(arr) {
		const allId = arr.map((i) => i.id);
		let newId;
		do {
			newId = Math.floor(Math.random() * 256);
		} while (allId.includes(newId));

		return newId;
	}

	const newTodo = {
		id: generateId(loadTodos()),
		isDone: false,
		content: input.value,
	};

	saveTodos(loadTodos().concat(newTodo));
	state.setState(state.currentState);
	showRemainingCounter(loadTodos());
}

function reloadTodos(todosArr) {
	todoList.innerHTML = '';
	todosArr.forEach((todo) => buildTodoComponent(todo));
}

function deleteTodo(item) {
	const todos = loadTodos();
	const newTodos = todos.filter((x) => x.id !== item.id);
	saveTodos(newTodos);

	showRemainingCounter(newTodos);
}

function changeTodo(item) {
	const todos = loadTodos();
	const newTodos = todos.map((todo) => (todo.id === item.id ? item : todo));
	saveTodos(newTodos);

	state.setState(state.currentState);
	showRemainingCounter(newTodos);
}

function showRemainingCounter(todosArr) {
	const uncompletedTodos = todosArr.filter((todo) => todo.isDone === false);
	const counter = document.getElementById('remainingCounter');
	counter.innerText = `${uncompletedTodos.length} items left`;
}

function filterTodos(filter) {
	const todos = loadTodos();
	let filteredTodos;
	switch (filter) {
		case 'all':
			filteredTodos = todos;
			break;

		case 'active':
			filteredTodos = todos.filter((todo) => todo.isDone === false);
			break;

		case 'completed':
			filteredTodos = todos.filter((todo) => todo.isDone === true);
			break;
	}

	return filteredTodos;
}

function buildTodoComponent(props) {
	const { id, isDone, content } = props;
	const todo = document.createElement('div');
	todo.classList.add('todo-item');
	todo.dataset.todoId = id;

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.value = 'done';
	checkbox.defaultChecked = isDone;
	checkbox.classList.add('checkbox');

	function getTodo(input) {
		const id = Number(input.dataset.todoId);
		const isDone = input.querySelector('.checkbox').checked;
		const content = input.querySelector('.newTodoInput').value;

		return { id, isDone, content };
	}

	checkbox.addEventListener('click', (e) =>
		changeTodo(getTodo(e.target.parentNode)),
	);

	const text = document.createElement('input');
	text.type = 'text';
	text.value = content;
	text.classList.add('newTodoInput');

	text.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			changeTodo(getTodo(e.target.parentNode));
		}
	});

	const deleteBtn = document.createElement('a');
	deleteBtn.classList.add('deleteBtn');

	deleteBtn.addEventListener('click', (e) => {
		const todo = getTodo(e.target.parentNode);
		deleteTodo(todo);
		state.setState(state.currentState);
	});

	todo.appendChild(checkbox);
	todo.appendChild(text);
	todo.appendChild(deleteBtn);

	todoList.appendChild(todo);
}

function saveTodos(newTodos) {
	console.log(newTodos);
	localStorage.setItem('TodosData', JSON.stringify(newTodos));
}

function loadTodos() {
	let todos;
	if (localStorage.getItem('TodosData') === null) {
		todos = new Array();
	} else {
		todos = JSON.parse(localStorage.getItem('TodosData'));
	}

	return todos;
}

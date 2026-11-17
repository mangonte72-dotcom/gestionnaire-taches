'use strict';

/* ================================================================== */
/* =========================== DONNÉES ============================== */
/* ================================================================== */

const STORAGE_KEY = 'gestionnaire-taches';

// Statuts autorisés : valeur technique -> libellé affiché
const STATUTS = {
	'a-faire': 'À faire',
	'en-cours': 'En cours',
	'terminee': 'Terminée',
	'bloquee': 'Bloquée'
};

// Tableau de tâches : { id, titre, description, statut, date }
let tasks = [];

// Id de la tâche en cours de modification (null = mode ajout)
let editingId = null;

// Éléments du DOM
const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const statusSelect = document.getElementById('task-status');
const formError = document.getElementById('form-error');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const filterSelect = document.getElementById('filter-status');
const searchInput = document.getElementById('search-input');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');

/* ================================================================== */
/* ======================== LOCALSTORAGE (R7) ======================= */
/* ================================================================== */

function saveTasks() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
	try {
		const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
		tasks = Array.isArray(data) ? data : [];
	} catch (error) {
		tasks = []; // données corrompues : on repart d'une liste vide
	}
}

/* ================================================================== */
/* ========================== VALIDATION ============================ */
/* ================================================================== */

function isValidStatus(statut) {
	return Object.hasOwn(STATUTS, statut);
}

// Retourne un message d'erreur, ou une chaîne vide si tout est valide
function validateTask(titre, statut) {
	if (titre.trim() === '') {
		return 'Le titre est obligatoire.';
	}
	if (!isValidStatus(statut)) {
		return 'Le statut choisi est invalide.';
	}
	return '';
}

/* ================================================================== */
/* ============================ CRUD ================================ */
/* ================================================================== */

function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function findTask(id) {
	return tasks.find(function (task) {
		return task.id === id;
	});
}

// R1 : ajout
function addTask(titre, description, statut) {
	const task = {
		id: generateId(),
		titre: titre.trim(),
		description: description.trim(),
		statut: statut,
		date: new Date().toISOString()
	};
	tasks.push(task);
	saveTasks();
	return task;
}

// R3 : modification
function updateTask(id, titre, description, statut) {
	const task = findTask(id);
	if (!task) {
		return false;
	}
	task.titre = titre.trim();
	task.description = description.trim();
	task.statut = statut;
	saveTasks();
	return true;
}

// R4 : suppression
function deleteTask(id) {
	tasks = tasks.filter(function (task) {
		return task.id !== id;
	});
	saveTasks();
}

/* ================================================================== */
/* ====================== FILTRE ET RECHERCHE ======================= */
/* ================================================================== */

// R5 : filtre par statut
function filterByStatus(list, statut) {
	if (statut === 'toutes') {
		return list;
	}
	return list.filter(function (task) {
		return task.statut === statut;
	});
}

// R6 : recherche dans le titre et la description
function searchTasks(list, query) {
	const text = query.trim().toLowerCase();
	if (text === '') {
		return list;
	}
	return list.filter(function (task) {
		return task.titre.toLowerCase().includes(text)
			|| task.description.toLowerCase().includes(text);
	});
}

function getVisibleTasks() {
	const filtered = filterByStatus(tasks, filterSelect.value);
	return searchTasks(filtered, searchInput.value);
}

/* ================================================================== */
/* ====================== AFFICHAGE (R2) ============================ */
/* ================================================================== */

function formatDate(isoDate) {
	return new Date(isoDate).toLocaleString('fr-FR', {
		dateStyle: 'short',
		timeStyle: 'short'
	});
}

function createElement(tag, className, text) {
	const element = document.createElement(tag);
	if (className) {
		element.className = className;
	}
	if (text) {
		element.textContent = text;
	}
	return element;
}

function createButton(text, className, label, onClick) {
	const button = createElement('button', 'btn ' + className, text);
	button.type = 'button';
	button.setAttribute('aria-label', label);
	button.addEventListener('click', onClick);
	return button;
}

function createTaskActions(task) {
	const actions = createElement('div', 'task-actions');
	actions.append(
		createButton('Modifier', 'btn-secondary', 'Modifier « ' + task.titre + ' »', function () {
			startEditing(task.id);
		}),
		createButton('Supprimer', 'btn-danger', 'Supprimer « ' + task.titre + ' »', function () {
			handleDelete(task.id);
		})
	);
	return actions;
}

function createTaskCard(task) {
	const card = createElement('li', 'task-card');
	card.classList.add('status-' + task.statut);

	card.append(
		createElement('span', 'badge badge-' + task.statut, STATUTS[task.statut]),
		createElement('h3', '', task.titre)
	);
	if (task.description) {
		card.append(createElement('p', 'task-description', task.description));
	}
	card.append(
		createElement('small', 'task-date', 'Créée le ' + formatDate(task.date)),
		createTaskActions(task)
	);
	return card;
}

function updateEmptyMessage(count) {
	emptyMessage.hidden = count > 0;
	emptyMessage.textContent = tasks.length === 0
		? 'Aucune tâche pour le moment. Ajoutez-en une !'
		: 'Aucune tâche ne correspond à votre filtre ou à votre recherche.';
}

function renderTasks() {
	const visibleTasks = getVisibleTasks();
	taskList.replaceChildren(...visibleTasks.map(createTaskCard));
	updateEmptyMessage(visibleTasks.length);
}

/* ================================================================== */
/* =========================== FORMULAIRE =========================== */
/* ================================================================== */

function showError(message) {
	formError.textContent = message;
	titleInput.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function resetForm() {
	form.reset();
	editingId = null;
	formTitle.textContent = 'Ajouter une tâche';
	submitBtn.textContent = 'Ajouter';
	cancelBtn.hidden = true;
	showError('');
}

function startEditing(id) {
	const task = findTask(id);
	if (!task) {
		return;
	}
	editingId = id;
	titleInput.value = task.titre;
	descriptionInput.value = task.description;
	statusSelect.value = task.statut;
	formTitle.textContent = 'Modifier la tâche';
	submitBtn.textContent = 'Enregistrer';
	cancelBtn.hidden = false;
	showError('');
	titleInput.focus();
}

/* ================================================================== */
/* =========================== ÉVÉNEMENTS =========================== */
/* ================================================================== */

function handleSubmit(event) {
	event.preventDefault();

	const titre = titleInput.value;
	const description = descriptionInput.value;
	const statut = statusSelect.value;

	const error = validateTask(titre, statut);
	if (error) {
		showError(error);
		titleInput.focus();
		return;
	}

	if (editingId) {
		updateTask(editingId, titre, description, statut);
	} else {
		addTask(titre, description, statut);
	}
	resetForm();
	renderTasks();
}

function handleDelete(id) {
	const task = findTask(id);
	if (task && confirm('Supprimer la tâche « ' + task.titre + ' » ?')) {
		deleteTask(id);
		if (editingId === id) {
			resetForm();
		}
		renderTasks();
	}
}

/* ================================================================== */
/* ======================== CODE PRINCIPAL ========================== */
/* ================================================================== */

function init() {
	loadTasks();
	form.addEventListener('submit', handleSubmit);
	cancelBtn.addEventListener('click', resetForm);
	filterSelect.addEventListener('change', renderTasks);
	searchInput.addEventListener('input', renderTasks);
	renderTasks();
}

init();

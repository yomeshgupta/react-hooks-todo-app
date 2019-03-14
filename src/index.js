/*
	Blogpost:
	Author: Yomesh Gupta (https://www.twitter.com/yomeshgupta)
*/

import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './styles.css';

library.add(faCheck, faTrash);

const initialState = {
	fetched: false,
	todos: {}
};

const TODOS = {
	1552406885681: {
		todo: 'Complete this blog post',
		isComplete: false
	},
	1552406885682: {
		todo: 'Add everything to this blog post',
		isComplete: false
	}
};

function reducer(state, action) {
	switch (action.type) {
		case 'REPLACE_TODOS':
			return { ...state, fetched: true, todos: action.payload };
		case 'UPDATE_TODOS': {
			return { ...state, todos: action.payload };
		}
		case 'ADD_TODO':
			return {
				...state,
				todos: {
					...state.todos,
					...action.payload
				}
			};
		case 'COMPLETE_TODO':
			return {
				...state,
				todos: {
					...state.todos,
					[action.payload.id]: {
						...state.todos[action.payload.id],
						isComplete: true
					}
				}
			};
		default:
			return state;
	}
}

function Loader() {
	return <div id="loader">Loading...</div>;
}

function Empty() {
	return <div id="empty">Seems kind of empty here...</div>;
}

function Todos() {
	const [task, setTask] = useState('');
	const [state, dispatch] = useReducer(reducer, initialState);
	const { fetched, todos } = state;
	const keys = Object.keys(todos);

	// Setting up an effect
	useEffect(function() {
		function fetchData() {
			new Promise((resolve, reject) => {
				// mocking API call
				setTimeout(() => resolve(TODOS), 2000);
			}).then(response => {
				// Updating state variable
				dispatch({
					type: 'REPLACE_TODOS',
					payload: response
				});
			});
		}
		fetchData();
	}, []);

	function saveHandler(e) {
		e.preventDefault();
		if (!task || !task.trim().length) return alert('Enter task');
		dispatch({
			type: 'ADD_TODO',
			payload: {
				[+new Date()]: {
					todo: task,
					isComplete: false
				}
			}
		});
		setTask('');
	}

	function controlHandler(id, operation) {
		switch (operation) {
			case 'complete':
				dispatch({
					type: 'COMPLETE_TODO',
					payload: {
						id
					}
				});
				break;
			case 'delete': {
				const clonedTodos = { ...todos };
				delete clonedTodos[id];
				dispatch({
					type: 'UPDATE_TODOS',
					payload: clonedTodos
				});
				break;
			}
			default:
				console.log('This is odd.');
		}
	}

	function renderContent() {
		if (!fetched) {
			return <Loader />;
		} else if (!keys.length) {
			return <Empty />;
		}
		return (
			<ul id="todos">
				{keys.map(key => {
					const value = todos[key];
					const { isComplete, todo } = value;
					return (
						<li key={key}>
							<p className={isComplete ? 'complete' : ''}>{todo}</p>
							<div className="controls">
								{!isComplete ? (
									<FontAwesomeIcon
										icon="check"
										title="Mark as Complete"
										className="control-icon"
										onClick={() => controlHandler(key, 'complete')}
									/>
								) : null}
								<FontAwesomeIcon
									icon="trash"
									title="Delete Todo"
									className="control-icon"
									onClick={() => controlHandler(key, 'delete')}
								/>
							</div>
						</li>
					);
				})}
			</ul>
		);
	}

	return (
		<div className="wrapper custom-scrollbar">
			<form method="#" onSubmit={saveHandler}>
				<input
					type="text"
					onChange={e => setTask(e.target.value)}
					value={task}
					placeholder="What needs to be done?"
				/>
				<input type="submit" value="Add" title="Add Todo" />
			</form>
			{renderContent()}
		</div>
	);
}
const rootElement = document.getElementById('root');
ReactDOM.render(<Todos />, rootElement);

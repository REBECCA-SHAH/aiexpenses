import React, { useEffect, useState } from 'react'
import { api } from './api/client.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Expenses from './pages/Expenses.jsx'

export default function App() {
	const [token, setToken] = useState(localStorage.getItem('token') || '')
	const [view, setView] = useState(token ? 'expenses' : 'login')

	useEffect(() => {
		if (token) localStorage.setItem('token', token)
		else localStorage.removeItem('token')
	}, [token])

	useEffect(() => {
		api.setToken(token)
	}, [token])

	function onLogout() {
		setToken('')
		setView('login')
	}

	return (
		<div className="container">
			<header className="app-header">
				<h2>AI Expenses</h2>
				<nav>
					{token ? (
						<button onClick={onLogout}>Logout</button>
					) : (
						<>
							<button onClick={() => setView('login')}>Login</button>
							<button onClick={() => setView('register')} style={{ marginLeft: 8 }}>Register</button>
						</>
					)}
				</nav>
			</header>
			<main className="main">
				{!token && view === 'login' && <Login onSuccess={(t) => { setToken(t); setView('expenses') }} />}
				{!token && view === 'register' && <Register onSuccess={(t) => { setToken(t); setView('expenses') }} />}
				{token && <Expenses />}
			</main>
		</div>
	)
}

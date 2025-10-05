import React, { useState } from 'react'
import { api } from '../api/client.js'

export default function Login({ onSuccess }) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function submit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const { token } = await api.login({ username, password })
			onSuccess(token)
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={submit} className="card form">
			<h3>Login</h3>
			<input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
			<input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
			{error && <div className="error">{error}</div>}
			<button disabled={loading}>{loading ? '...' : 'Login'}</button>
		</form>
	)
}

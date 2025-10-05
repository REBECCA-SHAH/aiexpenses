const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

class ApiClient {
	constructor() {
		this.token = ''
	}
	setToken(token) {
		this.token = token
	}
	_headers() {
		const h = { 'Content-Type': 'application/json' }
		if (this.token) h.Authorization = `Bearer ${this.token}`
		return h
	}
	async request(path, opts = {}) {
		const res = await fetch(`${baseURL}${path}`, { ...opts, headers: { ...this._headers(), ...(opts.headers || {}) } })
		if (!res.ok) {
			let msg = 'Request failed'
			try { const j = await res.json(); msg = j.error || msg } catch {}
			throw new Error(msg)
		}
		const ct = res.headers.get('content-type') || ''
		if (ct.includes('application/json')) return res.json()
		return res.text()
	}
	// Auth
	register(data) { return this.request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }) }
	login(data) { return this.request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }) }
	// Expenses
	listExpenses(qs) { return this.request(`/api/expenses?${new URLSearchParams(qs).toString()}`) }
	createExpense(data) { return this.request('/api/expenses', { method: 'POST', body: JSON.stringify(data) }) }
	updateExpense(id, data) { return this.request(`/api/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
	deleteExpense(id) { return this.request(`/api/expenses/${id}`, { method: 'DELETE' }) }
	// AI
	suggestCategory(data) { return this.request('/api/ai/suggest-category', { method: 'POST', body: JSON.stringify(data) }) }
}

export const api = new ApiClient()

import React, { useEffect, useState } from 'react'
import { api } from '../api/client.js'

const CATEGORIES = ['FOOD', 'TRAVEL', 'UTILITIES', 'ENTERTAINMENT', 'OTHER']

export default function ExpenseForm({ initial, onSaved }) {
	const [title, setTitle] = useState('')
	const [category, setCategory] = useState('OTHER')
	const [amount, setAmount] = useState('')
	const [taxPercent, setTaxPercent] = useState('0')
	const [isRecurring, setIsRecurring] = useState(false)
	const [spentAt, setSpentAt] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (initial) {
			setTitle(initial.title || '')
			setCategory(initial.category || 'OTHER')
			setAmount(initial.amount != null ? String(initial.amount) : '')
			setTaxPercent(initial.taxPercent != null ? String(initial.taxPercent) : '0')
			setIsRecurring(!!initial.isRecurring)
			setSpentAt(initial.spentAt ? initial.spentAt.slice(0, 10) : '')
		}
	}, [initial])

	async function suggest() {
		try {
			const { category: cat } = await api.suggestCategory({ title })
			setCategory(cat)
		} catch (e) {
			setError(e.message)
		}
	}

	async function submit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			const payload = {
				title,
				category,
				amount: Number(amount),
				taxPercent: Number(taxPercent),
				isRecurring,
				spentAt: spentAt ? new Date(spentAt).toISOString() : undefined
			}
			if (initial && initial._id) {
				await api.updateExpense(initial._id, payload)
			} else {
				await api.createExpense(payload)
			}
			onSaved()
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	const totalWithTax = (() => {
		const a = Number(amount) || 0
		const t = (Number(taxPercent) || 0) / 100
		return (a + a * t).toFixed(2)
	})()

	return (
		<form onSubmit={submit} className="card form">
			<div className="row">
				<input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ flex: 2 }} />
				<select value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1 }}>
					{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<button type="button" className="secondary" onClick={suggest}>AI Suggest</button>
			</div>
			<div className="row">
				<input placeholder="Amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
				<input placeholder="Tax %" type="number" step="0.1" value={taxPercent} onChange={e => setTaxPercent(e.target.value)} />
				<label className="row" style={{ gap: 6 }}>
					<input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} /> Recurring
				</label>
				<input type="date" value={spentAt} onChange={e => setSpentAt(e.target.value)} />
			</div>
			<div>Total with tax: <span className="badge">${totalWithTax}</span></div>
			{error && <div className="error">{error}</div>}
			<div>
				<button disabled={loading}>{initial ? 'Update' : 'Create'}</button>
			</div>
		</form>
	)
}

import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'
import Pagination from '../components/Pagination.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'

const CATEGORIES = ['ALL', 'FOOD', 'TRAVEL', 'UTILITIES', 'ENTERTAINMENT', 'OTHER']

export default function Expenses() {
	const [items, setItems] = useState([])
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [category, setCategory] = useState('ALL')
	const [search, setSearch] = useState('')
	const [sortBy, setSortBy] = useState('createdAt')
	const [sortDir, setSortDir] = useState('desc')
	const [recurring, setRecurring] = useState('any')

	const [editing, setEditing] = useState(null)
	const [refreshKey, setRefreshKey] = useState(0)

	const totalPages = useMemo(() => Math.ceil(total / limit) || 1, [total, limit])

	function refresh() {
		setRefreshKey(x => x + 1)
	}

	useEffect(() => {
		const qs = {
			page,
			limit,
			sortBy,
			sortDir,
			...(category !== 'ALL' ? { category } : {}),
			...(search ? { search } : {}),
			...(recurring === 'true' ? { recurring: 'true' } : {}),
			...(recurring === 'false' ? { recurring: 'false' } : {})
		}
		api.listExpenses(qs).then(({ items, total, page }) => {
			setItems(items)
			setTotal(total)
			setPage(page)
		}).catch(err => {
			console.error(err)
		})
	}, [page, limit, category, search, sortBy, sortDir, recurring, refreshKey])

	return (
		<div className="form">
			<div className="toolbar">
				<input placeholder="Search title" value={search} onChange={e => setSearch(e.target.value)} />
				<select value={category} onChange={e => setCategory(e.target.value)}>
					{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<select value={sortBy} onChange={e => setSortBy(e.target.value)}>
					<option value="createdAt">Created</option>
					<option value="amount">Amount</option>
					<option value="spentAt">Spent At</option>
					<option value="title">Title</option>
				</select>
				<select value={sortDir} onChange={e => setSortDir(e.target.value)}>
					<option value="desc">Desc</option>
					<option value="asc">Asc</option>
				</select>
				<select value={recurring} onChange={e => setRecurring(e.target.value)}>
					<option value="any">Any</option>
					<option value="true">Recurring</option>
					<option value="false">Non‑recurring</option>
				</select>
				<select value={limit} onChange={e => setLimit(Number(e.target.value))}>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
				</select>
			</div>

			<ExpenseForm onSaved={() => { setEditing(null); refresh() }} />

			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Category</th>
						<th className="right">Amount</th>
						<th className="right">Tax %</th>
						<th className="right">Total</th>
						<th>Recurring</th>
						<th>Spent</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{items.map(it => (
						<tr key={it._id}>
							<td>{it.title}</td>
							<td><span className="badge">{it.category}</span></td>
							<td className="right">${it.amount.toFixed(2)}</td>
							<td className="right">{it.taxPercent}%</td>
							<td className="right">${(it.totalWithTax ?? (it.amount + it.amount * it.taxPercent / 100)).toFixed(2)}</td>
							<td>{it.isRecurring ? 'Yes' : 'No'}</td>
							<td>{it.spentAt ? new Date(it.spentAt).toLocaleDateString() : ''}</td>
							<td>
								<button className="secondary" onClick={() => setEditing(it)}>Edit</button>
								<button className="danger" onClick={async () => { await api.deleteExpense(it._id); refresh() }} style={{ marginLeft: 6 }}>Delete</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination page={page} totalPages={totalPages} onPage={setPage} />

			{editing && (
				<div className="card">
					<h4>Edit</h4>
					<ExpenseForm initial={editing} onSaved={() => { setEditing(null); refresh() }} />
				</div>
			)}
		</div>
	)
}

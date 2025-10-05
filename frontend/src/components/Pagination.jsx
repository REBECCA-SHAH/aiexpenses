import React from 'react'

export default function Pagination({ page, totalPages, onPage }) {
	return (
		<div className="pagination">
			<button className="secondary" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}>Prev</button>
			<span>Page {page} / {totalPages || 1}</span>
			<button className="secondary" onClick={() => onPage(Math.min(totalPages || 1, page + 1))} disabled={totalPages ? page >= totalPages : true}>Next</button>
		</div>
	)
}

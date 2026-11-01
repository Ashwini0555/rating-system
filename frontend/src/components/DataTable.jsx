export default function DataTable({ columns, rows, sort, onSort, loading, emptyText = 'Nothing to show yet.' }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort && sort.sortBy === c.key;
              return (
                <th key={c.key} aria-sort={active ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  {c.sortable ? (
                    <button className="th-btn" onClick={() => onSort(c.key)}>
                      {c.label}
                      <span className="sort-icon">{active ? (sort.order === 'asc' ? '▲' : '▼') : '↕'}</span>
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={columns.length} className="empty">{loading ? 'Loading…' : emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

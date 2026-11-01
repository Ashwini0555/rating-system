export default function FilterBar({ fields, filters, setFilter }) {
  return (
    <div className="filters">
      {fields.map((f) =>
        f.options ? (
          <select key={f.key} aria-label={f.label} value={filters[f.key] || ''} onChange={(e) => setFilter(f.key, e.target.value)}>
            <option value="">{f.label}: all</option>
            {f.options.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        ) : (
          <input
            key={f.key}
            type="search"
            placeholder={`Filter by ${f.label.toLowerCase()}`}
            aria-label={f.label}
            value={filters[f.key] || ''}
            onChange={(e) => setFilter(f.key, e.target.value)}
          />
        )
      )}
    </div>
  );
}

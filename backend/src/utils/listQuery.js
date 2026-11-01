function orderBy(sortBy, order, columns, fallback) {
  const column = columns[sortBy] || columns[fallback];
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `ORDER BY ${column} ${direction}`;
}

function like(value) {
  return `%${String(value || '').trim()}%`;
}

module.exports = { orderBy, like };

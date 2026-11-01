import { useState } from 'react';

// Read-only when `onChange` is not given. Interactive otherwise (1 to 5 stars).
export default function StarRating({ value, onChange, showNumber = false }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === 'function';
  const filled = hover || Math.round(value || 0);

  if (!interactive && !value) return <span className="muted">No rating yet</span>;

  return (
    <span className="stars" role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${value || 0} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={`star ${n <= filled ? 'on' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
          >
            ★
          </button>
        ) : (
          <span key={n} className={`star ${n <= filled ? 'on' : ''}`} aria-hidden="true">★</span>
        )
      )}
      {showNumber && value ? <span className="rating-number">{Number(value).toFixed(1)}</span> : null}
    </span>
  );
}

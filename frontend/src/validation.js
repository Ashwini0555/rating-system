// Mirrors the backend rules so users get instant feedback.
export const rules = {
name: (v) => (v.trim().length < 20 || v.trim().length > 60 ? 'Name must be 20 to 60 characters' : ''),
email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && v.trim().length <= 100 ? '' : 'Enter a valid email address'),
  address: (v) => (!v.trim() ? 'Address is required' : v.trim().length > 400 ? 'Address can be at most 400 characters' : ''),
  password: (v) =>
    /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(v)
      ? ''
      : 'Use 8-16 characters with at least one uppercase letter and one special character',
};

export function validate(values, fields) {
  const errors = {};
  fields.forEach((f) => {
    const msg = rules[f](values[f] ?? '');
    if (msg) errors[f] = msg;
  });
  return errors;
}

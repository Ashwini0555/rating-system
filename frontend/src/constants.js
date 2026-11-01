export const ROLE_LABELS = { admin: 'System Admin', user: 'Normal User', owner: 'Store Owner' };

export const homePath = (role) => ({ admin: '/admin', user: '/stores', owner: '/owner' }[role] || '/login');

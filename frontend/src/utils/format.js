export function formatDate(value) {
    return new Date(value).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function parseLocal(value) {
    return new Date(`${value}T00:00:00`);
}

export function dayOf(value) {
    return parseLocal(value).getDate();
}

export function monthOf(value) {
    return parseLocal(value).toLocaleDateString('en-IN', { month: 'short' });
}
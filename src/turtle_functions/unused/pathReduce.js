export function pathReduce(f, turtle) {
	return turtle.path.reduce(path => pathReduceHelper(path, f), []);
}

function pathReduceHelper(path, f) {
	return Array.isArray(path) ? path.reduce( p => pathMapHelper(p, f), []) : f(path);
}
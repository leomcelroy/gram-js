export function pathFilter(f, turtle) {
	return turtle.path.filter(path => pathFilterHelper(path, f));
}

function pathFilterHelper(path, f) {
	return Array.isArray(path) ? path.filter( p => pathfilterHelper(p, f) ) : f(path);
}
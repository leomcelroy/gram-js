export function setBooleanForm(clippedPaths, turtle) {
	let newPaths = Object.values(clippedPaths.paths).map(p => {
		p = p.map( ({X, Y}) => ({x: X/turtle.booleanScale, y: Y/turtle.booleanScale}) );
		// I automatically close the paths
		const points = [ ...p, p[0] ];

		return { points, fillColor: "none", strokeWidth: 1, strokeColor: "black", construction: false };
	})


	turtle.path = newPaths;

	return turtle; 
};
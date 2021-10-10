// import { Bezier } from "../../libs/Bezier.js";
import { flattenPath } from "../../libs/path-to-points.js";


export function bezier(string, turtle) {
	// console.log(Bezier);
	const polylines = flattenPath(string, {maxError: 0.001}).map(x => x.points);
	polylines.forEach(pl => {
		pl.forEach((point, i) => i === 0
			? turtle.newStroke(point)
			: turtle.goTo(point)
		);
	})

	return turtle;
}
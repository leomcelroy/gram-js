export function move(point0, point1, turtle) {
	const {x: x0, y: y0 } = point0;
	const {x: x1, y: y1 } = point1;
	const x = x1 - x0;
	const y = y1 - y0;
	
	turtle.path = turtle.pointMap(point => ({
		x: point.x + x,
		y: point.y + y
	}));

	return turtle;
}
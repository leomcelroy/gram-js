export function pointReduce(f, turtle) {
	return turtle.path.map(shape => ({ ...shape,
		points: shape.points.reduce(f, [])
	}));
}
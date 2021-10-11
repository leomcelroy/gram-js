# Gram JS

A turtle based geometry library for creating parametric line drawings. Used in the Gram Drawing Language.

Better documentation coming.

Can be imported like:

```javascript
export { drawTurtle, Turtle, group } from "https://leomcelroy.com/gram-js/exports.js";
```

Here are available methods on the Turtle class:



```javascript
export class Turtle {

	constructor(init) {
		this.angle = 0;
		this.path = createPath();

		this.savedStates = [];

		this.booleanScale = 100;
		
		if (init) {
			this.angle = init.angle;
			this.path = init.path;
		}
	}

	overwrite(turtle) {
		this.angle = turtle.angle;
		this.path = turtle.path;
		this.savedStates = turtle.savedStates;
		this.booleanScale = turtle.booleanScale;

		return this;
	}

	firstPath() { return firstPath(this) };
	lastPath() { return lastPath(this) };
	pointsFromLast(i) { return pointsFromLast(i, this) };
	pointsFromFirst(i) { return pointsFromFirst(i, this) };
	getPoint(i) { return i >= 0 ? pointsFromFirst(i, this) : pointsFromLast(-i, this) }; // not doced
	addPoint(point, down = true) { return addPoint(point, down, this) };
	pathMap(func) { return pathMap(func, this) };
	pointMap(func) { return pointMap(func, this) };
	pointFilter(func) { return pointFilter(func, this) };
	extrema() { return extrema(this) };
	copy() { return copy(this) };
	setBooleanForm(paths) { return setBooleanForm(paths, this) };
	getBooleanForm() { return getBooleanForm(this) };
	point(target) { return point(target, this) };

	store() {
		this.savedStates.push({ pos: this.end, angle: this.angle });
		return this;
	}

	restore() {
		const state = this.savedStates.pop();
		this.goTo(state.pos, false);
		this.angle = state.angle;
		return this;
	}

	lastAngle() { return lastAngle(this) };

	alignHead() { return alignHead(this) };

	fillColor(color) { return fillColor(color, this) };

	strokeWidth(thickness) { return strokeWidth(thickness, this) };

	strokeColor(color) { return strokeColor(color, this) };

	strokeLinecap(type) { return strokeLinecap(type, this) };


	strokeLinejoin(type) { return strokeLinejoin(type, this) };

	// turtle operations
	goTo(point, down = true) { return goTo(pointConversion(point), down, this) };
	forward(distance, down = true) { return forward(distance, down, this) };
	vec(vector, down = true) { return vec(vector, down, this) }; // not doced
	arc(angle, radius, down = true) { return arc(angle, radius, down, this) };
	turnForward(angle, distance) { return turnForward(angle, distance, this) };

	turn(angle) { return turn(angle, this) };
	right(angle) { return turn(-angle, this) };
	left(angle) { return turn(angle, this) };

	setAngle(angle) { return setAngle(angle, this) };

 	flatGoTo(point, axis) { return flatGoTo(pointConversion(point), axis, this) };

	closePath() { return closePath(this) };

	translate(toPoint, fromPoint = [0, 0]) { return translate(pointConversion(toPoint), pointConversion(fromPoint), this) }; 
	rotate(angle, point) { return rotate(angle, point ? pointConversion(point) : this.centroid, this) };
	scale(factor, point) { 
		point = point ? pointConversion(point) : this.centroid;
		if (typeof factor === "number") factor = [factor, factor];

		return scale(factor, point, this); 
	};
	originate() { return originate(this) };


	reverse() { return reverse(this) };
	flip(axis) { return flip(axis, this) };
	repeat(num) { return repeat(num, this) };
	mirror() { return mirror(this) };
	fillet(radius) { return fillet(radius, this) };

	roundCorners(radius, all = false) { return roundCorners(radius, all, this) };

	thicken(thickness) { return thicken(thickness, this) };

	copyPaste(num, transformations) { return copyPaste(num, transformations, this) };

	offset(distance, options = {}) { return offset(distance, options, this) };
	outline() { return offset(0, { endType: "etClosedPolygon" }, this) };
	expand(distance) { return offset(distance, { endType: "etClosedPolygon" }, this) };
	intersect() { return this.overwrite(intersect(this, arguments)) };
	difference() { return this.overwrite(difference(this, arguments)) };
	union() { return this.overwrite(union(this, arguments)) };
	xor() { return this.overwrite(xor(this)) };
	text(word) { return text(word, this) };
	dogbone(radius, all = false) { return dogbone(radius, all, this) };
	trim(start, end) { return trim(start, end, this) };

	placeAlong(turtle) { return placeAlong(turtle, this) };

	dashed(number) { return dashed(number, this) };
	bezier(string) { return bezier(string, this) }; 
	slide(angle, distance) { return slide(angle, distance, this) };
	polylines(asArray = false, prec = 0) { return polylines(asArray, prec, this) };


	lSystem(args) { return lSystem(args, this)}

	transform(matrix) { return transform(matrix, this) };

	get start() { return point( "start", this) };
	get end() { return point( "end", this) };
	get lt() { return point( "lt", this) };
	get lc() { return point( "lc", this) };
	get lb() { return point( "lb", this) };
	get ct() { return point( "ct", this) };
	get cc() { return point( "cc", this) };
	get cb() { return point( "cb", this) };
	get rt() { return point( "rt", this) };
	get rc() { return point( "rc", this) };
	get rb() { return point( "rb", this) };
	get centroid() { return centroid(this) };
	get width() { return width(this) };
	get height() { return height(this) };
	get points() { return points(this) };


	floodFill(color) { return floodFill(color, this) };

	group() {
		return this.overwrite(group(this, ...arguments));
	}

	flatten() {
		return this.overwrite(flatten(this));
	}

	getPathData(merge = true) {
		let result = [];
		const pls = this.polylines();

		for (let i = 0; i < pls.length; i++) {
			for (let j = 0; j < pls[i].pts.length; j++) {
				let pt = pls[i].pts[j];
				if (j === 0) result.push(`M ${pt.x} ${pt.y}`);
				else result[result.length-1] += `L ${pt.x} ${pt.y}`;
			}
		}

		return merge ? result.join(" ") : result;
	}

```

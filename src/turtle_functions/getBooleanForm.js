function flatten(items) {
  const flat = [];

  items.forEach(item => {
    if (Array.isArray(item)) {
      flat.push(...flatten(item));
    } else {
      flat.push(item);
    }
  });

  return flat;
}

const pointAdjust = (p, scale) => {
	const temp = {};
	temp["X"] = Math.round(p.x*scale);
	temp["Y"] = Math.round(p.y*scale);
	return temp;
}

const dist = (p0, p1) => Math.sqrt((p1.x - p0.x)**2 + (p1.y - p0.y)**2);

export function getBooleanForm(turtle, scale) {
  // set turtle.prototype.booleanScale
  // console.log(turtle.width, turtle.height)
  // turtle.prototype.booleanScale = 10000
  const distances = [];
  const pts = turtle.points;
  for (let i = 0; i < pts.length - 2; i += 1) {
  	const p0 = pts[i];
  	const p1 = pts[i+1];
  	const d2 = dist(p0, p1);
  	if (Math.abs(d2) != 0) distances.push(Math.floor(1/d2 + 1)*10);
  }

  const dynamicScale = Math.max(...distances);
  console.log(dynamicScale);
  turtle.booleanScale = dynamicScale;
  
	let [tool, ...body] = turtle.path.reverse();
	tool = Array.isArray(tool) ? flatten(tool) : [ tool ];
	body = Array.isArray(body) ? flatten(body) : [ body ];
	tool = tool.map(p => p.points.map(p => pointAdjust(p, dynamicScale)));
	body = body.map(p => p.points.map(p => pointAdjust(p, dynamicScale)));

	return body && tool ? [ body, tool ] : tool;
};
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

export function getBooleanForm(turtle) {
	let [tool, ...body] = turtle.path.reverse();
	tool = Array.isArray(tool) ? flatten(tool) : [ tool ];
	body = Array.isArray(body) ? flatten(body) : [ body ];
	tool = tool.map(p => p.points.map(p => pointAdjust(p, turtle.booleanScale)));
	body = body.map(p => p.points.map(p => pointAdjust(p, turtle.booleanScale)));

	return body && tool ? [ body, tool ] : tool;
};
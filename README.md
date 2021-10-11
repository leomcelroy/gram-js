# Gram JS

A turtle based geometry library for creating parametric line drawings. Used in the Gram Drawing Language.

Better documentation coming.

Can be imported like:

```javascript
export { drawTurtle, Turtle, group } from "https://leomcelroy.com/gram-js/exports.js";
```

Here are available methods on the Turtle class:

- **firstPath**(): *path* returns first path
- **lastPath**(): *path* returns last path
- **getPoint**(i *: number*): *[number, number]* returns point in Turtle from index i (negative i indexes from end of Turtle)
- **add_point**(point, down = true): *turtle*
- **pathMap**(func): *turtle*: applies function to all paths
- **pointMap**(func): *turtle*: applies function to all points
- **pointFilter**(func): *turtle*: filters points with functions
- **extrema**(): *object*: returns extremal points
- **copy**(): *turtle*: returns copy of turtle
- **point**(target: *string*): *[number, number]* returns requested point
- **store**(): *turtle* stores current position and orientation
- **restore**(): *turtle* restores last stored position and orientation
- **lastAngle**(): *number* returns angle between last two points
- **alignHead**(): *turtle* sets angle to angle between last two points
- **fillColor**(color): *turtle*
- **strokeWidth**(thickness): *turtle*
- **strokeColor**(color): *turtle*
- **strokeLinecap**(type): *turtle*
- **strokeLinejoin**(type): *turtle*
- **floodFill**(color): *turtle*
- **group**(): *turtle*
- **flatten**(): *turtle*
- **getPathData**(merge = true): *string*
- **forward**(distance, down = true): *turtle*
- **goTo**(point, down = true): *turtle*
- **vec**(vector, down = true): *turtle*
- **turnForward**(angle, distance): *turtle*
- **arc**(angle, radius, down = true): *turtle*
- **turn**(angle): *turtle*
- **right**(angle): *turtle*
- **left**(angle): *turtle*
- **setAngle**(angle): *turtle*
- **flatGoTo**(point, axis): *turtle*
- **closePath**(): *turtle*
- **translate**(toPoint, fromPoint = [0, 0]): *turtle*
- **rotate**(angle, point): *turtle*
- **scale**(factor, point): *turtle*
- **originate**(): *turtle*
- **reverse**(): *turtle*
- **flip**(axis): *turtle*
- **repeat**(num): *turtle*
- **mirror**(): *turtle*
- **fillet**(radius): *turtle*
- **roundCorners**(radius, all = false): *turtle*
- **thicken**(thickness): *turtle*
- **copyPaste**(num, transformations): *turtle*
- **offset**(distance, options = {}): *turtle*
- **outline**(): *turtle*
- **expand**(distance): *turtle*
- **intersect**(): *turtle*
- **difference**(): *turtle*
- **union**(): *turtle*
- **xor**(): *turtle*
- **text**(word): *turtle*
- **dogbone**(radius, all = false): *turtle*
- **trim**(start, end): *turtle*
- **placeAlong**(turtle): *turtle*
- **dashed**(number): *turtle*
- **bezier**(string): *turtle*
- **slide**(angle, distance): *turtle*
- **polylines**(asArray = false, prec = 0): *turtle*
- **lSystem**(args): *turtle*
- **transform**(matrix): *turtle*

You can reference special points on the Turtle with these methods. "l" stands for left, "c" for center, "r" for right, "t" for top, and "b" for bottom.

<pre>
"lt" -- "ct" -- "rt" 
  |       |       |  
"lc" -- "cc" -- "rc"   
  |       |       |  
"lb" -- "cb" -- "rb" 
</pre>

- **lt**(): *[number, number]*
- **lc**(): *[number, number]*
- **lb**(): *[number, number]*
- **ct**(): *[number, number]*
- **cc**(): *[number, number]*
- **cb**(): *[number, number]*
- **rt**(): *[number, number]*
- **rc**(): *[number, number]*
- **rb**(): *[number, number]*

You can also reference:

- **start**(): *[number, number]* returns first point
- **end**(): *[number, number]* returns last point
- **centroid**(): *[number, number]* returns centroid
- **width**(): *number* returns width
- **height**(): *number* returns height
- **points**(): *list of numbers*

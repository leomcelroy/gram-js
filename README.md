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
- **getPoint**(i: *number*): *[number, number]* returns point in Turtle from index i (negative i indexes from end of Turtle)
- **addPoint**(point, down = true): *turtle*
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
- **fillColor**(color: *string*): *turtle*
- **strokeWidth**(thickness): *turtle*
- **strokeColor**(color: *string*): *turtle*
- **strokeLinecap**(type): *turtle*
- **strokeLinejoin**(type): *turtle*
- **floodFill**(color): *turtle*
- **group**(): *turtle*
- **flatten**(): *turtle*
- **getPathData**(merge: *boolean* = true): *string*
- **forward**(distance: *number*, down: *boolean* = true): *turtle*
- **goTo**(point: *[number, number]*, down: *boolean* = true): *turtle*
- **vec**(vector: *[number, number]*, down: *boolean* = true): *turtle*
- **turnForward**(angle: *number*, distance: *number*): *turtle*
- **arc**(angle: *number*, radius: *number*, down: *boolean* = true): *turtle*
- **turn**(angle: *number*): *turtle*
- **right**(angle: *number*): *turtle*
- **left**(angle: *number*): *turtle*
- **setAngle**(angle: *number*): *turtle*
- **flatGoTo**(point: *[number, number]*, axis: *string*): *turtle*
- **closePath**(): *turtle*
- **translate**(toPoint: *[number, number]*, fromPoint: *[number, number]* = [0, 0]): *turtle*
- **rotate**(angle: *number*: *number*, point): *turtle*
- **scale**(factor: *number*, point: *[number, number]*): *turtle*
- **slide**(angle: *number*, distance: *number*): *turtle*
- **originate**(): *turtle*
- **reverse**(): *turtle*
- **flip**(axis): *turtle*
- **repeat**(num: *number*): *turtle*
- **mirror**(): *turtle*
- **fillet**(radius: *number*): *turtle*
- **roundCorners**(radius: *number*, all: *boolean* = false): *turtle*
- **thicken**(thickness: *number*): *turtle*
- **copyPaste**(num: *number*, transformations: *function*): *turtle*
- **offset**(distance: *number*, options = {}): *turtle*
- **outline**(): *turtle*
- **expand**(distanc: *number*): *turtle*
- **intersect**(): *turtle* intersects turtle with arguements
- **difference**(): *turtle* difference turtle with arguements
- **union**(): *turtle* union turtle with arguements
- **xor**(): *turtle* xor turtle with arguements
- **text**(word: *string*): *turtle* draws text of word
- **dogbone**(radius: *number*, all: *boolean* = false): *turtle*
- **trim**(start: *number*, end: *number*): *turtle*
- **placeAlong**(turtle): *turtle*
- **dashed**(number: *number*): *turtle*
- **bezier**(string: *string*): *turtle*
- **polylines**(asArray: *boolean* = false, prec = 0): *turtle*
- **lSystem**(args): *turtle*
- **transform**(matrix): *turtle*

You can reference special points on the Turtle with these methods. "l" stands for left, "c" for center, "r" for right, "t" for top, and "b" for bottom.

<pre>
lt -- ct -- rt 
 |     |     |        
lc -- cc -- rc   
 |     |     |      
lb -- cb -- rb 
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

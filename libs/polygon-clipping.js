var Node1 = function() {
    function Node2(key, data) {
        this.next = null;
        this.key = key;
        this.data = data;
        this.left = null;
        this.right = null;
    }
    return Node2;
}();
function DEFAULT_COMPARE(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
function splay(i, t, comparator) {
    var N = new Node1(null, null);
    var l = N;
    var r = N;
    while(true){
        var cmp = comparator(i, t.key);
        if (cmp < 0) {
            if (t.left === null) break;
            if (comparator(i, t.left.key) < 0) {
                var y = t.left;
                t.left = y.right;
                y.right = t;
                t = y;
                if (t.left === null) break;
            }
            r.left = t;
            r = t;
            t = t.left;
        } else if (cmp > 0) {
            if (t.right === null) break;
            if (comparator(i, t.right.key) > 0) {
                var y = t.right;
                t.right = y.left;
                y.left = t;
                t = y;
                if (t.right === null) break;
            }
            l.right = t;
            l = t;
            t = t.right;
        } else break;
    }
    l.right = t.left;
    r.left = t.right;
    t.left = N.right;
    t.right = N.left;
    return t;
}
function insert(i, data, t, comparator) {
    var node = new Node1(i, data);
    if (t === null) {
        node.left = node.right = null;
        return node;
    }
    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);
    if (cmp < 0) {
        node.left = t.left;
        node.right = t;
        t.left = null;
    } else if (cmp >= 0) {
        node.right = t.right;
        node.left = t;
        t.right = null;
    }
    return node;
}
function split(key, v, comparator) {
    var left = null;
    var right = null;
    if (v) {
        v = splay(key, v, comparator);
        var cmp = comparator(v.key, key);
        if (cmp === 0) {
            left = v.left;
            right = v.right;
        } else if (cmp < 0) {
            right = v.right;
            v.right = null;
            left = v;
        } else {
            left = v.left;
            v.left = null;
            right = v;
        }
    }
    return {
        left,
        right
    };
}
function merge(left, right, comparator) {
    if (right === null) return left;
    if (left === null) return right;
    right = splay(left.key, right, comparator);
    right.left = left;
    return right;
}
function printRow(root, prefix, isTail, out, printNode) {
    if (root) {
        out("" + prefix + (isTail ? "\u2514\u2500\u2500 " : "\u251C\u2500\u2500 ") + printNode(root) + "\n");
        var indent = prefix + (isTail ? "    " : "\u2502   ");
        if (root.left) printRow(root.left, indent, false, out, printNode);
        if (root.right) printRow(root.right, indent, true, out, printNode);
    }
}
var Tree = function() {
    function Tree2(comparator) {
        if (comparator === void 0) {
            comparator = DEFAULT_COMPARE;
        }
        this._root = null;
        this._size = 0;
        this._comparator = comparator;
    }
    Tree2.prototype.insert = function(key, data) {
        this._size++;
        return this._root = insert(key, data, this._root, this._comparator);
    };
    Tree2.prototype.add = function(key, data) {
        var node = new Node1(key, data);
        if (this._root === null) {
            node.left = node.right = null;
            this._size++;
            this._root = node;
        }
        var comparator = this._comparator;
        var t = splay(key, this._root, comparator);
        var cmp = comparator(key, t.key);
        if (cmp === 0) this._root = t;
        else {
            if (cmp < 0) {
                node.left = t.left;
                node.right = t;
                t.left = null;
            } else if (cmp > 0) {
                node.right = t.right;
                node.left = t;
                t.right = null;
            }
            this._size++;
            this._root = node;
        }
        return this._root;
    };
    Tree2.prototype.remove = function(key) {
        this._root = this._remove(key, this._root, this._comparator);
    };
    Tree2.prototype._remove = function(i, t, comparator) {
        var x;
        if (t === null) return null;
        t = splay(i, t, comparator);
        var cmp = comparator(i, t.key);
        if (cmp === 0) {
            if (t.left === null) {
                x = t.right;
            } else {
                x = splay(i, t.left, comparator);
                x.right = t.right;
            }
            this._size--;
            return x;
        }
        return t;
    };
    Tree2.prototype.pop = function() {
        var node = this._root;
        if (node) {
            while(node.left)node = node.left;
            this._root = splay(node.key, this._root, this._comparator);
            this._root = this._remove(node.key, this._root, this._comparator);
            return {
                key: node.key,
                data: node.data
            };
        }
        return null;
    };
    Tree2.prototype.findStatic = function(key) {
        var current = this._root;
        var compare = this._comparator;
        while(current){
            var cmp = compare(key, current.key);
            if (cmp === 0) return current;
            else if (cmp < 0) current = current.left;
            else current = current.right;
        }
        return null;
    };
    Tree2.prototype.find = function(key) {
        if (this._root) {
            this._root = splay(key, this._root, this._comparator);
            if (this._comparator(key, this._root.key) !== 0) return null;
        }
        return this._root;
    };
    Tree2.prototype.contains = function(key) {
        var current = this._root;
        var compare = this._comparator;
        while(current){
            var cmp = compare(key, current.key);
            if (cmp === 0) return true;
            else if (cmp < 0) current = current.left;
            else current = current.right;
        }
        return false;
    };
    Tree2.prototype.forEach = function(visitor, ctx) {
        var current = this._root;
        var Q = [];
        var done = false;
        while(!done){
            if (current !== null) {
                Q.push(current);
                current = current.left;
            } else {
                if (Q.length !== 0) {
                    current = Q.pop();
                    visitor.call(ctx, current);
                    current = current.right;
                } else done = true;
            }
        }
        return this;
    };
    Tree2.prototype.range = function(low, high, fn, ctx) {
        var Q = [];
        var compare = this._comparator;
        var node = this._root;
        var cmp;
        while(Q.length !== 0 || node){
            if (node) {
                Q.push(node);
                node = node.left;
            } else {
                node = Q.pop();
                cmp = compare(node.key, high);
                if (cmp > 0) {
                    break;
                } else if (compare(node.key, low) >= 0) {
                    if (fn.call(ctx, node)) return this;
                }
                node = node.right;
            }
        }
        return this;
    };
    Tree2.prototype.keys = function() {
        var keys = [];
        this.forEach(function(_a) {
            var key = _a.key;
            return keys.push(key);
        });
        return keys;
    };
    Tree2.prototype.values = function() {
        var values = [];
        this.forEach(function(_a) {
            var data = _a.data;
            return values.push(data);
        });
        return values;
    };
    Tree2.prototype.min = function() {
        if (this._root) return this.minNode(this._root).key;
        return null;
    };
    Tree2.prototype.max = function() {
        if (this._root) return this.maxNode(this._root).key;
        return null;
    };
    Tree2.prototype.minNode = function(t) {
        if (t === void 0) {
            t = this._root;
        }
        if (t) while(t.left)t = t.left;
        return t;
    };
    Tree2.prototype.maxNode = function(t) {
        if (t === void 0) {
            t = this._root;
        }
        if (t) while(t.right)t = t.right;
        return t;
    };
    Tree2.prototype.at = function(index) {
        var current = this._root;
        var done = false;
        var i = 0;
        var Q = [];
        while(!done){
            if (current) {
                Q.push(current);
                current = current.left;
            } else {
                if (Q.length > 0) {
                    current = Q.pop();
                    if (i === index) return current;
                    i++;
                    current = current.right;
                } else done = true;
            }
        }
        return null;
    };
    Tree2.prototype.next = function(d) {
        var root = this._root;
        var successor = null;
        if (d.right) {
            successor = d.right;
            while(successor.left)successor = successor.left;
            return successor;
        }
        var comparator = this._comparator;
        while(root){
            var cmp = comparator(d.key, root.key);
            if (cmp === 0) break;
            else if (cmp < 0) {
                successor = root;
                root = root.left;
            } else root = root.right;
        }
        return successor;
    };
    Tree2.prototype.prev = function(d) {
        var root = this._root;
        var predecessor = null;
        if (d.left !== null) {
            predecessor = d.left;
            while(predecessor.right)predecessor = predecessor.right;
            return predecessor;
        }
        var comparator = this._comparator;
        while(root){
            var cmp = comparator(d.key, root.key);
            if (cmp === 0) break;
            else if (cmp < 0) root = root.left;
            else {
                predecessor = root;
                root = root.right;
            }
        }
        return predecessor;
    };
    Tree2.prototype.clear = function() {
        this._root = null;
        this._size = 0;
        return this;
    };
    Tree2.prototype.toList = function() {
        return toList(this._root);
    };
    Tree2.prototype.load = function(keys, values, presort) {
        if (values === void 0) {
            values = [];
        }
        if (presort === void 0) {
            presort = false;
        }
        var size = keys.length;
        var comparator = this._comparator;
        if (presort) sort(keys, values, 0, size - 1, comparator);
        if (this._root === null) {
            this._root = loadRecursive(keys, values, 0, size);
            this._size = size;
        } else {
            var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);
            size = this._size + size;
            this._root = sortedListToBST({
                head: mergedList
            }, 0, size);
        }
        return this;
    };
    Tree2.prototype.isEmpty = function() {
        return this._root === null;
    };
    Object.defineProperty(Tree2.prototype, "size", {
        get: function() {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tree2.prototype, "root", {
        get: function() {
            return this._root;
        },
        enumerable: true,
        configurable: true
    });
    Tree2.prototype.toString = function(printNode) {
        if (printNode === void 0) {
            printNode = function(n) {
                return String(n.key);
            };
        }
        var out = [];
        printRow(this._root, "", true, function(v) {
            return out.push(v);
        }, printNode);
        return out.join("");
    };
    Tree2.prototype.update = function(key, newKey, newData) {
        var comparator = this._comparator;
        var _a = split(key, this._root, comparator), left = _a.left, right = _a.right;
        if (comparator(key, newKey) < 0) {
            right = insert(newKey, newData, right, comparator);
        } else {
            left = insert(newKey, newData, left, comparator);
        }
        this._root = merge(left, right, comparator);
    };
    Tree2.prototype.split = function(key) {
        return split(key, this._root, this._comparator);
    };
    return Tree2;
}();
function loadRecursive(keys, values, start, end) {
    var size = end - start;
    if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var key = keys[middle];
        var data = values[middle];
        var node = new Node1(key, data);
        node.left = loadRecursive(keys, values, start, middle);
        node.right = loadRecursive(keys, values, middle + 1, end);
        return node;
    }
    return null;
}
function createList(keys, values) {
    var head = new Node1(null, null);
    var p = head;
    for(var i = 0; i < keys.length; i++){
        p = p.next = new Node1(keys[i], values[i]);
    }
    p.next = null;
    return head.next;
}
function toList(root) {
    var current = root;
    var Q = [];
    var done = false;
    var head = new Node1(null, null);
    var p = head;
    while(!done){
        if (current) {
            Q.push(current);
            current = current.left;
        } else {
            if (Q.length > 0) {
                current = p = p.next = Q.pop();
                current = current.right;
            } else done = true;
        }
    }
    p.next = null;
    return head.next;
}
function sortedListToBST(list, start, end) {
    var size = end - start;
    if (size > 0) {
        var middle = start + Math.floor(size / 2);
        var left = sortedListToBST(list, start, middle);
        var root = list.head;
        root.left = left;
        list.head = list.head.next;
        root.right = sortedListToBST(list, middle + 1, end);
        return root;
    }
    return null;
}
function mergeLists(l1, l2, compare) {
    var head = new Node1(null, null);
    var p = head;
    var p1 = l1;
    var p2 = l2;
    while(p1 !== null && p2 !== null){
        if (compare(p1.key, p2.key) < 0) {
            p.next = p1;
            p1 = p1.next;
        } else {
            p.next = p2;
            p2 = p2.next;
        }
        p = p.next;
    }
    if (p1 !== null) {
        p.next = p1;
    } else if (p2 !== null) {
        p.next = p2;
    }
    return head.next;
}
function sort(keys, values, left, right, compare) {
    if (left >= right) return;
    var pivot = keys[left + right >> 1];
    var i = left - 1;
    var j = right + 1;
    while(true){
        do i++;
        while (compare(keys[i], pivot) < 0)
        do j--;
        while (compare(keys[j], pivot) > 0)
        if (i >= j) break;
        var tmp = keys[i];
        keys[i] = keys[j];
        keys[j] = tmp;
        tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
    }
    sort(keys, values, left, j, compare);
    sort(keys, values, j + 1, right, compare);
}
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== "undefined") {
    globalContext = window;
} else if (typeof self !== "undefined") {
    globalContext = self;
} else {
    globalContext = {
    };
}
if (typeof globalContext.setTimeout === "function") {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === "function") {
    cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e2) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}
function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while((++queueIndex) < len){
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for(var i = 1; i < arguments.length; i++){
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var argv = [];
var version = "";
var versions = {
};
var release = {
};
var config = {
};
function noop() {
}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
    throw new Error("process.binding is not supported");
}
function cwd() {
    return "/";
}
function chdir(dir) {
    throw new Error("process.chdir is not supported");
}
function umask() {
    return 0;
}
var performance = globalContext.performance || {
};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
    return new Date().getTime();
};
function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance) * 0.001;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor(clocktime % 1 * 1000000000);
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1000000000;
        }
    }
    return [
        seconds,
        nanoseconds
    ];
}
var startTime = new Date();
function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
}
var process = {
    nextTick,
    title,
    browser,
    env: {
        NODE_ENV: "production"
    },
    argv,
    version,
    versions,
    on,
    addListener,
    once,
    off,
    removeListener,
    removeAllListeners,
    emit,
    binding,
    cwd,
    chdir,
    umask,
    hrtime,
    platform,
    release,
    config,
    uptime
};
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var isInBbox = function isInBbox2(bbox, point) {
    return bbox.ll.x <= point.x && point.x <= bbox.ur.x && bbox.ll.y <= point.y && point.y <= bbox.ur.y;
};
var getBboxOverlap = function getBboxOverlap2(b1, b2) {
    if (b2.ur.x < b1.ll.x || b1.ur.x < b2.ll.x || b2.ur.y < b1.ll.y || b1.ur.y < b2.ll.y) return null;
    var lowerX = b1.ll.x < b2.ll.x ? b2.ll.x : b1.ll.x;
    var upperX = b1.ur.x < b2.ur.x ? b1.ur.x : b2.ur.x;
    var lowerY = b1.ll.y < b2.ll.y ? b2.ll.y : b1.ll.y;
    var upperY = b1.ur.y < b2.ur.y ? b1.ur.y : b2.ur.y;
    return {
        ll: {
            x: lowerX,
            y: lowerY
        },
        ur: {
            x: upperX,
            y: upperY
        }
    };
};
var epsilon = Number.EPSILON;
if (epsilon === void 0) epsilon = Math.pow(2, -52);
var EPSILON_SQ = epsilon * epsilon;
var cmp = function cmp2(a, b) {
    if (-epsilon < a && a < epsilon) {
        if (-epsilon < b && b < epsilon) {
            return 0;
        }
    }
    var ab = a - b;
    if (ab * ab < EPSILON_SQ * a * b) {
        return 0;
    }
    return a < b ? -1 : 1;
};
var PtRounder = function() {
    function PtRounder2() {
        _classCallCheck(this, PtRounder2);
        this.reset();
    }
    _createClass(PtRounder2, [
        {
            key: "reset",
            value: function reset() {
                this.xRounder = new CoordRounder();
                this.yRounder = new CoordRounder();
            }
        },
        {
            key: "round",
            value: function round(x, y) {
                return {
                    x: this.xRounder.round(x),
                    y: this.yRounder.round(y)
                };
            }
        }
    ]);
    return PtRounder2;
}();
var CoordRounder = function() {
    function CoordRounder2() {
        _classCallCheck(this, CoordRounder2);
        this.tree = new Tree();
        this.round(0);
    }
    _createClass(CoordRounder2, [
        {
            key: "round",
            value: function round(coord) {
                var node = this.tree.add(coord);
                var prevNode = this.tree.prev(node);
                if (prevNode !== null && cmp(node.key, prevNode.key) === 0) {
                    this.tree.remove(coord);
                    return prevNode.key;
                }
                var nextNode = this.tree.next(node);
                if (nextNode !== null && cmp(node.key, nextNode.key) === 0) {
                    this.tree.remove(coord);
                    return nextNode.key;
                }
                return coord;
            }
        }
    ]);
    return CoordRounder2;
}();
var rounder = new PtRounder();
var crossProduct = function crossProduct2(a, b) {
    return a.x * b.y - a.y * b.x;
};
var dotProduct = function dotProduct2(a, b) {
    return a.x * b.x + a.y * b.y;
};
var compareVectorAngles = function compareVectorAngles2(basePt, endPt1, endPt2) {
    var v1 = {
        x: endPt1.x - basePt.x,
        y: endPt1.y - basePt.y
    };
    var v2 = {
        x: endPt2.x - basePt.x,
        y: endPt2.y - basePt.y
    };
    var kross = crossProduct(v1, v2);
    return cmp(kross, 0);
};
var length = function length2(v) {
    return Math.sqrt(dotProduct(v, v));
};
var sineOfAngle = function sineOfAngle2(pShared, pBase, pAngle) {
    var vBase = {
        x: pBase.x - pShared.x,
        y: pBase.y - pShared.y
    };
    var vAngle = {
        x: pAngle.x - pShared.x,
        y: pAngle.y - pShared.y
    };
    return crossProduct(vAngle, vBase) / length(vAngle) / length(vBase);
};
var cosineOfAngle = function cosineOfAngle2(pShared, pBase, pAngle) {
    var vBase = {
        x: pBase.x - pShared.x,
        y: pBase.y - pShared.y
    };
    var vAngle = {
        x: pAngle.x - pShared.x,
        y: pAngle.y - pShared.y
    };
    return dotProduct(vAngle, vBase) / length(vAngle) / length(vBase);
};
var horizontalIntersection = function horizontalIntersection2(pt, v, y) {
    if (v.y === 0) return null;
    return {
        x: pt.x + v.x / v.y * (y - pt.y),
        y
    };
};
var verticalIntersection = function verticalIntersection2(pt, v, x) {
    if (v.x === 0) return null;
    return {
        x,
        y: pt.y + v.y / v.x * (x - pt.x)
    };
};
var intersection = function intersection2(pt1, v1, pt2, v2) {
    if (v1.x === 0) return verticalIntersection(pt2, v2, pt1.x);
    if (v2.x === 0) return verticalIntersection(pt1, v1, pt2.x);
    if (v1.y === 0) return horizontalIntersection(pt2, v2, pt1.y);
    if (v2.y === 0) return horizontalIntersection(pt1, v1, pt2.y);
    var kross = crossProduct(v1, v2);
    if (kross == 0) return null;
    var ve = {
        x: pt2.x - pt1.x,
        y: pt2.y - pt1.y
    };
    var d1 = crossProduct(ve, v1) / kross;
    var d2 = crossProduct(ve, v2) / kross;
    var x1 = pt1.x + d2 * v1.x, x2 = pt2.x + d1 * v2.x;
    var y1 = pt1.y + d2 * v1.y, y2 = pt2.y + d1 * v2.y;
    var x = (x1 + x2) / 2;
    var y = (y1 + y2) / 2;
    return {
        x,
        y
    };
};
var SweepEvent = function() {
    _createClass(SweepEvent2, null, [
        {
            key: "compare",
            value: function compare(a, b) {
                var ptCmp = SweepEvent2.comparePoints(a.point, b.point);
                if (ptCmp !== 0) return ptCmp;
                if (a.point !== b.point) a.link(b);
                if (a.isLeft !== b.isLeft) return a.isLeft ? 1 : -1;
                return Segment.compare(a.segment, b.segment);
            }
        },
        {
            key: "comparePoints",
            value: function comparePoints(aPt, bPt) {
                if (aPt.x < bPt.x) return -1;
                if (aPt.x > bPt.x) return 1;
                if (aPt.y < bPt.y) return -1;
                if (aPt.y > bPt.y) return 1;
                return 0;
            }
        }
    ]);
    function SweepEvent2(point, isLeft) {
        _classCallCheck(this, SweepEvent2);
        if (point.events === void 0) point.events = [
            this
        ];
        else point.events.push(this);
        this.point = point;
        this.isLeft = isLeft;
    }
    _createClass(SweepEvent2, [
        {
            key: "link",
            value: function link(other) {
                if (other.point === this.point) {
                    throw new Error("Tried to link already linked events");
                }
                var otherEvents = other.point.events;
                for(var i = 0, iMax = otherEvents.length; i < iMax; i++){
                    var evt = otherEvents[i];
                    this.point.events.push(evt);
                    evt.point = this.point;
                }
                this.checkForConsuming();
            }
        },
        {
            key: "checkForConsuming",
            value: function checkForConsuming() {
                var numEvents = this.point.events.length;
                for(var i = 0; i < numEvents; i++){
                    var evt1 = this.point.events[i];
                    if (evt1.segment.consumedBy !== void 0) continue;
                    for(var j = i + 1; j < numEvents; j++){
                        var evt2 = this.point.events[j];
                        if (evt2.consumedBy !== void 0) continue;
                        if (evt1.otherSE.point.events !== evt2.otherSE.point.events) continue;
                        evt1.segment.consume(evt2.segment);
                    }
                }
            }
        },
        {
            key: "getAvailableLinkedEvents",
            value: function getAvailableLinkedEvents() {
                var events = [];
                for(var i = 0, iMax = this.point.events.length; i < iMax; i++){
                    var evt = this.point.events[i];
                    if (evt !== this && !evt.segment.ringOut && evt.segment.isInResult()) {
                        events.push(evt);
                    }
                }
                return events;
            }
        },
        {
            key: "getLeftmostComparator",
            value: function getLeftmostComparator(baseEvent) {
                var _this = this;
                var cache = new Map();
                var fillCache = function fillCache2(linkedEvent) {
                    var nextEvent = linkedEvent.otherSE;
                    cache.set(linkedEvent, {
                        sine: sineOfAngle(_this.point, baseEvent.point, nextEvent.point),
                        cosine: cosineOfAngle(_this.point, baseEvent.point, nextEvent.point)
                    });
                };
                return function(a, b) {
                    if (!cache.has(a)) fillCache(a);
                    if (!cache.has(b)) fillCache(b);
                    var _cache$get = cache.get(a), asine = _cache$get.sine, acosine = _cache$get.cosine;
                    var _cache$get2 = cache.get(b), bsine = _cache$get2.sine, bcosine = _cache$get2.cosine;
                    if (asine >= 0 && bsine >= 0) {
                        if (acosine < bcosine) return 1;
                        if (acosine > bcosine) return -1;
                        return 0;
                    }
                    if (asine < 0 && bsine < 0) {
                        if (acosine < bcosine) return -1;
                        if (acosine > bcosine) return 1;
                        return 0;
                    }
                    if (bsine < asine) return -1;
                    if (bsine > asine) return 1;
                    return 0;
                };
            }
        }
    ]);
    return SweepEvent2;
}();
var segmentId = 0;
var Segment = function() {
    _createClass(Segment2, null, [
        {
            key: "compare",
            value: function compare(a, b) {
                var alx = a.leftSE.point.x;
                var blx = b.leftSE.point.x;
                var arx = a.rightSE.point.x;
                var brx = b.rightSE.point.x;
                if (brx < alx) return 1;
                if (arx < blx) return -1;
                var aly = a.leftSE.point.y;
                var bly = b.leftSE.point.y;
                var ary = a.rightSE.point.y;
                var bry = b.rightSE.point.y;
                if (alx < blx) {
                    if (bly < aly && bly < ary) return 1;
                    if (bly > aly && bly > ary) return -1;
                    var aCmpBLeft = a.comparePoint(b.leftSE.point);
                    if (aCmpBLeft < 0) return 1;
                    if (aCmpBLeft > 0) return -1;
                    var bCmpARight = b.comparePoint(a.rightSE.point);
                    if (bCmpARight !== 0) return bCmpARight;
                    return -1;
                }
                if (alx > blx) {
                    if (aly < bly && aly < bry) return -1;
                    if (aly > bly && aly > bry) return 1;
                    var bCmpALeft = b.comparePoint(a.leftSE.point);
                    if (bCmpALeft !== 0) return bCmpALeft;
                    var aCmpBRight = a.comparePoint(b.rightSE.point);
                    if (aCmpBRight < 0) return 1;
                    if (aCmpBRight > 0) return -1;
                    return 1;
                }
                if (aly < bly) return -1;
                if (aly > bly) return 1;
                if (arx < brx) {
                    var _bCmpARight = b.comparePoint(a.rightSE.point);
                    if (_bCmpARight !== 0) return _bCmpARight;
                }
                if (arx > brx) {
                    var _aCmpBRight = a.comparePoint(b.rightSE.point);
                    if (_aCmpBRight < 0) return 1;
                    if (_aCmpBRight > 0) return -1;
                }
                if (arx !== brx) {
                    var ay = ary - aly;
                    var ax = arx - alx;
                    var by = bry - bly;
                    var bx = brx - blx;
                    if (ay > ax && by < bx) return 1;
                    if (ay < ax && by > bx) return -1;
                }
                if (arx > brx) return 1;
                if (arx < brx) return -1;
                if (ary < bry) return -1;
                if (ary > bry) return 1;
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            }
        }
    ]);
    function Segment2(leftSE, rightSE, rings, windings) {
        _classCallCheck(this, Segment2);
        this.id = ++segmentId;
        this.leftSE = leftSE;
        leftSE.segment = this;
        leftSE.otherSE = rightSE;
        this.rightSE = rightSE;
        rightSE.segment = this;
        rightSE.otherSE = leftSE;
        this.rings = rings;
        this.windings = windings;
    }
    _createClass(Segment2, [
        {
            key: "replaceRightSE",
            value: function replaceRightSE(newRightSE) {
                this.rightSE = newRightSE;
                this.rightSE.segment = this;
                this.rightSE.otherSE = this.leftSE;
                this.leftSE.otherSE = this.rightSE;
            }
        },
        {
            key: "bbox",
            value: function bbox() {
                var y1 = this.leftSE.point.y;
                var y2 = this.rightSE.point.y;
                return {
                    ll: {
                        x: this.leftSE.point.x,
                        y: y1 < y2 ? y1 : y2
                    },
                    ur: {
                        x: this.rightSE.point.x,
                        y: y1 > y2 ? y1 : y2
                    }
                };
            }
        },
        {
            key: "vector",
            value: function vector() {
                return {
                    x: this.rightSE.point.x - this.leftSE.point.x,
                    y: this.rightSE.point.y - this.leftSE.point.y
                };
            }
        },
        {
            key: "isAnEndpoint",
            value: function isAnEndpoint(pt) {
                return pt.x === this.leftSE.point.x && pt.y === this.leftSE.point.y || pt.x === this.rightSE.point.x && pt.y === this.rightSE.point.y;
            }
        },
        {
            key: "comparePoint",
            value: function comparePoint(point) {
                if (this.isAnEndpoint(point)) return 0;
                var lPt = this.leftSE.point;
                var rPt = this.rightSE.point;
                var v = this.vector();
                if (lPt.x === rPt.x) {
                    if (point.x === lPt.x) return 0;
                    return point.x < lPt.x ? 1 : -1;
                }
                var yDist = (point.y - lPt.y) / v.y;
                var xFromYDist = lPt.x + yDist * v.x;
                if (point.x === xFromYDist) return 0;
                var xDist = (point.x - lPt.x) / v.x;
                var yFromXDist = lPt.y + xDist * v.y;
                if (point.y === yFromXDist) return 0;
                return point.y < yFromXDist ? -1 : 1;
            }
        },
        {
            key: "getIntersection",
            value: function getIntersection(other) {
                var tBbox = this.bbox();
                var oBbox = other.bbox();
                var bboxOverlap = getBboxOverlap(tBbox, oBbox);
                if (bboxOverlap === null) return null;
                var tlp = this.leftSE.point;
                var trp = this.rightSE.point;
                var olp = other.leftSE.point;
                var orp = other.rightSE.point;
                var touchesOtherLSE = isInBbox(tBbox, olp) && this.comparePoint(olp) === 0;
                var touchesThisLSE = isInBbox(oBbox, tlp) && other.comparePoint(tlp) === 0;
                var touchesOtherRSE = isInBbox(tBbox, orp) && this.comparePoint(orp) === 0;
                var touchesThisRSE = isInBbox(oBbox, trp) && other.comparePoint(trp) === 0;
                if (touchesThisLSE && touchesOtherLSE) {
                    if (touchesThisRSE && !touchesOtherRSE) return trp;
                    if (!touchesThisRSE && touchesOtherRSE) return orp;
                    return null;
                }
                if (touchesThisLSE) {
                    if (touchesOtherRSE) {
                        if (tlp.x === orp.x && tlp.y === orp.y) return null;
                    }
                    return tlp;
                }
                if (touchesOtherLSE) {
                    if (touchesThisRSE) {
                        if (trp.x === olp.x && trp.y === olp.y) return null;
                    }
                    return olp;
                }
                if (touchesThisRSE && touchesOtherRSE) return null;
                if (touchesThisRSE) return trp;
                if (touchesOtherRSE) return orp;
                var pt = intersection(tlp, this.vector(), olp, other.vector());
                if (pt === null) return null;
                if (!isInBbox(bboxOverlap, pt)) return null;
                return rounder.round(pt.x, pt.y);
            }
        },
        {
            key: "split",
            value: function split1(point) {
                var newEvents = [];
                var alreadyLinked = point.events !== void 0;
                var newLeftSE = new SweepEvent(point, true);
                var newRightSE = new SweepEvent(point, false);
                var oldRightSE = this.rightSE;
                this.replaceRightSE(newRightSE);
                newEvents.push(newRightSE);
                newEvents.push(newLeftSE);
                var newSeg = new Segment2(newLeftSE, oldRightSE, this.rings.slice(), this.windings.slice());
                if (SweepEvent.comparePoints(newSeg.leftSE.point, newSeg.rightSE.point) > 0) {
                    newSeg.swapEvents();
                }
                if (SweepEvent.comparePoints(this.leftSE.point, this.rightSE.point) > 0) {
                    this.swapEvents();
                }
                if (alreadyLinked) {
                    newLeftSE.checkForConsuming();
                    newRightSE.checkForConsuming();
                }
                return newEvents;
            }
        },
        {
            key: "swapEvents",
            value: function swapEvents() {
                var tmpEvt = this.rightSE;
                this.rightSE = this.leftSE;
                this.leftSE = tmpEvt;
                this.leftSE.isLeft = true;
                this.rightSE.isLeft = false;
                for(var i = 0, iMax = this.windings.length; i < iMax; i++){
                    this.windings[i] *= -1;
                }
            }
        },
        {
            key: "consume",
            value: function consume(other) {
                var consumer = this;
                var consumee = other;
                while(consumer.consumedBy){
                    consumer = consumer.consumedBy;
                }
                while(consumee.consumedBy){
                    consumee = consumee.consumedBy;
                }
                var cmp3 = Segment2.compare(consumer, consumee);
                if (cmp3 === 0) return;
                if (cmp3 > 0) {
                    var tmp = consumer;
                    consumer = consumee;
                    consumee = tmp;
                }
                if (consumer.prev === consumee) {
                    var _tmp = consumer;
                    consumer = consumee;
                    consumee = _tmp;
                }
                for(var i = 0, iMax = consumee.rings.length; i < iMax; i++){
                    var ring = consumee.rings[i];
                    var winding = consumee.windings[i];
                    var index2 = consumer.rings.indexOf(ring);
                    if (index2 === -1) {
                        consumer.rings.push(ring);
                        consumer.windings.push(winding);
                    } else consumer.windings[index2] += winding;
                }
                consumee.rings = null;
                consumee.windings = null;
                consumee.consumedBy = consumer;
                consumee.leftSE.consumedBy = consumer.leftSE;
                consumee.rightSE.consumedBy = consumer.rightSE;
            }
        },
        {
            key: "prevInResult",
            value: function prevInResult() {
                if (this._prevInResult !== void 0) return this._prevInResult;
                if (!this.prev) this._prevInResult = null;
                else if (this.prev.isInResult()) this._prevInResult = this.prev;
                else this._prevInResult = this.prev.prevInResult();
                return this._prevInResult;
            }
        },
        {
            key: "beforeState",
            value: function beforeState() {
                if (this._beforeState !== void 0) return this._beforeState;
                if (!this.prev) this._beforeState = {
                    rings: [],
                    windings: [],
                    multiPolys: []
                };
                else {
                    var seg = this.prev.consumedBy || this.prev;
                    this._beforeState = seg.afterState();
                }
                return this._beforeState;
            }
        },
        {
            key: "afterState",
            value: function afterState() {
                if (this._afterState !== void 0) return this._afterState;
                var beforeState = this.beforeState();
                this._afterState = {
                    rings: beforeState.rings.slice(0),
                    windings: beforeState.windings.slice(0),
                    multiPolys: []
                };
                var ringsAfter = this._afterState.rings;
                var windingsAfter = this._afterState.windings;
                var mpsAfter = this._afterState.multiPolys;
                for(var i = 0, iMax = this.rings.length; i < iMax; i++){
                    var ring = this.rings[i];
                    var winding = this.windings[i];
                    var index2 = ringsAfter.indexOf(ring);
                    if (index2 === -1) {
                        ringsAfter.push(ring);
                        windingsAfter.push(winding);
                    } else windingsAfter[index2] += winding;
                }
                var polysAfter = [];
                var polysExclude = [];
                for(var _i = 0, _iMax = ringsAfter.length; _i < _iMax; _i++){
                    if (windingsAfter[_i] === 0) continue;
                    var _ring = ringsAfter[_i];
                    var poly = _ring.poly;
                    if (polysExclude.indexOf(poly) !== -1) continue;
                    if (_ring.isExterior) polysAfter.push(poly);
                    else {
                        if (polysExclude.indexOf(poly) === -1) polysExclude.push(poly);
                        var _index = polysAfter.indexOf(_ring.poly);
                        if (_index !== -1) polysAfter.splice(_index, 1);
                    }
                }
                for(var _i2 = 0, _iMax2 = polysAfter.length; _i2 < _iMax2; _i2++){
                    var mp = polysAfter[_i2].multiPoly;
                    if (mpsAfter.indexOf(mp) === -1) mpsAfter.push(mp);
                }
                return this._afterState;
            }
        },
        {
            key: "isInResult",
            value: function isInResult() {
                if (this.consumedBy) return false;
                if (this._isInResult !== void 0) return this._isInResult;
                var mpsBefore = this.beforeState().multiPolys;
                var mpsAfter = this.afterState().multiPolys;
                switch(operation.type){
                    case "union":
                        {
                            var noBefores = mpsBefore.length === 0;
                            var noAfters = mpsAfter.length === 0;
                            this._isInResult = noBefores !== noAfters;
                            break;
                        }
                    case "intersection":
                        {
                            var least;
                            var most;
                            if (mpsBefore.length < mpsAfter.length) {
                                least = mpsBefore.length;
                                most = mpsAfter.length;
                            } else {
                                least = mpsAfter.length;
                                most = mpsBefore.length;
                            }
                            this._isInResult = most === operation.numMultiPolys && least < most;
                            break;
                        }
                    case "xor":
                        {
                            var diff = Math.abs(mpsBefore.length - mpsAfter.length);
                            this._isInResult = diff % 2 === 1;
                            break;
                        }
                    case "difference":
                        {
                            var isJustSubject = function isJustSubject2(mps) {
                                return mps.length === 1 && mps[0].isSubject;
                            };
                            this._isInResult = isJustSubject(mpsBefore) !== isJustSubject(mpsAfter);
                            break;
                        }
                    default:
                        throw new Error("Unrecognized operation type found ".concat(operation.type));
                }
                return this._isInResult;
            }
        }
    ], [
        {
            key: "fromRing",
            value: function fromRing(pt1, pt2, ring) {
                var leftPt, rightPt, winding;
                var cmpPts = SweepEvent.comparePoints(pt1, pt2);
                if (cmpPts < 0) {
                    leftPt = pt1;
                    rightPt = pt2;
                    winding = 1;
                } else if (cmpPts > 0) {
                    leftPt = pt2;
                    rightPt = pt1;
                    winding = -1;
                } else throw new Error("Tried to create degenerate segment at [".concat(pt1.x, ", ").concat(pt1.y, "]"));
                var leftSE = new SweepEvent(leftPt, true);
                var rightSE = new SweepEvent(rightPt, false);
                return new Segment2(leftSE, rightSE, [
                    ring
                ], [
                    winding
                ]);
            }
        }
    ]);
    return Segment2;
}();
var RingIn = function() {
    function RingIn2(geomRing, poly, isExterior) {
        _classCallCheck(this, RingIn2);
        if (!Array.isArray(geomRing) || geomRing.length === 0) {
            throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        this.poly = poly;
        this.isExterior = isExterior;
        this.segments = [];
        if (typeof geomRing[0][0] !== "number" || typeof geomRing[0][1] !== "number") {
            throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        var firstPoint = rounder.round(geomRing[0][0], geomRing[0][1]);
        this.bbox = {
            ll: {
                x: firstPoint.x,
                y: firstPoint.y
            },
            ur: {
                x: firstPoint.x,
                y: firstPoint.y
            }
        };
        var prevPoint = firstPoint;
        for(var i = 1, iMax = geomRing.length; i < iMax; i++){
            if (typeof geomRing[i][0] !== "number" || typeof geomRing[i][1] !== "number") {
                throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
            }
            var point = rounder.round(geomRing[i][0], geomRing[i][1]);
            if (point.x === prevPoint.x && point.y === prevPoint.y) continue;
            this.segments.push(Segment.fromRing(prevPoint, point, this));
            if (point.x < this.bbox.ll.x) this.bbox.ll.x = point.x;
            if (point.y < this.bbox.ll.y) this.bbox.ll.y = point.y;
            if (point.x > this.bbox.ur.x) this.bbox.ur.x = point.x;
            if (point.y > this.bbox.ur.y) this.bbox.ur.y = point.y;
            prevPoint = point;
        }
        if (firstPoint.x !== prevPoint.x || firstPoint.y !== prevPoint.y) {
            this.segments.push(Segment.fromRing(prevPoint, firstPoint, this));
        }
    }
    _createClass(RingIn2, [
        {
            key: "getSweepEvents",
            value: function getSweepEvents() {
                var sweepEvents = [];
                for(var i = 0, iMax = this.segments.length; i < iMax; i++){
                    var segment = this.segments[i];
                    sweepEvents.push(segment.leftSE);
                    sweepEvents.push(segment.rightSE);
                }
                return sweepEvents;
            }
        }
    ]);
    return RingIn2;
}();
var PolyIn = function() {
    function PolyIn2(geomPoly, multiPoly) {
        _classCallCheck(this, PolyIn2);
        if (!Array.isArray(geomPoly)) {
            throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        this.exteriorRing = new RingIn(geomPoly[0], this, true);
        this.bbox = {
            ll: {
                x: this.exteriorRing.bbox.ll.x,
                y: this.exteriorRing.bbox.ll.y
            },
            ur: {
                x: this.exteriorRing.bbox.ur.x,
                y: this.exteriorRing.bbox.ur.y
            }
        };
        this.interiorRings = [];
        for(var i = 1, iMax = geomPoly.length; i < iMax; i++){
            var ring = new RingIn(geomPoly[i], this, false);
            if (ring.bbox.ll.x < this.bbox.ll.x) this.bbox.ll.x = ring.bbox.ll.x;
            if (ring.bbox.ll.y < this.bbox.ll.y) this.bbox.ll.y = ring.bbox.ll.y;
            if (ring.bbox.ur.x > this.bbox.ur.x) this.bbox.ur.x = ring.bbox.ur.x;
            if (ring.bbox.ur.y > this.bbox.ur.y) this.bbox.ur.y = ring.bbox.ur.y;
            this.interiorRings.push(ring);
        }
        this.multiPoly = multiPoly;
    }
    _createClass(PolyIn2, [
        {
            key: "getSweepEvents",
            value: function getSweepEvents() {
                var sweepEvents = this.exteriorRing.getSweepEvents();
                for(var i = 0, iMax = this.interiorRings.length; i < iMax; i++){
                    var ringSweepEvents = this.interiorRings[i].getSweepEvents();
                    for(var j = 0, jMax = ringSweepEvents.length; j < jMax; j++){
                        sweepEvents.push(ringSweepEvents[j]);
                    }
                }
                return sweepEvents;
            }
        }
    ]);
    return PolyIn2;
}();
var MultiPolyIn = function() {
    function MultiPolyIn2(geom, isSubject) {
        _classCallCheck(this, MultiPolyIn2);
        if (!Array.isArray(geom)) {
            throw new Error("Input geometry is not a valid Polygon or MultiPolygon");
        }
        try {
            if (typeof geom[0][0][0] === "number") geom = [
                geom
            ];
        } catch (ex) {
        }
        this.polys = [];
        this.bbox = {
            ll: {
                x: Number.POSITIVE_INFINITY,
                y: Number.POSITIVE_INFINITY
            },
            ur: {
                x: Number.NEGATIVE_INFINITY,
                y: Number.NEGATIVE_INFINITY
            }
        };
        for(var i = 0, iMax = geom.length; i < iMax; i++){
            var poly = new PolyIn(geom[i], this);
            if (poly.bbox.ll.x < this.bbox.ll.x) this.bbox.ll.x = poly.bbox.ll.x;
            if (poly.bbox.ll.y < this.bbox.ll.y) this.bbox.ll.y = poly.bbox.ll.y;
            if (poly.bbox.ur.x > this.bbox.ur.x) this.bbox.ur.x = poly.bbox.ur.x;
            if (poly.bbox.ur.y > this.bbox.ur.y) this.bbox.ur.y = poly.bbox.ur.y;
            this.polys.push(poly);
        }
        this.isSubject = isSubject;
    }
    _createClass(MultiPolyIn2, [
        {
            key: "getSweepEvents",
            value: function getSweepEvents() {
                var sweepEvents = [];
                for(var i = 0, iMax = this.polys.length; i < iMax; i++){
                    var polySweepEvents = this.polys[i].getSweepEvents();
                    for(var j = 0, jMax = polySweepEvents.length; j < jMax; j++){
                        sweepEvents.push(polySweepEvents[j]);
                    }
                }
                return sweepEvents;
            }
        }
    ]);
    return MultiPolyIn2;
}();
var RingOut = function() {
    _createClass(RingOut2, null, [
        {
            key: "factory",
            value: function factory(allSegments) {
                var ringsOut = [];
                for(var i = 0, iMax = allSegments.length; i < iMax; i++){
                    var segment = allSegments[i];
                    if (!segment.isInResult() || segment.ringOut) continue;
                    var prevEvent = null;
                    var event = segment.leftSE;
                    var nextEvent = segment.rightSE;
                    var events = [
                        event
                    ];
                    var startingPoint = event.point;
                    var intersectionLEs = [];
                    while(true){
                        prevEvent = event;
                        event = nextEvent;
                        events.push(event);
                        if (event.point === startingPoint) break;
                        while(true){
                            var availableLEs = event.getAvailableLinkedEvents();
                            if (availableLEs.length === 0) {
                                var firstPt = events[0].point;
                                var lastPt = events[events.length - 1].point;
                                throw new Error("Unable to complete output ring starting at [".concat(firstPt.x, ",") + " ".concat(firstPt.y, "]. Last matching segment found ends at") + " [".concat(lastPt.x, ", ").concat(lastPt.y, "]."));
                            }
                            if (availableLEs.length === 1) {
                                nextEvent = availableLEs[0].otherSE;
                                break;
                            }
                            var indexLE = null;
                            for(var j = 0, jMax = intersectionLEs.length; j < jMax; j++){
                                if (intersectionLEs[j].point === event.point) {
                                    indexLE = j;
                                    break;
                                }
                            }
                            if (indexLE !== null) {
                                var intersectionLE = intersectionLEs.splice(indexLE)[0];
                                var ringEvents = events.splice(intersectionLE.index);
                                ringEvents.unshift(ringEvents[0].otherSE);
                                ringsOut.push(new RingOut2(ringEvents.reverse()));
                                continue;
                            }
                            intersectionLEs.push({
                                index: events.length,
                                point: event.point
                            });
                            var comparator = event.getLeftmostComparator(prevEvent);
                            nextEvent = availableLEs.sort(comparator)[0].otherSE;
                            break;
                        }
                    }
                    ringsOut.push(new RingOut2(events));
                }
                return ringsOut;
            }
        }
    ]);
    function RingOut2(events) {
        _classCallCheck(this, RingOut2);
        this.events = events;
        for(var i = 0, iMax = events.length; i < iMax; i++){
            events[i].segment.ringOut = this;
        }
        this.poly = null;
    }
    _createClass(RingOut2, [
        {
            key: "getGeom",
            value: function getGeom() {
                var prevPt = this.events[0].point;
                var points = [
                    prevPt
                ];
                for(var i = 1, iMax = this.events.length - 1; i < iMax; i++){
                    var _pt = this.events[i].point;
                    var _nextPt = this.events[i + 1].point;
                    if (compareVectorAngles(_pt, prevPt, _nextPt) === 0) continue;
                    points.push(_pt);
                    prevPt = _pt;
                }
                if (points.length === 1) return null;
                var pt = points[0];
                var nextPt = points[1];
                if (compareVectorAngles(pt, prevPt, nextPt) === 0) points.shift();
                points.push(points[0]);
                var step = this.isExteriorRing() ? 1 : -1;
                var iStart = this.isExteriorRing() ? 0 : points.length - 1;
                var iEnd = this.isExteriorRing() ? points.length : -1;
                var orderedPoints = [];
                for(var _i = iStart; _i != iEnd; _i += step){
                    orderedPoints.push([
                        points[_i].x,
                        points[_i].y
                    ]);
                }
                return orderedPoints;
            }
        },
        {
            key: "isExteriorRing",
            value: function isExteriorRing() {
                if (this._isExteriorRing === void 0) {
                    var enclosing = this.enclosingRing();
                    this._isExteriorRing = enclosing ? !enclosing.isExteriorRing() : true;
                }
                return this._isExteriorRing;
            }
        },
        {
            key: "enclosingRing",
            value: function enclosingRing() {
                if (this._enclosingRing === void 0) {
                    this._enclosingRing = this._calcEnclosingRing();
                }
                return this._enclosingRing;
            }
        },
        {
            key: "_calcEnclosingRing",
            value: function _calcEnclosingRing() {
                var leftMostEvt = this.events[0];
                for(var i = 1, iMax = this.events.length; i < iMax; i++){
                    var evt = this.events[i];
                    if (SweepEvent.compare(leftMostEvt, evt) > 0) leftMostEvt = evt;
                }
                var prevSeg = leftMostEvt.segment.prevInResult();
                var prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;
                while(true){
                    if (!prevSeg) return null;
                    if (!prevPrevSeg) return prevSeg.ringOut;
                    if (prevPrevSeg.ringOut !== prevSeg.ringOut) {
                        if (prevPrevSeg.ringOut.enclosingRing() !== prevSeg.ringOut) {
                            return prevSeg.ringOut;
                        } else return prevSeg.ringOut.enclosingRing();
                    }
                    prevSeg = prevPrevSeg.prevInResult();
                    prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;
                }
            }
        }
    ]);
    return RingOut2;
}();
var PolyOut = function() {
    function PolyOut2(exteriorRing) {
        _classCallCheck(this, PolyOut2);
        this.exteriorRing = exteriorRing;
        exteriorRing.poly = this;
        this.interiorRings = [];
    }
    _createClass(PolyOut2, [
        {
            key: "addInterior",
            value: function addInterior(ring) {
                this.interiorRings.push(ring);
                ring.poly = this;
            }
        },
        {
            key: "getGeom",
            value: function getGeom() {
                var geom = [
                    this.exteriorRing.getGeom()
                ];
                if (geom[0] === null) return null;
                for(var i = 0, iMax = this.interiorRings.length; i < iMax; i++){
                    var ringGeom = this.interiorRings[i].getGeom();
                    if (ringGeom === null) continue;
                    geom.push(ringGeom);
                }
                return geom;
            }
        }
    ]);
    return PolyOut2;
}();
var MultiPolyOut = function() {
    function MultiPolyOut2(rings) {
        _classCallCheck(this, MultiPolyOut2);
        this.rings = rings;
        this.polys = this._composePolys(rings);
    }
    _createClass(MultiPolyOut2, [
        {
            key: "getGeom",
            value: function getGeom() {
                var geom = [];
                for(var i = 0, iMax = this.polys.length; i < iMax; i++){
                    var polyGeom = this.polys[i].getGeom();
                    if (polyGeom === null) continue;
                    geom.push(polyGeom);
                }
                return geom;
            }
        },
        {
            key: "_composePolys",
            value: function _composePolys(rings) {
                var polys = [];
                for(var i = 0, iMax = rings.length; i < iMax; i++){
                    var ring = rings[i];
                    if (ring.poly) continue;
                    if (ring.isExteriorRing()) polys.push(new PolyOut(ring));
                    else {
                        var enclosingRing = ring.enclosingRing();
                        if (!enclosingRing.poly) polys.push(new PolyOut(enclosingRing));
                        enclosingRing.poly.addInterior(ring);
                    }
                }
                return polys;
            }
        }
    ]);
    return MultiPolyOut2;
}();
var SweepLine = function() {
    function SweepLine2(queue2) {
        var comparator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Segment.compare;
        _classCallCheck(this, SweepLine2);
        this.queue = queue2;
        this.tree = new Tree(comparator);
        this.segments = [];
    }
    _createClass(SweepLine2, [
        {
            key: "process",
            value: function process2(event) {
                var segment = event.segment;
                var newEvents = [];
                if (event.consumedBy) {
                    if (event.isLeft) this.queue.remove(event.otherSE);
                    else this.tree.remove(segment);
                    return newEvents;
                }
                var node = event.isLeft ? this.tree.insert(segment) : this.tree.find(segment);
                if (!node) throw new Error("Unable to find segment #".concat(segment.id, " ") + "[".concat(segment.leftSE.point.x, ", ").concat(segment.leftSE.point.y, "] -> ") + "[".concat(segment.rightSE.point.x, ", ").concat(segment.rightSE.point.y, "] ") + "in SweepLine tree. Please submit a bug report.");
                var prevNode = node;
                var nextNode = node;
                var prevSeg = void 0;
                var nextSeg = void 0;
                while(prevSeg === void 0){
                    prevNode = this.tree.prev(prevNode);
                    if (prevNode === null) prevSeg = null;
                    else if (prevNode.key.consumedBy === void 0) prevSeg = prevNode.key;
                }
                while(nextSeg === void 0){
                    nextNode = this.tree.next(nextNode);
                    if (nextNode === null) nextSeg = null;
                    else if (nextNode.key.consumedBy === void 0) nextSeg = nextNode.key;
                }
                if (event.isLeft) {
                    var prevMySplitter = null;
                    if (prevSeg) {
                        var prevInter = prevSeg.getIntersection(segment);
                        if (prevInter !== null) {
                            if (!segment.isAnEndpoint(prevInter)) prevMySplitter = prevInter;
                            if (!prevSeg.isAnEndpoint(prevInter)) {
                                var newEventsFromSplit = this._splitSafely(prevSeg, prevInter);
                                for(var i = 0, iMax = newEventsFromSplit.length; i < iMax; i++){
                                    newEvents.push(newEventsFromSplit[i]);
                                }
                            }
                        }
                    }
                    var nextMySplitter = null;
                    if (nextSeg) {
                        var nextInter = nextSeg.getIntersection(segment);
                        if (nextInter !== null) {
                            if (!segment.isAnEndpoint(nextInter)) nextMySplitter = nextInter;
                            if (!nextSeg.isAnEndpoint(nextInter)) {
                                var _newEventsFromSplit = this._splitSafely(nextSeg, nextInter);
                                for(var _i = 0, _iMax = _newEventsFromSplit.length; _i < _iMax; _i++){
                                    newEvents.push(_newEventsFromSplit[_i]);
                                }
                            }
                        }
                    }
                    if (prevMySplitter !== null || nextMySplitter !== null) {
                        var mySplitter = null;
                        if (prevMySplitter === null) mySplitter = nextMySplitter;
                        else if (nextMySplitter === null) mySplitter = prevMySplitter;
                        else {
                            var cmpSplitters = SweepEvent.comparePoints(prevMySplitter, nextMySplitter);
                            mySplitter = cmpSplitters <= 0 ? prevMySplitter : nextMySplitter;
                        }
                        this.queue.remove(segment.rightSE);
                        newEvents.push(segment.rightSE);
                        var _newEventsFromSplit2 = segment.split(mySplitter);
                        for(var _i2 = 0, _iMax2 = _newEventsFromSplit2.length; _i2 < _iMax2; _i2++){
                            newEvents.push(_newEventsFromSplit2[_i2]);
                        }
                    }
                    if (newEvents.length > 0) {
                        this.tree.remove(segment);
                        newEvents.push(event);
                    } else {
                        this.segments.push(segment);
                        segment.prev = prevSeg;
                    }
                } else {
                    if (prevSeg && nextSeg) {
                        var inter = prevSeg.getIntersection(nextSeg);
                        if (inter !== null) {
                            if (!prevSeg.isAnEndpoint(inter)) {
                                var _newEventsFromSplit3 = this._splitSafely(prevSeg, inter);
                                for(var _i3 = 0, _iMax3 = _newEventsFromSplit3.length; _i3 < _iMax3; _i3++){
                                    newEvents.push(_newEventsFromSplit3[_i3]);
                                }
                            }
                            if (!nextSeg.isAnEndpoint(inter)) {
                                var _newEventsFromSplit4 = this._splitSafely(nextSeg, inter);
                                for(var _i4 = 0, _iMax4 = _newEventsFromSplit4.length; _i4 < _iMax4; _i4++){
                                    newEvents.push(_newEventsFromSplit4[_i4]);
                                }
                            }
                        }
                    }
                    this.tree.remove(segment);
                }
                return newEvents;
            }
        },
        {
            key: "_splitSafely",
            value: function _splitSafely(seg, pt) {
                this.tree.remove(seg);
                var rightSE = seg.rightSE;
                this.queue.remove(rightSE);
                var newEvents = seg.split(pt);
                newEvents.push(rightSE);
                if (seg.consumedBy === void 0) this.tree.insert(seg);
                return newEvents;
            }
        }
    ]);
    return SweepLine2;
}();
var POLYGON_CLIPPING_MAX_QUEUE_SIZE = typeof process !== "undefined" && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1000000;
var POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS = typeof process !== "undefined" && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1000000;
var Operation = function() {
    function Operation2() {
        _classCallCheck(this, Operation2);
    }
    _createClass(Operation2, [
        {
            key: "run",
            value: function run(type, geom, moreGeoms) {
                operation.type = type;
                rounder.reset();
                var multipolys = [
                    new MultiPolyIn(geom, true)
                ];
                for(var i = 0, iMax = moreGeoms.length; i < iMax; i++){
                    multipolys.push(new MultiPolyIn(moreGeoms[i], false));
                }
                operation.numMultiPolys = multipolys.length;
                if (operation.type === "difference") {
                    var subject = multipolys[0];
                    var _i = 1;
                    while(_i < multipolys.length){
                        if (getBboxOverlap(multipolys[_i].bbox, subject.bbox) !== null) _i++;
                        else multipolys.splice(_i, 1);
                    }
                }
                if (operation.type === "intersection") {
                    for(var _i2 = 0, _iMax = multipolys.length; _i2 < _iMax; _i2++){
                        var mpA = multipolys[_i2];
                        for(var j = _i2 + 1, jMax = multipolys.length; j < jMax; j++){
                            if (getBboxOverlap(mpA.bbox, multipolys[j].bbox) === null) return [];
                        }
                    }
                }
                var queue2 = new Tree(SweepEvent.compare);
                for(var _i3 = 0, _iMax2 = multipolys.length; _i3 < _iMax2; _i3++){
                    var sweepEvents = multipolys[_i3].getSweepEvents();
                    for(var _j = 0, _jMax = sweepEvents.length; _j < _jMax; _j++){
                        queue2.insert(sweepEvents[_j]);
                        if (queue2.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
                            throw new Error("Infinite loop when putting segment endpoints in a priority queue (queue size too big). Please file a bug report.");
                        }
                    }
                }
                var sweepLine = new SweepLine(queue2);
                var prevQueueSize = queue2.size;
                var node = queue2.pop();
                while(node){
                    var evt = node.key;
                    if (queue2.size === prevQueueSize) {
                        var seg = evt.segment;
                        throw new Error("Unable to pop() ".concat(evt.isLeft ? "left" : "right", " SweepEvent ") + "[".concat(evt.point.x, ", ").concat(evt.point.y, "] from segment #").concat(seg.id, " ") + "[".concat(seg.leftSE.point.x, ", ").concat(seg.leftSE.point.y, "] -> ") + "[".concat(seg.rightSE.point.x, ", ").concat(seg.rightSE.point.y, "] from queue. ") + "Please file a bug report.");
                    }
                    if (queue2.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
                        throw new Error("Infinite loop when passing sweep line over endpoints (queue size too big). Please file a bug report.");
                    }
                    if (sweepLine.segments.length > POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS) {
                        throw new Error("Infinite loop when passing sweep line over endpoints (too many sweep line segments). Please file a bug report.");
                    }
                    var newEvents = sweepLine.process(evt);
                    for(var _i4 = 0, _iMax3 = newEvents.length; _i4 < _iMax3; _i4++){
                        var _evt = newEvents[_i4];
                        if (_evt.consumedBy === void 0) queue2.insert(_evt);
                    }
                    prevQueueSize = queue2.size;
                    node = queue2.pop();
                }
                rounder.reset();
                var ringsOut = RingOut.factory(sweepLine.segments);
                var result = new MultiPolyOut(ringsOut);
                return result.getGeom();
            }
        }
    ]);
    return Operation2;
}();
var operation = new Operation();
var union = function union2(geom) {
    for(var _len = arguments.length, moreGeoms = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        moreGeoms[_key - 1] = arguments[_key];
    }
    return operation.run("union", geom, moreGeoms);
};
var intersection$1 = function intersection3(geom) {
    for(var _len2 = arguments.length, moreGeoms = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++){
        moreGeoms[_key2 - 1] = arguments[_key2];
    }
    return operation.run("intersection", geom, moreGeoms);
};
var xor = function xor2(geom) {
    for(var _len3 = arguments.length, moreGeoms = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++){
        moreGeoms[_key3 - 1] = arguments[_key3];
    }
    return operation.run("xor", geom, moreGeoms);
};
var difference = function difference2(subjectGeom) {
    for(var _len4 = arguments.length, clippingGeoms = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++){
        clippingGeoms[_key4 - 1] = arguments[_key4];
    }
    return operation.run("difference", subjectGeom, clippingGeoms);
};
var index = {
    union,
    intersection: intersection$1,
    xor,
    difference
};
export { index as default };
var sentence = document.getElementById('sentence');
var scale = document.getElementById('range');
var canvas = document.getElementById('draw');
var graph = canvas.getContext('2d');
// var debug = true;
var debug = false;

graph.font = '15px Arial';
graph.strokeStyle = '#000';
graph.lineWidth = 1;
sentence.value = '';

function onEnter(event, callback) {
  if (event.keyCode == 13) {
    event.preventDefault();
    callback();
  }
}

function processSentence() {
  var sentence = document.getElementById('sentence').value;

  sentence = sentence.replace(/\s{2,}/g, ' ').trim(); // replace(/\./g, '').

  if (sentence == '') return;

  var xhr = new XMLHttpRequest();
  var body = 'sentence=' + encodeURIComponent(sentence);

  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;

    if (this.status != 200) {
      console.log(this.status, this.statusText);
      return;
    }

    console.log(this.responseText);
    var response = JSON.parse(this.responseText);
    console.log(response);
    drawSents(response);
  };

  xhr.open('POST', '/process', true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(body);
}


/* нет примера для 5-го правила */
/* ======= нет связи между потомком и родителем ======= */
// sentence.value += "Little cat, I have no flat. "; // [3,0], [1,0], [1,1], [3,0]
// sentence.value += "Coffee is a delicate art, perfected over centuries of history and world culture and tastes. ";
// sentence.value += "The United States of America, commonly known as the United States or America, is a federal republic composed of 50 states. ";
// sentence.value += "Cofee is a delicate art preferd over centuries. ";
// sentence.value += "From Paris with love. "; // [4,0], [4,1]
// sentence.value += "Captain James Cook's last voyage included sailing along the coast of North America and Alaska searching for a Northwest Passage for approximately nine months. "; // [1,0], [3,0], [1,1], [4,0], [4,1], [6,0], [6,1], [7,0]

/* ======= происходит замена объектов при одинаковом уровне вхождения ======= */
// 3, 4
// sentence.value += "The Robert Mueller inquiry into alleged collusion with Russia in the election is one of the most explosive stories in US politics. ";
// sentence.value += "Leftwing control of the NEC was one of the last pieces to fall into place. ";
// sentence.value += "My parents saw them at a concert a long time ago. "; // [1,0], [3,0], [1,1], [4,1], [7,0], [4,0]

// sentence.value += "Sally ran down the street. "; // [3,0], [4,0], [4,1]
// sentence.value += "Old as Mary and you. "; // [4,0], [4,1], [6,0], [6,1]
// sentence.value += "Hello i'm your daughter. "; // [0,0], [1,0], [2,0], [3,0]
// sentence.value += "Ellen needs help. "; // [1,0], [1,1]
// sentence.value += "Ellen from Mars needs help. "; // [1,0], [1,1]
// sentence.value += "She's not as old as Mary. "; // [1,0], [3,0], [2,0], [4,0], [4,1]
// sentence.value += "The visitors from El Paso arrived on schedule. "; // [1,0], [3,0], [0,0], [4,1], [4,0]
// sentence.value += "The visitors from Mars on schedule. "; // [3,0], [0,0], [4,1], [4,0]
sentence.value += "Jennifer took on two paper routes to earn money for camp. "; // [1,0], [0,0], [1,1], [4,1], [8,0], [4,0]
// sentence.value += "Jennifer took on the routes from Mars to earn money for camp. "; // [1,0], [0,0], [1,1], [4,1], [8,0], [4,0]
// sentence.value += "The house looks tidy and good, but the yard is a mess and a bad. "; // [1,0], [3,0], [2,0], [6,1], [6,0], [0,0], [10,7,0], [10,7,1]
// sentence.value += "The house looks tidy, but the yard is a mess. "; // [1,0], [3,0], [2,0], [10,7,0], [10,7,1]
// sentence.value += "The guy must pass several trials to see and to take his bride away. "; // [[1,0], [3,0], [1,1], [8,0], [6,0], [6,1]
// sentence.value += "The guy must pass several trials to see his bride away. "; // [1,0], [3,0], [1,1], [8,0]
// sentence.value += "A see his the bride away. "; // [1,0], [1,1], [3,0]
// sentence.value += "John, Mary and Sam were there. "; // [1,0], [0,0], [6,1], [6,0], [3,0]
// sentence.value += "John and Sam were there. "; // [1,0], [0,0], [6,1], [6,0], [3,0]
// sentence.value += "The people who live on this street seem pleasant. "; // [1,0], [3,0], [7,0], [4,0], [4,1], [0,0]
// sentence.value += "We enjoy talking. "; // [1,0], [11,0]
// sentence.value += "My brother and I are getting together for dinner. "; // [1,0], [3,0], [6,0], [6,1], [11,0], [4,0], [4,1]
// sentence.value += "He left early because he felt sick. "; // [1,0], [3,0], [7,0], [7,1], [2,0]
// sentence.value += "We are campers tired but happy. "; // [1,0], [2,0], [3,0], [6,0], [6,1]
// sentence.value += "He can and should finish the job. "; // [1,0], [11,0], [6,0], [1,1], [3,0]
// sentence.value += "And a the finish the job. "; // [1,0], [11,0], [6,0], [1,1], [3,0]
// sentence.value += "And finish. "; // [1,0], [11,0], [6,0], [1,1], [3,0]
// sentence.value += "Everyone wondered when would end the play. "; // [1,0], [1,1], [7,0], [3,0], [11,0]
// sentence.value += "You choose a color that you like. "; // [1,0], [1,1], [3,0], [7,0]

/* =========== за 3,0 следует 3,0 =========== */
// sentence.value += "How many apples does mary has. "; // [1,1], [3,0]->[3,0], [1,0]
// sentence.value += "The students worked so very hard. "; // [1,0], [3,0], [3,0], [3,0], [3,0]

/* 9 правило */
// sentence.value += "You choose a color that you like"; // [1,0], [1,1], [3,0], [9,0]
// sentence.value += "To know him is to love him. "; // [9,0], [9,1], [11,0], [1,0], [1,1]
// sentence.value += "Tom stopped to take a close look at the car. "; // [1,0], [9,1], [11,0], [1,1], [3,0], [4,0], [4,1]

/* =========== сложные предложения =========== */
// [3,0], [7,0], [1,0], [2,0], [6,0], [6,1], [0,0], [4,0], [4,1]
// sentence.value += "A long time ago a the house looked neat and nice, like a new one, but eventually became obsolete. ";
// sentence.value += "A long time ago, the house looked neat and pleasant, like a new one, but eventually become obsolete because it was made of wood. ";
// sentence.value += "With the progress of European colonization in the territories of the contemporary United States, the Native Americans were often conquered and displaced. "; // [1,0], [3,0], [4,0], [4,1], [6,0], [6,1]

/* =========== за 4,0 следует 4,0 =========== */
// sentence.value += "The fighter seems out of a the shape. ";
// sentence.value += "The fighter seems out of a the shape from Mars. ";
// sentence.value += "The fighter seems out of of of of of a the shape from Mars. ";
// sentence.value += "The fighter seems of the shape. ";


var w = canvas.width;
var h = canvas.height;
var th = parseInt(graph.font); // text height - (font-size in px)
var tpb = 7; // text padding bottom
const x = 20, y = 20 + th + tpb;
var tpl = 3; // text padding left
var tind = 20; // text indent
/* длина линии */
var lh3 = 35; // для 3-го правила
var lh4 = 50; // для 4-го правила
var lh6 = 30; // для 6-го правила
var lh7 = 90; // для 7-го правила
var lh8 = 50; // для 8-го правила

var chid = 0;
var nlev = 0;

var prevNode = { 'id': 1 }, nodes = {};
var ckeyTemp = '', pkeyTemp = '';
var leftTemp = 0;
var from4040 = false;
var parents = 0;


function drawSents(nodeList) {
  if (!nodeList.length) return;

  var out = document.getElementById('diagrams');

  out.innerHTML = '';
  canvas.className = 'border';
  
  for (var i = 0; i < nodeList.length; i++) {
    nodes = {};
    chid = nlev = parents = 0;
    ckeyTemp = pkeyTemp = '';
    prevNode = { 'id': 1 };

    console.log('<<<<<<<<< Sentence', i, '>>>>>>>>>');
    processTree(nodeList[i]);
    if (parents > 1) {
      $('#alert-warning').show('fast');
    } else {
      $('#alert-warning').hide('fast');
    }
    correctCoords();

    graph.save();
    graph.clearRect(0, 0, w, h);
    // graph.scale(scale.value, scale.value);
    graph.beginPath();
    graph.moveTo(x, y);
    draw();

    if (debug) {
      var img = new Image();
      img.src = canvas.toDataURL();
      out.appendChild(img);
    }
  }
}

function processTree(nodeTree) {
  if ('rule' in nodeTree) {
    var nodeRule = nodeTree.rule.toString();
    var sr = nodeTree.rule[1];

    if (prevNode.rule != '4,0' && nodeRule == '4,0') {
      prevNode.id = nodeTree.id;
      prevNode.value = nodeTree.value;
      prevNode.parent = nodeTree.parent;
      ckeyTemp = nodeTree.value + '_pre_' + (nodeTree.id - nlev) + '_' + chid;
      pkeyTemp = nodeTree.parent + '_' + (nodeTree.id - nlev - 1);
      if (pkeyTemp in nodes) leftTemp = nodes[pkeyTemp].left;
      rules[nodeTree.rule[0]].getData(nodeTree.id - nlev, sr, nodeTree.value, nodeTree.parent);
      console.log(prevNode.rule + '->4,0');
    } else if (prevNode.rule == '4,0' && nodeRule == '4,0') {
      prevNode.value += ' ' + nodeTree.value;
      nlev++;
      from4040 = true;
      console.log('4,0->4,0', prevNode.value);
    } else if (prevNode.rule == '4,0' && nodeRule != '4,0') {
      if (from4040) {
        console.log('delete:', ckeyTemp);
        delete nodes[ckeyTemp];
        if (pkeyTemp in nodes) nodes[pkeyTemp].left = leftTemp;
        from4040 = false;
        rules[4].getData(prevNode.id, 0, prevNode.value, prevNode.parent);
      }

      rules[nodeTree.rule[0]].getData(nodeTree.id - nlev, sr, nodeTree.value, prevNode.value);
      console.log('4,0->' + nodeRule, ckeyTemp, pkeyTemp);
    } else {
      if (prevNode.rule != '3,0' && nodeRule == '3,0') {
        console.log(prevNode.rule + '->3,0');
        prevNode.parent = nodeTree.value;
      } else if (prevNode.rule == '3,0' && nodeRule == '3,0') {
        if (prevNode.parent == nodeTree.parent) {
          console.log('3,0->3,1');
          sr = 1;
        } else {
          prevNode.parent = nodeTree.value;
        }
      }

      if (prevNode.id > nodeTree.id) nlev = 0;

      rules[nodeTree.rule[0]].getData(nodeTree.id - nlev, sr, nodeTree.value, nodeTree.parent);
    }

    prevNode.rule = nodeRule;
  }

  for (var i = 0; i < nodeTree.childs.length; i++) {
    processTree(nodeTree.childs[i]);
  }
}

function draw() {
  graph.font = '15px Arial';
  graph.strokeStyle = '#000';
  graph.lineWidth = 1;

  for (var node in nodes) {
    rules[nodes[node].rule].drawNode(nodes[node]);
  }

  graph.stroke();
  graph.restore();
}

function correctCoords() {
  var origin = [];
  var xmin = x, ymin = y, xmax = x, ymax = y;

  for (var key in nodes) {
    if (nodes[key].rule == 6) {
      xmin = Math.min(xmin, nodes[key].x - tind - lh6);
    } else if (nodes[key].rule == 4 && nodes[key].subRule == 1) {
      xmin = Math.min(xmin, nodes[key].x - lh4);
    } else {
      xmin = Math.min(xmin, nodes[key].x);
    }

    if (nodes[key].rule == 1 && nodes[key].subRule == 0) {
      ymax = Math.max(ymax, nodes[key].y + 25);
    } else {
      ymax = Math.max(ymax, nodes[key].y);
    }

    if (nodes[key].rule == 4 && nodes[key].subRule == 1) {
      ymin = Math.min(ymin, nodes[key].y - deg50(lh4));
    } else if (nodes[key].rule == 6 && nodes[key].subRule == 0 && nodes[key].as == 'child') {
      ymin = Math.min(ymin, nodes[key].y - deg50(lh6) + th);
    } else {
      ymin = Math.min(ymin, nodes[key].y);
    }

    xmax = Math.max(xmax, nodes[key].right || nodes[key].x);

    if (!Object.getOwnPropertyDescriptor(nodes[key], 'x').get) {
      origin.push(nodes[key]);
    }
  }
  
  for (var i = 0; i < origin.length; i++) {
    origin[i].x += x - xmin;
    origin[i].y += y - ymin;
  }

  canvas.width = xmax + (x - xmin) + x; // x как отступ
  canvas.height = ymax + (y - ymin) + x;
}

function getMaxY() {
  var ym = 0;

  for (var key in nodes) {
    ym = Math.max(ym, nodes[key].y);
  }

  return ym;
}

function updateKey(key) {
  if (key + '_' + chid in nodes) chid++;
  return key + '_' + chid;
}

function createParent(key, val, r, sr) {
  parents++;
  nodes[key] = {
    'x': x,
    'y': y,
    'left': tind,
    'value': val,
    'rule': r,
    'as': 'parent'
  };

  if (r == 6 && sr == 0) nodes[key].x += tind + lh6;

  if (!isNaN(sr)) nodes[key].subRule = sr;

  if (r != 4 || sr != 1) {
    Object.defineProperty(nodes[key], 'right', {
      get: function() { return right.call(this); }
    });
  }
}

function createChild(key, val, r, sr) {
  nodes[key] = {
    'left': tind,
    'value': val,
    'rule': r,
    'as': 'child'
  };

  if (!isNaN(sr)) nodes[key].subRule = sr;

  if (r != 3 && (r != 4 && r != 6 || sr !=  0) && (r != 7 || sr != 1)) {
    Object.defineProperty(nodes[key], 'right', {
      get: function() { return right.call(this); }
    });
  }
}

// return text width
function tw(str) { return graph.measureText(str).width; }

function deg50(x) { return x + x/2; }

// пунктирные линии
function dashedLine(x1, y1, x2, y2) {
  var opt = [10, 10];

  graph.stroke();
  graph.beginPath();
  graph.moveTo(x1, y1);
  graph.setLineDash(opt);
  graph.lineTo(x2, y2);
  graph.stroke();
  graph.beginPath();
  graph.setLineDash([]);
  graph.moveTo(x1, y1);
}

// для вычиления right в нек-х правилах
function right() {
  return Math.max(this.x + this.left + tind, this.x + tw(this.value) + tind*2);
}

function copy(obj) {
  var res = {};
  var xt = Object.getOwnPropertyDescriptor(obj, 'x');
  var yt = Object.getOwnPropertyDescriptor(obj, 'y');
  var rightt = Object.getOwnPropertyDescriptor(obj, 'right');

  if (xt) Object.defineProperty(res, 'x', xt);
  if (yt) Object.defineProperty(res, 'y', yt);
  if (rightt) Object.defineProperty(res, 'right', xt);

  for (var key in obj) {
    res[key] = obj[key];
  }

  return res;
}

function change7(pkey, rule, srule) {
  if (nodes[pkey].rule == 7) {
    console.log('7,0 =', rule + ',' + srule);
    nodes[pkey + '_7'] = copy(nodes[pkey]);

    var xt = Object.getOwnPropertyDescriptor(nodes[pkey], 'x').get;

    if (xt) {
      Object.defineProperty(nodes[pkey], 'x', {
        configurable: true,
        get: function() { return xt() - tind/2; }
      });
    }

    nodes[pkey].rule = rule;
    nodes[pkey].as = 'parent';

    if (!isNaN(srule)) nodes[pkey].subRule = srule;
  }
}

var rules = [new RuleDefault, new Rule1, new Rule2, new Rule3, new Rule4, new Rule5, new Rule6, new Rule7, new Rule8, new Rule9, new Rule10, new RuleMerge];

function Rule1() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule1', id, subRule, child, parent);
    var pkey = parent + '_' + (id - 1);
    var ckey = child + '_' + id;

    if (subRule) { // rule_1_1
      // __ parent __|__ child __
      if (!(pkey in nodes)) createParent(pkey, parent, 1, 1);

      createChild(ckey, child, 1, 1);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: function() { return nodes[pkey].right; }
        },
        'y': {
          configurable: true,
          get : function() { return nodes[pkey].y; }
        }
      });
    } else { // rule_1_0
      // __ child __|__ parent __
      //            |
      if (pkey in nodes) {
        change7(pkey, 1, 0);
      } else {
        createParent(pkey, parent, 1, 0);
      }

      createChild(ckey, child, 1, 0);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get : function() {
            var max = Math.max(this.left + tind, tw(this.value) + tind*2);

            if (nodes[pkey].rule == 6) {
              return nodes[pkey].x - max - tind - lh6;
            }

            return nodes[pkey].x - max;
          }
        },
        'y': {
          configurable: true,
          get : function() {
            if (nodes[pkey].rule == 6) {
              return nodes[pkey].y - deg50(lh6);
            }

            return nodes[pkey].y;
          }
        }
      });
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // rule_1_1
      // __ parent __|__ child __
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.moveTo(node.right, node.y - 25);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y - 25);
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      }
    } else { // rule_1_0
      // __ child __|__ parent __
      //            |
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y - 25);
        graph.lineTo(node.x, node.y + 25);
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.moveTo(node.right, node.y - 25);
        graph.lineTo(node.right, node.y + 25);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      }
    }
  };
}

function Rule2() {
  this.getData = function(id, subRule, child, parent) {
    // ___ parent ___\___ child ____

    console.log('Rule2', id, subRule, child, parent);
    var pkey = parent + '_' + (id - 1);
    var ckey = child + '_' + id;

    if (!(pkey in nodes)) createParent(pkey, parent, 2);

    createChild(ckey, child, 2);

    Object.defineProperties(nodes[ckey], {
      'x': {
        configurable: true,
        get: function() { return nodes[pkey].right; }
      },
      'y': {
        configurable: true,
        get : function() { return nodes[pkey].y; }
      }
    });
  };

  this.drawNode = function(node) {
    // ___ parent ___\___ child ____

    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.moveTo(node.right - 16, node.y - deg50(16));
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    } else {
      graph.moveTo(node.x - 16, node.y - deg50(16));
      graph.lineTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    }
  };
}

function Rule3() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule3', id, subRule, child, parent);
    var pkey = parent + '_' + (id - 1);
    var ckey = child + '_' + id;

    if (subRule) { // rule_3_1
      //  \
      //  /\ parent
      // /  \
      // \
      //  \ child
      //   \
      if (!(pkey in nodes)) createParent(pkey, parent, 3, 1);

      createChild(ckey, child, 3, 1);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: function() { return nodes[pkey].x; }
        },
        'y': {
          configurable: true,
          get : function() { return nodes[pkey].y + deg50(lh3); }
        }
      });
    } else { // rule_3_0
      // __ parent __
      //    \
      //     \ child
      //      \
      if (pkey in nodes) {
        change7(pkey, 3, 0);
      } else {
        createParent(pkey, parent, 3, 0);
      }

      createChild(ckey, child, 3, 0);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: (function() { return nodes[pkey].x + lh3 + this; }).bind(nodes[pkey].left)
        },
        'y': {
          configurable: true,
          get : function() { return nodes[pkey].y + deg50(lh3); }
        }
      });

      nodes[pkey].left += tw(child) + lh3/2 + th/2;
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // rule_3_1
      //  \
      //  /\ parent
      // /  \
      // \
      //  \ child
      //   \
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x - lh3, node.y - deg50(lh3));
        graph.fillText(node.value, node.x - lh3/2 + th/2, node.y - deg50(lh3/2));
      } else {
        var xt = node.x, yt = node.y;
        graph.moveTo(xt, yt);
        graph.lineTo(xt -= lh3, yt -= deg50(lh3));
        graph.lineTo(xt += lh3/2, yt -= deg50(lh3/2));
        graph.fillText(node.value, node.x - lh3/2 + th/2, node.y - deg50(lh3/2));
      }
    } else { // rule_3_0
      // __ parent __
      //    \
      //     \ child
      //      \
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x - lh3, node.y - deg50(lh3));
        graph.fillText(node.value, node.x - lh3/2 + th/2, node.y - deg50(lh3/2));
      }
    }
  };
}

function Rule4() {
  var parKeyTemp = '', childKeyTemp = '';

  this.getData = function(id, subRule, child, parent) {
    console.log('Rule4', id, subRule, child, parent);
    var pkey = '', ckey = '';

    if (subRule) { // rule_4_1
      // \
      //  \ parent
      //   \__ child __
      pkey = parent + '_pre_' + (id - 1) + '_' + chid;
      ckey = child + '_' + id;

      if (!(pkey in nodes)) createParent(pkey, parent, 4, 1);

      createChild(ckey, child, 4, 1);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: function() { return nodes[pkey].x; }
        },
        'y': {
          configurable: true,
          get : function() { return nodes[pkey].y; }
        }
      });

      if (childKeyTemp == pkey) {
        nodes[parKeyTemp].left -= Math.max(lh4/2 + th/2 + tw(parent), lh4 + tind);
        nodes[parKeyTemp].left += Math.max(lh4/2 + th/2 + tw(parent), lh4 + tind + tw(child));
      }

      parKeyTemp = childKeyTemp = '';
    } else { // rule_4_0
      // __ parent __
      //    \
      //     \ child
      //      \__
      pkey = parent + '_' + (id - 1);
      ckey = updateKey(child + '_pre_' + id);

      if (!(pkey in nodes)) createParent(pkey, parent, 4, 0);

      createChild(ckey, child, 4, 0);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: (function() { return nodes[pkey].x + lh4 + this; }).bind(nodes[pkey].left)
        },
        'y': { get : function() { return nodes[pkey].y + deg50(lh4); } }
      });

      nodes[pkey].left += Math.max(lh4/2 + th/2 + tw(child), lh4 + tind);
      parKeyTemp = pkey;
      childKeyTemp = ckey;
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // rule_4_1
      // \
      //  \ parent
      //   \__ child __
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x - lh4, node.y - deg50(lh4));
        graph.fillText(node.value, node.x - lh4/2 + th/2, node.y - deg50(lh4/2));
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      }
    } else { // rule_4_0
      // __ parent __
      //    \
      //     \ child
      //      \__
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x - lh4, node.y - deg50(lh4));
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.x + tind, node.y);
        graph.fillText(node.value, node.x - lh4/2 + th/2, node.y - deg50(lh4/2));
      }
    }
  };
}

function Rule6() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule6', id, subRule, child, parent);
    var pkey = parent + '_' + (id - 1);
    var ckey = child + '_' + id;

    if (pkey in nodes) {
      var r = nodes[pkey].rule;
      var sr = nodes[pkey].subRule;
      var as = nodes[pkey].as;
    }

    if (subRule) { // rule_6_1
      //     ___ child ___
      //    /|            
      // __/ |             
      //   \ |             
      //    \|__ parent __

      if (pkey in nodes) {
        if (r != 6) {
          if (r != 1 || sr != 0) {
            var tempX61 = Object.getOwnPropertyDescriptor(nodes[pkey], 'x').get;
            var tempY61 = Object.getOwnPropertyDescriptor(nodes[pkey], 'y').get;

            if (tempX61) {
              Object.defineProperty(nodes[pkey], 'x', {
                configurable: true,
                get: function() { return tempX61.call(this) + tind + lh6; }
              });
            } else nodes[pkey].x += tind + lh6;

            if (tempY61) {
              Object.defineProperty(nodes[pkey], 'y', {
                configurable: true,
                get: function() { return tempY61() + deg50(lh6); }
              });
            } else nodes[pkey].y += deg50(lh6);
          }

          nodes[pkey].rule = 6;
          nodes[pkey].subRule = 1;
          nodes[pkey].as = 'parent';
        }
      } else {
        createParent(pkey, parent, 6, 1);
      }

      createChild(ckey, child, 6, 1);
      nodes[ckey].height = deg50(lh6);

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: function() { return nodes[pkey].x; }
        },
        'y': {
          configurable: true,
          get: function() { return nodes[pkey].y - deg50(lh6*2); }
        }
      });
    } else { // rule_6_0
      //     
      //    /|            
      // __/ | child       
      //   \ |             
      //    \|__ parent __

      if (pkey in nodes) {
        if ((r == 3 || r == 8) && as == 'child') {
          nodes[pkey + '_copy'] = copy(nodes[pkey]);
          nodes[pkey + '_copy'].value = '';
        }

        if (r != 1 || sr != 0) {
          var tempX60 = Object.getOwnPropertyDescriptor(nodes[pkey], 'x').get;
          var tempY60 = Object.getOwnPropertyDescriptor(nodes[pkey], 'y').get;

          if (tempX60) {
            Object.defineProperty(nodes[pkey], 'x', {
              configurable: true,
              get: function() { return tempX60.call(this) + tind + lh6; }
            });
          } else nodes[pkey].x += tind + lh6;

          if (tempY60) {
            Object.defineProperty(nodes[pkey], 'y', {
              configurable: true,
              get: function() { return tempY60() + deg50(lh6); }
            });
          } else nodes[pkey].y += deg50(lh6);

          if (!Object.getOwnPropertyDescriptor(nodes[pkey], 'right')) {
            Object.defineProperty(nodes[pkey], 'right', {
              get: function() { return right.call(this); }
            });
          }
        }
      } else {
        createParent(pkey, parent, 6, 0);
      }

      nodes[pkey].rule = 6;
      nodes[pkey].subRule = 0;
      nodes[pkey].as = 'parent';

      createChild(ckey, child, 6, 0);

      Object.defineProperties(nodes[ckey], {
        'x': { get: function() { return nodes[pkey].x; } },
        'y': { get: function() { return nodes[pkey].y - deg50(lh6); } },
      });
    }
  };

  this.drawNode = function(node) {
    var xt = node.x - lh6 - tind, yt = node.y - deg50(lh6);

    if (node.subRule) { // rule_6_1
      //     ___ child ___
      //    /|            
      // __/ |             
      //   \ |             
      //    \|__ parent __
      if (node.as == 'parent') {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += tind, yt);
        graph.lineTo(xt += lh6, yt += deg50(lh6));
        dashedLine(xt, yt, xt, yt - deg50(lh6*2));
        graph.lineTo(xt = node.right, yt);
        graph.fillText(node.value, node.x + tind, yt - tpb);
        graph.moveTo(xt = node.x - lh6, yt = node.y - deg50(lh6));
        graph.lineTo(xt += lh6, yt -= deg50(lh6));
      } else {
        graph.moveTo(node.x - lh6, node.y + node.height);
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);

        // graph.moveTo(xt += tind, node.y + deg50(lh6));
        // graph.lineTo(xt += lh6, node.y);
        // graph.lineTo(node.right, node.y);
        // graph.fillText(node.value, node.x + tind, node.y - tpb);
      }
    } else { // rule_6_0
      //     
      //    /|            
      // __/ | child       
      //   \ |             
      //    \|__ parent __
      if (node.as == 'parent') {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += tind, yt);
        graph.lineTo(xt += lh6, yt += deg50(lh6));
        dashedLine(xt, yt, xt, yt - deg50(lh6*2));
        graph.lineTo(xt = node.right, yt);
        graph.fillText(node.value, node.x + tind, yt - tpb);
        graph.moveTo(xt = node.x - lh6, yt = node.y - deg50(lh6));
        graph.lineTo(xt += lh6, yt -= deg50(lh6));
      } else {
        graph.fillText(node.value, node.x + tpl, node.y);
      }
    }
  };
}

function Rule7() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule7', id, subRule, child, parent);
    var pkey = parent + '_' + (id - 1);
    var ckey = child + '_' + id;

    if (subRule) { // rule_7_1
      // __ parent __
      //   |
      //   | child
      //   |
      pkey = parent + '_' + (id - 1);

      if (!(pkey in nodes)) createParent(pkey, parent, 7, 1);

      createChild(ckey, child, 7, 1);

      Object.defineProperties(nodes[ckey], {
        'x': { get: function() { return nodes[pkey].x + tind/2; } },
        'y': { get: function() { return nodes[pkey].y - 45; } }
      });
    } else { // rule_7_0
      // __ parent __
      //   |
      //   |
      //   |
      // __ child __
      ckey = child + '_' + id;

      if (!(pkey in nodes)) createParent(pkey, parent, 7, 0);

      var ym = nodes[pkey].y;

      if (nodes[pkey].rule != 6 || nodes[pkey].subRule != 1) {
        ym = getMaxY();
      } else {
        // nodes[pkey].height = 0;
      }

      createChild(ckey, child, 7, 0);
      nodes[ckey].height = Math.abs(ym - nodes[pkey].y) + lh7;

      Object.defineProperties(nodes[ckey], {
        'x': {
          configurable: true,
          get: function() {
            if (nodes[pkey].rule == 1 || nodes[pkey].rule == 6) {
              return nodes[pkey].x + tind/2;
            }

            return nodes[pkey].x;
          }
        },
        'y': {
          configurable: true,
          get: function() { return nodes[pkey].y + nodes[ckey].height; }
        }
      });
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // rule_7_1
      //   |
      //   | child
      //   |
      // __ parent __
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        dashedLine(node.x, node.y + 45, node.x, node.y - th*2);
        graph.fillText(node.value, node.x + 7, node.y);
      }
    } else { // rule_7_0
      // __ parent __
      //   |
      //   |
      //   |
      // __ child __
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        dashedLine(node.x, node.y, node.x, node.y + node.height);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        dashedLine(node.x, node.y, node.x, node.y - node.height);
        graph.fillText(node.value, node.x + tind/2, node.y - tpb);
      }
    }
  };
}

function Rule8() {
  this.getData = function(id, subRule, child, parent) {
    // __ parent __
    //    \
    //     \ to
    //      \__ child __
    console.log('Rule8', id, subRule, child, parent);
    var pkey = parent + '_' + (id - 1);
    var ckey = child + '_' + id;
    
    if (!(pkey in nodes)) createParent(pkey, parent, 8);

    createChild(ckey, child, 8);

    Object.defineProperties(nodes[ckey], {
      'x': {
        configurable: true,
        get: (function() { return nodes[pkey].x + lh8 + this; }).bind(nodes[pkey].left)
      },
      'y': {
        configurable: true,
        get: function() { return nodes[pkey].y + deg50(lh8); }
      }
    });

    nodes[pkey].left += lh8 + tw(child) + tind;
  };

  this.drawNode = function(node) {
    // __ parent __
    //    \
    //     \ to
    //      \__ child __
    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    } else {
      var xt = node.x - lh8;
      graph.moveTo(node.x, node.y);
      graph.lineTo(xt, node.y - deg50(lh8));
      graph.fillText('to', xt + lh8/2 + th/2, node.y - deg50(lh8/2));
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    }
  };
}

function Rule9() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule9', id, subRule, child, parent);
    console.error('Rule9 is not defined');
  };

  this.drawNode = function() {};
}

function Rule10() {
  var child10 = '';

  this.getData = function(id, subRule, child, parent) {
    if (subRule) { // rule_10_1
      rules[7].getData(id + 1, subRule, child, child10);
    } else { // rule_10_0
      rules[7].getData(id, subRule, child, parent);
      child10 = child;
    }

    console.log('Rule10 --^');
  };

  this.drawNode = function(node) {
    rules[7].drawNode(node);
  }
}


function RuleDefault() {
  this.getData = function(id, subRule, child, parent) {
    console.log('RuleDefault', id, subRule, child, parent);
  };

  this.drawNode = function() {};
}

function Rule5() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule5', id, subRule, child, parent);
  };

  this.drawNode = function(node) {
    // __ parent __
    //             \
    //              \
    //               \__ child __
    graph.fillText(parent, x + tind, y - tpb);
    graph.lineTo(x += tind + tw(parent) + tind, y);
    graph.lineTo(x += 30, y += deg50(30));
    graph.fillText(child, x + tind, y - tpb);
    graph.lineTo(x += tind + tw(child) + tind, y);
  };
}

function RuleMerge() {
  this.getData = function(id, subRule, child, parent) {
    console.log('RuleMerge', id, subRule, child, parent);
  };

  this.drawNode = function() {};
}

/* список исправлений */
// + удаление лишних пробелов для правильного парсинга предложения
// + исправлены отрицательные координаты
// + если за 3 правилом идет 3 правило рисовать их по другому
// + оптимальная высота для пунктирной линии 7го правила
// + там где нет связи выводить сообщение
// - разобратся с RuleDefault
// - происходит замена объектов при одинаковом уровне вхождения
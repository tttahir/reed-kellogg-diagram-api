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

  sentence = sentence.replace(/\s{2,}/g, ' ').trim();

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
    var result = JSON.parse(this.responseText);
    console.log(result);
    drawSents(result);
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
sentence.value += "Captain James Cook's last voyage included sailing along the coast of North America and Alaska searching for a Northwest Passage for approximately nine months. "; // [1,0], [3,0], [1,1], [4,0], [4,1], [6,0], [6,1], [7,0]

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
// sentence.value += "Jennifer took on two paper routes to earn money for camp. "; // [1,0], [0,0], [1,1], [4,1], [8,0], [4,0]
// sentence.value += "Jennifer took on the routes from Mars to earn money for camp. "; // [1,0], [0,0], [1,1], [4,1], [8,0], [4,0]
// sentence.value += "The house looks tidy and good, but the yard is a mess and a bad. "; // [1,0], [3,0], [2,0], [6,1], [6,0], [0,0], [10,7,0], [10,7,1]
// sentence.value += "The house looks tidy, but the yard is a mess. "; // [1,0], [3,0], [2,0], [10,7,0], [10,7,1]
// sentence.value += "The guy must pass several trials to see and to take his bride away. "; // [1,0], [3,0], [1,1], [8,0], [6,0], [6,1]
// sentence.value += "The guy must pass several trials to see his bride away. "; // [1,0], [3,0], [1,1], [8,0]
// sentence.value += "A see his the bride away. "; // [1,0], [1,1], [3,0]
// sentence.value += "John, Mary and Sam were there. "; // [1,0], [0,0], [6,1], [6,0], [3,0]
// sentence.value += "John and Sam were there. "; // [1,0], [0,0], [6,1], [6,0], [3,0]
// sentence.value += "The people who live on this street seem pleasant. "; // [1,0], [3,0], [7,0], [4,0], [4,1], [0,0]
// sentence.value += "We enjoy talking. "; // 2 [1,0], [11,0]
// sentence.value += "My brother and I are getting together for dinner. "; // 1 [1,0], [3,0], [6,0], [6,1], [11,0], [4,0], [4,1]
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
// sentence.value += "The fighter seems out of shape. ";
// sentence.value += "The fighter seems out of a the shape from Mars. ";
// sentence.value += "The fighter seems out of of of of of a the shape from Mars. ";
// sentence.value += "The fighter seems of the shape. ";


var th = parseInt(graph.font); // text height - (font-size in px)
var tpb = 7; // text padding bottom
const x = 20, y = 20 + th + tpb;
var tpl = 3; // text padding left
var tind = 20; // text indent
/* длина линии */
var lh1 = 25, lh2 = 16, lh3 = 35, lh4 = 50, lh6 = 30, lh7 = 90, lh8 = 50;

var currentNode = {};
var parents = 0;

function drawSents(nodeList) {
  if (!nodeList.length) return;

  var out = document.getElementById('diagrams');

  out.innerHTML = '';
  canvas.className = 'border';
  
  for (var i = 0; i < nodeList.length; i++) {
    currentNode = {};
    parents = 0;

    console.log('<<<<<<<<< Sentence', i, '>>>>>>>>>');
    createParent(nodeList[i]);
    processTree(nodeList[i], currentNode);

    if (parents > 1) {
      $('#alert-warning').show('fast');
    } else {
      $('#alert-warning').hide('fast');
    }

    graph.save();
    graph.clearRect(0, 0, canvas.width, canvas.height);
    graph.beginPath();
    graph.moveTo(x, y);
    correctCoords(currentNode);
    drawParent(currentNode);
    drawTree(currentNode);
    graph.stroke();
    graph.restore();

    if (debug) {
      var img = new Image();
      img.src = canvas.toDataURL();
      out.appendChild(img);
    }
    console.log(nodeList[i]);
    // console.log(currentNode);
  }
}

function createParent(node) {
  var r = node.childs[0].rule;
  var sr = node.childs[0].subRule;
  var rule = r + '' + sr;

  currentNode = {
    'x': x,
    'y': y,
    'left': tind,
    'value': node.value,
    'rule': r,
    'subRule': sr,
    'as': 'parent',
    'childs': []
  };

  if (rule != '41') {
    Object.defineProperty(currentNode, 'right', {
      get: function() { return right.call(this); }
    });
  }
}

function processTree(nodeTree, newTree) {
  for (var i = 0; i < nodeTree.childs.length; i++) {
    var r = nodeTree.childs[i].rule;
    newTree.childs[i] = copy(nodeTree.childs[i]);
    newTree.childs[i].parent = newTree;
    rules[r].getData(newTree.childs[i], newTree);
    processTree(nodeTree.childs[i], newTree.childs[i]);
  }
}

function correctCoords(node) {
  var rect = getRect(currentNode);
  node.x += x - rect.left;
  node.y += y - rect.top;
  canvas.width = rect.right + (x - rect.left) + x; // x как отступ
  canvas.height = rect.bottom + (y - rect.top) + x;
}

function drawParent(node) {
  graph.font = '15px Arial';
  graph.strokeStyle = '#000';
  graph.lineWidth = 1;
  rules[node.rule].drawNode(node);
}

function drawTree(nodeTree) {
  for (var i = 0; i < nodeTree.childs.length; i++) {
    rules[nodeTree.childs[i].rule].drawNode(nodeTree.childs[i]);
    drawTree(nodeTree.childs[i]);
  }
}

function getRect(node, rect) {
  var node = node || { 'childs':[] };
  var rect = rect || {
    'top': y,
    'right': x,
    'bottom': y,
    'left': x,
  };
  var r = node.rule, sr = node.subRule;
  if ('x' in node) {
    var xt = node.x, yt = node.y, rt = node.right || node.x;

    if (r != 9) {
      if (r == 6) {
        rect.left = Math.min(rect.left, xt - tind - lh6);
      } else if (r == 4 && sr == 1) {
        rect.left = Math.min(rect.left, xt - lh4);
      } else {
        rect.left = Math.min(rect.left, xt);
      }

      if (r == 1 && sr == 0) {
        rect.bottom = Math.max(rect.bottom, yt + lh1);
      } else {
        rect.bottom = Math.max(rect.bottom, yt);
      }

      if (r == 4 && sr == 1) {
        rect.top = Math.min(rect.top, yt - deg50(lh4));
      } else if (r == 6 && sr == 0 && node.as == 'child') {
        rect.top = Math.min(rect.top, yt - deg50(lh6) + th);
      } else {
        rect.top = Math.min(rect.top, yt);
      }

      rect.right = Math.max(rect.right, rt);
    }
  }

  for (var i = 0; i < node.childs.length; i++) {
    getRect(node.childs[i], rect);
  }

  return rect;
}

function createChild(node) {
  var rule = node.rule + '' + node.subRule;

  node.left = tind;
  node.as = 'child';

  if (!/3|40|60|71/.test(rule)) {
    Object.defineProperty(node, 'right', {
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
  var res = { 'childs': [] };
  var xt = Object.getOwnPropertyDescriptor(obj, 'x');
  var yt = Object.getOwnPropertyDescriptor(obj, 'y');
  var rt = Object.getOwnPropertyDescriptor(obj, 'right');

  if (xt) Object.defineProperty(res, 'x', xt);
  if (yt) Object.defineProperty(res, 'y', yt);
  if (rt) Object.defineProperty(res, 'right', xt);

  for (var key in obj) {
    if (key != 'childs') {
      res[key] = obj[key];
    }
  }

  return res;
}

function change7_10(node, rule, srule) {
  if (node.rule == 7 || node.rule == 10) {
    console.log(node.rule + ',' + node.subRule, '=', rule + ',' + srule);
    node.parent.childs.push(copy(node));

    var xt = Object.getOwnPropertyDescriptor(node, 'x').get;

    if (xt) {
      Object.defineProperty(node, 'x', {
        configurable: true,
        get: function() { return xt() - tind/2; }
      });
    }

    node.rule = rule;
    node.as = 'parent';

    if (!isNaN(srule)) node.subRule = srule;
  }
}

var rules = [new RuleDefault, new Rule1, new Rule2, new Rule3, new Rule4, new Rule5, new Rule6, new Rule7, new Rule8, new Rule9, new Rule10, new RuleMerge];

function RuleDefault() {
  this.getData = function(child, parent) {
    console.warn('RuleDefault', child.id, child.value, parent.value);
  };

  this.drawNode = function() {};
}

function Rule1() {
  this.getData = function(child, parent) {
    console.log('Rule(1:' + child.subRule + ')', child.id, child.value, parent.value);

    if (child.subRule) { // Rule(1:1)
      // __ parent __|__ child __
      createChild(child);
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: function() { return parent.right; }
        },
        'y': {
          configurable: true,
          get : function() { return parent.y; }
        }
      });
    } else { // Rule(1:0)
      // __ child __|__ parent __
      //            |
      change7_10(parent, 1, 0);
      createChild(child);
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get : function() {
            var max = Math.max(this.left + tind, tw(this.value) + tind*2);

            if (parent.rule == 6) {
              return parent.x - max - tind - lh6;
            }

            return parent.x - max;
          }
        },
        'y': {
          configurable: true,
          get : function() {
            if (parent.rule == 6) {
              return parent.y - deg50(lh6);
            }

            return parent.y;
          }
        }
      });
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // Rule(1:1)
      // __ parent __|__ child __
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.moveTo(node.right, node.y - lh1);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y - lh1);
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      }
    } else { // Rule(1:0)
      // __ child __|__ parent __
      //            |
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y - lh1);
        graph.lineTo(node.x, node.y + lh1);
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.moveTo(node.right, node.y - lh1);
        graph.lineTo(node.right, node.y + lh1);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      }
    }
  };
}

function Rule2() {
  this.getData = function(child, parent) {
    // ___ parent ___\___ child ____

    console.log('Rule(2)', child.id, child.value, parent.value);
    createChild(child);
    Object.defineProperties(child, {
      'x': {
        configurable: true,
        get: function() { return parent.right; }
      },
      'y': {
        configurable: true,
        get : function() { return parent.y; }
      }
    });
  };

  this.drawNode = function(node) {
    // ___ parent ___\___ child ____

    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.moveTo(node.right - lh2, node.y - deg50(lh2));
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    } else {
      graph.moveTo(node.x - lh2, node.y - deg50(lh2));
      graph.lineTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    }
  };
}

function Rule3() {
  this.getData = function(child, parent) {
    console.log('Rule(3:' + child.subRule + ')', child.id, child.value, parent.value);

    if (child.subRule) { // Rule(3:1)
      //  \
      //  /\ parent
      // /  \
      // \
      //  \ child
      //   \
      createChild(child);
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: function() { return parent.x; }
        },
        'y': {
          configurable: true,
          get : function() { return parent.y + deg50(lh3); }
        }
      });
    } else { // Rule(3:0)
      // __ parent __
      //    \
      //     \ child
      //      \
      change7_10(parent, 3, 0);
      createChild(child);
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: (function() { return parent.x + lh3 + this; }).bind(parent.left)
        },
        'y': {
          configurable: true,
          get : function() { return parent.y + deg50(lh3); }
        }
      });

      parent.left += tw(child.value) + lh3/2 + th/2;
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // Rule(3:1)
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
    } else { // Rule(3:0)
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
  this.getData = function(child, parent) {
    console.log('Rule(4:' + child.subRule + ')', child.id, child.value, parent.value);

    if (child.subRule) { // Rule(4:1)
      // \
      //  \ parent
      //   \__ child __

      createChild(child);
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: function() { return parent.x; }
        },
        'y': {
          configurable: true,
          get : function() { return parent.y; }
        }
      });

      if ('parent' in parent) {
        parent.parent.left -= Math.max(lh4/2 + th/2 + tw(parent.value), lh4 + tind);
        parent.parent.left += Math.max(lh4/2 + th/2 + tw(parent.value), lh4 + tind + tw(child.value));
      }
    } else { // Rule(4:0)
      // __ parent __
      //    \
      //     \ child
      //      \__

      createChild(child);
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: (function() { return parent.x + lh4 + this; }).bind(parent.left)
        },
        'y': { get : function() { return parent.y + deg50(lh4); } }
      });

      parent.left += Math.max(lh4/2 + th/2 + tw(child.value), lh4 + tind);
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // Rule(4:1)
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
    } else { // Rule(4:0)
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

function Rule5() {
  this.getData = function(child, parent) {
    // __ parent __
    //    \
    //     \
    //      \__ child __
    console.log('Rule(5:' + child.subRule + ')', child.id, child.value, parent.value);
  };

  this.drawNode = function(node) {
    // __ parent __
    //    \
    //     \
    //      \__ child __
    // graph.fillText(parent, x + tind, y - tpb);
    // graph.lineTo(x += tind + tw(parent) + tind, y);
    // graph.lineTo(x += 30, y += deg50(30));
    // graph.fillText(child, x + tind, y - tpb);
    // graph.lineTo(x += tind + tw(child) + tind, y);
  };
}

function Rule6() {
  this.getData = function(child, parent) {
    console.log('Rule(6:' + child.subRule + ')', child.id, child.value, parent.value);

    var r = parent.rule;
    var sr = parent.subRule;

    if (child.subRule) { // Rule(6:1)
      //     ___ child ___
      //    /|            
      // __/ |             
      //   \ |             
      //    \|__ parent __

      if (r != 6) {
        if (r != 1 || sr != 0) {
          var tempX61 = Object.getOwnPropertyDescriptor(parent, 'x').get;
          var tempY61 = Object.getOwnPropertyDescriptor(parent, 'y').get;

          if (tempX61) {
            Object.defineProperty(parent, 'x', {
              configurable: true,
              get: function() { return tempX61.call(this) + tind + lh6; }
            });
          } else parent.x += tind + lh6;

          if (tempY61) {
            Object.defineProperty(parent, 'y', {
              configurable: true,
              get: function() { return tempY61() + deg50(lh6); }
            });
          } else parent.y += deg50(lh6);
        }

        parent.rule = 6;
        parent.subRule = 1;
        parent.as = 'parent';
      }

      createChild(child);
      child.height = deg50(lh6);

      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: function() { return parent.x; }
        },
        'y': {
          configurable: true,
          get: function() { return parent.y - deg50(lh6*2); }
        }
      });
    } else { // Rule(6:0)
      //     
      //    /|            
      // __/ | child       
      //   \ |             
      //    \|__ parent __

      if ((r == 3 || r == 8) && parent.as == 'child') {
        var copy38 = copy(parent);
        copy38.value = '';
        parent.parent.childs.push(copy38);
      }

      if (r != 1 || sr != 0) {
        var tempX60 = Object.getOwnPropertyDescriptor(parent, 'x').get;
        var tempY60 = Object.getOwnPropertyDescriptor(parent, 'y').get;

        if (tempX60) {
          Object.defineProperty(parent, 'x', {
            configurable: true,
            get: function() { return tempX60.call(this) + tind + lh6; }
          });
        } else parent.x += tind + lh6;

        if (tempY60) {
          Object.defineProperty(parent, 'y', {
            configurable: true,
            get: function() { return tempY60() + deg50(lh6); }
          });
        } else parent.y += deg50(lh6);

        if (!Object.getOwnPropertyDescriptor(parent, 'right')) {
          Object.defineProperty(parent, 'right', {
            get: function() { return right.call(this); }
          });
        }
      }

      parent.rule = 6;
      parent.subRule = 0;
      parent.as = 'parent';

      createChild(child);
      Object.defineProperties(child, {
        'x': { get: function() { return parent.x; } },
        'y': { get: function() { return parent.y - deg50(lh6); } },
      });
    }
  };

  this.drawNode = function(node) {
    var xt = node.x - lh6 - tind, yt = node.y - deg50(lh6);

    if (node.subRule) { // Rule(6:1)
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
      }
    } else { // Rule(6:0)
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
  this.getData = function(child, parent) {
    console.log('Rule(' + child.rule + ':' + child.subRule + ')', child.id, child.value, parent.value);

    if (child.subRule) { // Rule(7:1)
      // __ parent __
      //   |
      //   | child
      //   |
      createChild(child);
      Object.defineProperties(child, {
        'x': { get: function() { return parent.x + tind/2; } },
        'y': { get: function() { return parent.y - 45; } } // 45 - отступ
      });
    } else { // Rule(7:0)
      // __ parent __
      //   |
      //   |
      //   |
      // __ child __
      var ym = parent.y;

      if (parent.rule != 6 || parent.subRule != 1) {
        ym = getRect(currentNode).bottom;
      } else {
        // parent.height = 0;
      }

      createChild(child);
      child.height = Math.abs(ym - parent.y) + lh7;
      Object.defineProperties(child, {
        'x': {
          configurable: true,
          get: function() {
            if (parent.rule == 1 || parent.rule == 6) {
              return parent.x + tind/2;
            }
            return parent.x;
          }
        },
        'y': {
          configurable: true,
          get: function() { return parent.y + child.height; }
        }
      });
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // Rule(7:1)
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
    } else { // Rule(7:0)
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
  this.getData = function(child, parent) {
    // __ parent __
    //    \
    //     \ to
    //      \__ child __
    console.log('Rule(8)', child.id, child.value, parent.value);
    createChild(child);
    Object.defineProperties(child, {
      'x': {
        configurable: true,
        get: (function() { return parent.x + lh8 + this; }).bind(parent.left)
      },
      'y': {
        configurable: true,
        get: function() { return parent.y + deg50(lh8); }
      }
    });

    parent.left += lh8 + tw(child.value) + tind;
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
  this.getData = function(child, parent) {
    console.error('Rule(9:' + child.subRule + ')', child.id, child.value, parent.value);
  };

  this.drawNode = function() {};
}

function Rule10() {
  this.getData = function(child, parent) {
    if (child.subRule) { // Rule(10:1)
      rules[7].getData(child, parent);
    } else { // Rule(10:0)
      rules[7].getData(child, parent);
    }
  };

  this.drawNode = function(node) {
    rules[7].drawNode(node);
  }
}

function RuleMerge() {
  this.getData = function(child, parent) {
    console.warn('RuleMerge', child.id, child.value, parent.value);
  };

  this.drawNode = function() {};
}


/* список изменений */
// + удаление лишних пробелов для правильного парсинга предложения
// + исправлены отрицательные координаты
// + если за 3 правилом идет 3 правило рисовать их по другому
// + оптимальная высота для пунктирной линии 7го правила
// + там где нет связи выводить сообщение
// + исправлена замена объектов при одинаковом уровне вхождения
// + RuleDefault и RuleMerge прибавляются к родителю
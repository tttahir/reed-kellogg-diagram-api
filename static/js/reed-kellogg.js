var sentence = document.getElementById('sentence');
var scale = document.getElementById('range');
var tagInfo = document.getElementById('tag-info');
var canvasParent = document.getElementById('canvas-outer');
var canvas = document.getElementById('draw');
var graph = canvas.getContext('2d');
var pstyle = getComputedStyle(canvasParent);
var font = pstyle.fontSize + ' ' + pstyle.fontFamily;
var strokeStyle = '#000';
var lineWidth = 1;

graph.font = font;
graph.strokeStyle = strokeStyle;
graph.lineWidth = lineWidth;
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
// sentence.value += "Coffee is a delicate art, perfected over centuries of history and world culture and tastes. "; // [6,0]
// sentence.value += "The United States of America, commonly known as the United States or America, is a federal republic composed of 50 states. ";
// sentence.value += "Cofee is a delicate art preferd over centuries. ";
// sentence.value += "From Paris with love. "; // [4,0], [4,1]
// sentence.value += "Captain James Cook's last voyage included sailing along the coast of North America and Alaska searching for a Northwest Passage for approximately nine months. "; // [1,0], [3,0], [1,1], [4,0], [4,1], [6,0], [6,1], [7,0]

// sentence.value += "The Robert Mueller inquiry into alleged collusion with Russia in the election is one of the most explosive stories in US politics. ";
// sentence.value += "Leftwing control of the NEC was one of the last pieces to fall into place. ";
// sentence.value += "My parents saw them at a concert a long time ago. "; // [1,0], [3,0], [1,1], [4,1], [7,0], [4,0]
// sentence.value += "Sally ran down the street. "; // [3,0], [4,0], [4,1]
// sentence.value += "Old as Mary and you. "; // [4,0], [4,1], [6,0], [6,1]
// sentence.value += "Hello i'm your daughter. "; // [0,0], [1,0], [2,0], [3,0]
sentence.value += "Ellen needs help. "; // [1,0], [1,1]
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
// sentence.value += "The ship drew-on and had safely passed the strait. "; // [6,0]
// sentence.value += "The young man left his station by the pilot once he spotted the owner. " // [7,0], [7,1]

/* =========== за 3,0 следует 3,0 =========== */
// sentence.value += "How many apples does mary has. "; // [1,1], [3,0]->[3,0], [1,0]
// sentence.value += "The students worked so very hard. "; // [1,0], [3,0], [3,0], [3,0], [3,0]

/* 9 правило */
// sentence.value += "Leaving his station by the pilot, the young man on board saw this person approach. ";
// sentence.value += "Trailblazers are the ones who make the world go around. ";
// sentence.value += "Trailblazers make the world go round. ";
// sentence.value += "The young man on board saw this person approach. ";
// sentence.value += "To know him is to love him. "; // [9,0], [9,1], [11,0], [1,0], [1,1]
// sentence.value += "Tom stopped to take a close look at the car. "; // [1,0], [9,1], [11,0], [1,1], [3,0], [4,0], [4,1]
// sentence.value += "Mary tried her best to win the writing contest, but lacked the skills and training she really needed. "; // [6,0], [6,1]
// sentence.value += "The boys were engaged in extreme sports, each being injured while trying to push their limits. ";
// sentence.value += "When the young man on board saw this person approach, he left his station by the pilot, and, hat in hand, leaned over the ship's butwarks";

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

if (!debug) sentence.value = '';

var th = parseInt(graph.font); // text height - (font-size in px)
var tpb = 7; // text padding bottom
const x = 20, y = 20 + th + tpb;
var tpl = 3; // text padding left
var tind = 20; // text indent
var prht = 10; // padding right
/* длина линии */
var lh1 = 25, lh2 = 16, lh3 = 35, lh4 = 50, lh6 = 30, lh7 = 120, lh8 = 50, lh9 = 70;

var currentNode = {};
var parents = 0;

function drawSents(nodeList) {
  if (!nodeList.length) return;

  canvas.className = 'border';
  
  for (var i = 0; i < nodeList.length; i++) {
    currentNode = {};
    parents = 0;

    console.log('<<<<<<<<< Sentence', i, '>>>>>>>>>');
    setParentCoords(nodeList[i]);
    processTree(nodeList[i], currentNode, 0);
    clearWords();

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
      var out = document.getElementById('diagrams');
      var img = new Image();
      out.innerHTML = '';
      img.src = canvas.toDataURL();
      out.appendChild(img);
    }
    console.log(nodeList[i]);
    // console.log(currentNode);
  }
}

function clearWords() {
  var words = canvasParent.children;
  while (words[1]) {
    canvasParent.removeChild(words[1]);
  }
}

function setParentCoords(node) {
  var rule = node.rule + '' + node.subRule;

  currentNode = copy(node);
  currentNode.x = x;
  currentNode.y = y;
  currentNode.left = tind;

  if (rule == '90') {
    currentNode.left += tind*2 + lh2*2;
    Object.defineProperty(currentNode, 'right', {
      get: function() { return this.x + this.left + tind + tw(this.value); }
    });
  } else if (rule != '41') {
    Object.defineProperty(currentNode, 'right', {
      get: function() { return right.call(this); }
    });
  }
}

function processTree(nodeTree, newTree, id) {
  for (var i = 0, j = 0; i < nodeTree.childs.length; i++) {
    var r = nodeTree.childs[i].rule;
    j = newTree.childs.push(copy(nodeTree.childs[i]));
    newTree.childs[j - 1].parent = newTree;
    newTree.childs[j - 1].id = id;
    rules[r - 1].getData(newTree.childs[j - 1]);
    processTree(nodeTree.childs[i], newTree.childs[j - 1], id + 1);
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
  graph.font = font;
  graph.strokeStyle = strokeStyle;
  graph.lineWidth = lineWidth;
  rules[node.rule - 1].drawNode(node);
}

function drawTree(nodeTree) {
  for (var i = 0; i < nodeTree.childs.length; i++) {
    rules[nodeTree.childs[i].rule - 1].drawNode(nodeTree.childs[i]);
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

  for (var i = 0; i < node.childs.length; i++) {
    getRect(node.childs[i], rect);
  }

  return rect;
}

function setChildCoords(node) {
  var rule = node.rule + '' + node.subRule;
  node.left = tind;

  if (/3|40|71/.test(rule)) {
    Object.defineProperty(node, 'right', {
      get: function() { return this.x; }
    });
  } else {
    Object.defineProperty(node, 'right', {
      get: function() { return right.call(this); }
    });
  }
}

function increaseLeft(node, left) {
  var child = node.parent;
  var parent = child.parent;

  while (parent) {
    var r = parent.rule, cr = child.rule;
    var sr = parent.subRule, csr = child.subRule;

    if ((cr == 1 || cr == 2) && (r == 1 || r == 6 || r == 8)) {
      console.log(child.value, parent.value);
    } else if (cr == 6 && csr == 1 && r == 6 && sr == 0) {
      console.log(child.value, parent.value);
    } else parent.left += left;

    child = parent;
    parent = parent.parent;
  }
}

function copy(obj) {
  var res = { 'childs': [] };
  var xt = Object.getOwnPropertyDescriptor(obj, 'x');
  var yt = Object.getOwnPropertyDescriptor(obj, 'y');
  var rt = Object.getOwnPropertyDescriptor(obj, 'right');

  if (xt) Object.defineProperty(res, 'x', xt);
  if (yt) Object.defineProperty(res, 'y', yt);
  if (rt) Object.defineProperty(res, 'right', rt);

  for (var key in obj) {
    if (key != 'childs') res[key] = obj[key];
  }

  return res;
}

function change7_10(node, rule, srule) {
  if (node.rule == 7 || node.rule == 10) {
    var out = node.rule + ',' + node.subRule + ' = ' + rule + ',' + srule + ' ' + node.value;

    if (node.parent) {
      node.parent.childs.push(copy(node));
      console.log(out);
    } else {
      console.log(out, 'not pushed');
    }

    node.rule = rule;
    node.as = 'parent';

    if (!isNaN(srule)) node.subRule = srule;
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

function right() {
  if (this.value == '') return this.x;
  return Math.max(this.x + this.left + prht, this.x + tw(this.value) + tind*2);
}

function showLog(node) {
  var str = [
  '%cRule(' + node.rule + ':' + node.subRule + ')',
  '%c' + node.id,
  '%c' + node.value,
  '%c' + node.parent.value
  ];

  console.log(str.join(' '), 'color: #79f592', 'color: #8daef6', 'color: #ffd979', 'color: #fff');
}

function fillText(node, x, y) {
  var tag = document.createElement('div');
  tag.textContent = node.value;
  tag.className = 'tag';
  tag.style.width = (tw(node.value) + 5) + 'px';
  tag.style.left = (x - 2) + 'px';
  tag.style.top = (y - 15) + 'px';
  tag.addEventListener('mouseenter', function() {
    showInfo(node.value, node.part, node.dep);
  });
  canvasParent.appendChild(tag);
}

function showInfo(text, part, dep) {
  if (tagInfo.style.visibility == 'hidden') {
    tagInfo.style.visibility = 'visible';
    tagInfo.style.opacity = 1;
  }

  $('#word').text(text);
  $('#part').text(part);
  $('#dep').text(dep);
}

var rules = [new Rule1, new Rule2, new Rule3, new Rule4, new Rule5, new Rule6, new Rule7, new Rule8, new Rule9, new Rule7];

function Rule1() {
  this.getData = function(node) {
    showLog(node);

    if (node.subRule) { // Rule(1:1)
      // __ parent __|__ child __
      setChildCoords(node);
      Object.defineProperties(node, {
        'x': { get: function() { return node.parent.right; } },
        'y': { get : function() { return node.parent.y; } }
      });
    } else { // Rule(1:0)
      // __ child __|__ parent __
      //            |
      // change7_10(node.parent, 1, 0);
      setChildCoords(node);
      Object.defineProperties(node, {
        'x': {
          get : function() {
            var max = Math.max(this.left + prht, tw(this.value) + tind*2);

            if (node.parent.rule == 6) {
              return node.parent.x - max - tind - lh6;
            }
            return node.parent.x - max;
          }
        },
        'y': {
          get : function() {
            if (node.parent.rule == 6) {
              return node.parent.y - deg50(lh6);
            }
            return node.parent.y;
          }
        }
      });
    }
  };

  this.drawNode = function(node) {
    fillText(node, node.x + tind, node.y - tpb);

    if (node.subRule) { // Rule(1:1)
      // __ parent __|__ child __

      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.moveTo(node.right, node.y - lh1);
        graph.lineTo(node.right, node.y);
      } else {
        graph.moveTo(node.x, node.y - lh1);
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
      }
    } else { // Rule(1:0)
      // __ child __|__ parent __
      //            |
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y - lh1);
        graph.lineTo(node.x, node.y + lh1);
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.moveTo(node.right, node.y - lh1);
        graph.lineTo(node.right, node.y + lh1);
      }
    }
  };
}

function Rule2() {
  this.getData = function(node) {
    // ___ parent ___\___ child ____

    showLog(node);
    setChildCoords(node);
    Object.defineProperties(node, {
      'x': { get: function() { return node.parent.right; } },
      'y': { get : function() { return node.parent.y; } }
    });
  };

  this.drawNode = function(node) {
    // ___ parent ___\___ child ____
    fillText(node, node.x + tind, node.y - tpb);

    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.moveTo(node.right - lh2, node.y - deg50(lh2));
      graph.lineTo(node.right, node.y);
    } else {
      graph.moveTo(node.x - lh2, node.y - deg50(lh2));
      graph.lineTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
    }
  };
}

function Rule3() {
  this.getData = function(node) {
    showLog(node);

    if (node.subRule) { // Rule(3:1)
      //  \
      //  /\ parent
      // /  \
      // \
      //  \ child
      //   \
      setChildCoords(node);
      node.width = Math.max(tw(node.value) + lh3/2 + th/2, lh3) + prht;
      var incLeft = node.width - node.parent.width;

      if (incLeft > 0) increaseLeft(node, incLeft);
      else node.width = node.parent.width;

      Object.defineProperties(node, {
        'x': { get: function() { return node.parent.x; } },
        'y': { get : function() { return node.parent.y + deg50(lh3); } }
      });
    } else { // Rule(3:0)
      // __ parent __
      //    \
      //     \ child
      //      \
      // change7_10(node.parent, 3, 0);
      setChildCoords(node);
      node.width = Math.max(tw(node.value) + lh3/2 + th/2, lh3) + prht;
      Object.defineProperties(node, {
        'x': {
          get: (function() { return node.parent.x + lh3 + this; }).bind(node.parent.left)
        },
        'y': { get : function() { return node.parent.y + deg50(lh3); } }
      });

      var pwidth = tw(node.parent.value) + tind;
      
      if (node.parent.left < pwidth) {
        var incLeft = node.parent.left + node.width - pwidth;
        if (incLeft > 0) increaseLeft(node, incLeft);
      } else increaseLeft(node, node.width);
      
      node.parent.left += node.width;
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
      fillText(node, node.x - lh3/2 + th/2, node.y - deg50(lh3/2));

      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x - lh3, node.y - deg50(lh3));
      } else {
        var xt = node.x, yt = node.y;
        graph.moveTo(xt, yt);
        graph.lineTo(xt -= lh3, yt -= deg50(lh3));
        graph.lineTo(xt += lh3/2, yt -= deg50(lh3/2));
      }
    } else { // Rule(3:0)
      // __ parent __
      //    \
      //     \ child
      //      \
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        fillText(node, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x - lh3, node.y - deg50(lh3));
        fillText(node, node.x - lh3/2 + th/2, node.y - deg50(lh3/2));
      }
    }
  };
}

function Rule4() {
  this.getData = function(node) {
    var cwidth = 0;
    var pwidth = 0;
    showLog(node);

    if (node.subRule) { // Rule(4:1)
      // \
      //  \ parent
      //   \__ child __

      setChildCoords(node);
      Object.defineProperties(node, {
        'x': { get: function() { return node.parent.x; } },
        'y': { get : function() { return node.parent.y; } }
      });

      if (node.parent.parent) {
        var preleft = node.parent.parent.left - node.parent.width;
        var pleft = node.parent.parent.left;
        cwidth = lh4 + tind*2 + tw(node.value);
        var incLeft = preleft + cwidth - pleft;
        pwidth = tw(node.parent.parent.value);

        if (pleft < pwidth + tind) {
          incLeft = preleft + cwidth - pwidth;
          if (incLeft > 0) increaseLeft(node, incLeft);
        } else increaseLeft(node, incLeft);
      }
    } else { // Rule(4:0)
      // __ parent __
      //    \
      //     \ child
      //      \__

      setChildCoords(node);
      node.width = Math.max(lh4/2 + th/2 + tw(node.value), lh4 + tind) + prht;
      Object.defineProperties(node, {
        'x': {
          get: (function() { return node.parent.x + lh4 + this; }).bind(node.parent.left)
        },
        'y': { get : function() { return node.parent.y + deg50(lh4); } }
      });

      pwidth = tind + tw(node.parent.value);
      
      if (node.parent.left < pwidth) {
        var incLeft = node.parent.left + node.width - pwidth;
        if (incLeft > 0) increaseLeft(node, incLeft);
      } else increaseLeft(node, node.width);

      node.parent.left += node.width;
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
        fillText(node, node.x - lh4/2 + th/2, node.y - deg50(lh4/2));
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        fillText(node, node.x + tind, node.y - tpb);
      }
    } else { // Rule(4:0)
      // __ parent __
      //    \
      //     \ child
      //      \__
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        fillText(node, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x - lh4, node.y - deg50(lh4));
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.x + tind, node.y);
        fillText(node, node.x - lh4/2 + th/2, node.y - deg50(lh4/2));
      }
    }
  };
}

function Rule5() {
  this.getData = function(node) {
    // __ parent __
    //    \
    //     \
    //      \__ child __
    showLog(node);
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
  this.getData = function(node) {
    showLog(node);

    if (node.subRule) { // Rule(6:1)
      //     ___ child ___
      //    /|            
      // __/ |             
      //   \ |             
      //    \|__ parent __

      setChildCoords(node);
      node.height = deg50(lh6);
      Object.defineProperties(node, {
        'x': { get: function() { return node.parent.x; } },
        'y': { get: function() { return node.parent.y - deg50(lh6*2); } }
      });
    } else { // Rule(6:0)
      //     
      //    /|            
      // __/ | child       
      //   \ |             
      //    \|__ parent __
      var r = node.parent.rule;
      var sr = node.parent.subRule;
      setChildCoords(node);

      if (node.as == 'parent') {
        if (r == 6) {
          Object.defineProperties(node, {
            'x': { get: function() { return node.parent.x + tind + lh6; } },
            'y': { get: function() { return node.parent.y - deg50(lh6); } },
          });
        } else if (r != 1 || sr != 0) {
          Object.defineProperties(node, {
            'x': { get: function() { return node.parent.x + tind + lh6; } },
            'y': { get: function() { return node.parent.y + deg50(lh6); } },
          });
        } else {
          Object.defineProperties(node, {
            'x': {
              get: function() {
                var max = Math.max(this.left + prht, tw(this.value) + tind*2);
                return node.parent.x - max;
              }
            },
            'y': { get: function() { return node.parent.y; } },
          });
        }

        var cwidth = lh6 + tind*3 + tw(node.value);
        var pwidth = tw(node.parent.value);
        var incLeft = 0;
        
        if (r == 3) {
          // 
        } else if (r == 4) {
          if (node.parent.parent) {
            var preLeft = node.parent.parent.left - node.parent.width;
            var pleft = node.parent.parent.left;
            cwidth += lh4;
            incLeft = preLeft + cwidth - pleft;
            pwidth = tw(node.parent.parent.value);

            if (pleft < pwidth + tind) {
              incLeft = preLeft + cwidth - pwidth;
              if (incLeft > 0) increaseLeft(node, incLeft);
            } else increaseLeft(node, incLeft);
          }
        } else if (r == 6) {
          // if (node.parent.left < pwidth) {
          //   var incLeft = node.parent.left + cwidth - pwidth;
          //   if (incLeft > 0) increaseLeft(node, incLeft);
          // } else increaseLeft(node, cwidth);
        } else if (r == 8) {
          if (node.parent.parent) {
            var pleft = node.parent.parent.left;
            pwidth = tind + tw(node.parent.parent.value);

            if (pleft < pwidth) {
              incLeft = pleft + cwidth - pwidth;
              if (incLeft > 0) increaseLeft(node, incLeft);
            } else increaseLeft(node, cwidth);
          }
        }
      } else {
        Object.defineProperties(node, {
          'x': { get: function() { return node.parent.x; } },
          'y': { get: function() { return node.parent.y - deg50(lh6); } },
        });
      }
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
        fillText(node, node.x + tind, yt - tpb);
        graph.moveTo(xt = node.x - lh6, yt = node.y - deg50(lh6));
        graph.lineTo(xt += lh6, yt -= deg50(lh6));
      } else {
        graph.moveTo(node.x - lh6, node.y + node.height);
        graph.lineTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        fillText(node, node.x + tind, node.y - tpb);
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
        fillText(node, node.x + tind, yt - tpb);
        graph.moveTo(xt = node.x - lh6, yt = node.y - deg50(lh6));
        graph.lineTo(xt += lh6, yt -= deg50(lh6));
      } else {
        fillText(node, node.x + 10, node.y);
      }
    }
  };
}

function Rule7() {
  this.getData = function(node) {
    showLog(node);

    if (node.subRule) { // Rule(7:1)
      //  |
      //  | child
      //  |
      // __ parent __
      setChildCoords(node);
      Object.defineProperties(node, {
        'x': { get: function() { return node.parent.x + tind/2; } },
        'y': { get: function() { return node.parent.y - 45; } } // 45 - отступ
      });
    } else { // Rule(7:0)
      // __ parent __
      //   |
      //   |
      //   |
      //  __ child __

      setChildCoords(node);
      node.height = lh7;
      Object.defineProperties(node, {
        'x': {
          get: (function() {
            if (node.parent.rule == 3 && node.parent.as == 'child') return node.parent.x - tind/2;
            return node.parent.x + this - tind/2;
          }).bind(node.parent.left)
        },
        'y': { get: function() { return node.parent.y + node.height; } }
      });

      var cwidth = tind/2 + tw(node.value);
      var pwidth = tw(node.parent.value) + tind;

      if (node.parent.rule == 3) {
        pwidth = tw(node.parent.value) - lh3/2 + th/2;
        if (cwidth - pwidth > 0) increaseLeft(node, cwidth - pwidth)
      } else {
        if (node.parent.left < pwidth) {
          var incLeft = node.parent.left + cwidth - pwidth;
          if (incLeft > 0) increaseLeft(node, incLeft);
        } else increaseLeft(node, cwidth);
      }

      node.parent.left += cwidth;
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // Rule(7:1)
      //  |
      //  | child
      //  |
      // __ parent __
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        fillText(node, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(node.x, node.y);
        dashedLine(node.x, node.y + 45, node.x, node.y - th*2);
        fillText(node, node.x + 7, node.y);
      }
    } else { // Rule(7:0)
      // __ parent __
      //   |
      //   |
      //   |
      //  __ child __
      fillText(node, node.x + tind, node.y - tpb);

      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        dashedLine(node.x, node.y, node.x, node.y + node.height);
      } else {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        dashedLine(node.x + tind/2, node.y, node.x + tind/2, node.y - node.height);
      }
    }
  };
}

function Rule8() {
  this.getData = function(node) {
    // __ parent __
    //    \
    //     \ to
    //      \__ child __
    showLog(node);
    setChildCoords(node);
    Object.defineProperties(node, {
      'x': {
        get: (function() { return node.parent.x + lh8 + this; }).bind(node.parent.left)
      },
      'y': { get: function() { return node.parent.y + deg50(lh8); } }
    });

    var cwidth = lh8 + tind*2 + tw(node.value) + prht;
    var pwidth = tind + tw(node.parent.value);

    if (node.value == '') cwidth -= tind*2;
    
    if (node.parent.left < pwidth) {
      var incLeft = node.parent.left + node.width - pwidth;
      if (incLeft > 0) increaseLeft(node, incLeft);
    } else increaseLeft(node, node.width);

    node.parent.left += cwidth;
  };

  this.drawNode = function(node) {
    // __ parent __
    //    \
    //     \ to
    //      \__ child __
    fillText(node, node.x + tind, node.y - tpb);

    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
    } else {
      var xt = node.x - lh8;
      var to = {
        'value': 'to',
        'part': 'particle',
        'raw': 'Infinitive',
        'rel': 'adverb modifier'
      };

      graph.moveTo(node.x, node.y);
      graph.lineTo(xt, node.y - deg50(lh8));
      fillText(to, xt + lh8/2 + th/2, node.y - deg50(lh8/2));
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
    }
  };
}

function Rule9() {
  this.getData = function(node) {
    showLog(node);
    if (node.subRule) { // Rule(9:1)
      // (x,y)__ child __
      //       |
      //       |
      //       |
      //   \__/_\__ <- parent
      if (node.as == 'parent') {
        Object.defineProperties(node, {
          'x': { get: function() { return node.parent.right; } },
          'y': { get: function() { return node.parent.y; } },
          'right': { get: function() { return this.x + tind*3; } }
        });
      } else {
        setChildCoords(node);
        node.height = lh9;
        Object.defineProperties(node, {
          'x': { get: function() { return node.parent.x + tind + lh2 - tind/2; } },
          'y': { get: function() { return node.parent.y - this.height - deg50(lh2); } }
        });
      }
    } else { // Rule(9:0)
      // (x,y)__ child __
      //       |
      //       |
      //       |
      //    __/_\__|__ parent __
      setChildCoords(node);
      node.height = lh9;
      Object.defineProperties(node, {
        'x': { get: function() { return node.parent.x + tind + lh2 - tind/2; } },
        'y': { get: function() { return node.parent.y - this.height - deg50(lh2); } }
      });
    }
  };

  this.drawNode = function(node) {
    var xt = node.x, yt = node.y;
    if (node.subRule) { // Rule(9:1)
      // (x,y)__ child __
      //       |
      //       |
      //       |
      //   \__/_\__
      if (node.as == 'parent') {
        graph.moveTo(xt - lh2, yt - deg50(lh2));
        graph.lineTo(xt, yt);
        graph.lineTo(node.right, yt);
        graph.moveTo(xt += tind, yt);
        graph.lineTo(xt += lh2, yt - deg50(lh2));
        graph.lineTo(xt + lh2, yt);
      } else {
        graph.moveTo(xt, yt);
        graph.lineTo(node.right, yt);
        graph.moveTo(xt += tind/2, yt);
        graph.lineTo(xt, yt + node.height);
        fillText(node, node.x + tind, node.y - tpb);
      }
    } else { // Rule(9:0)
      // (x,y)__ child __
      //       |
      //       |
      //       |
      //    __/_\__|__ parent __
      if (node.as == 'parent') {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += tind, yt);
        graph.lineTo(xt += lh2, yt - deg50(lh2));
        graph.lineTo(xt += lh2, yt);
        graph.moveTo(xt - lh2*2, yt);
        graph.lineTo(xt += tind, yt);
        graph.moveTo(xt, yt - lh1);
        graph.lineTo(xt, yt);
        graph.lineTo(node.right, yt);
        fillText(node, xt + tind, yt - tpb);
      } else {
        graph.moveTo(xt, yt);
        graph.lineTo(node.right, yt);
        graph.moveTo(xt += tind/2, yt);
        graph.lineTo(xt, yt + node.height);
        fillText(node, node.x + tind, node.y - tpb);
      }
    }
  };
}


/* список изменений */
// + удаление лишних пробелов для правильного парсинга предложения
// + исправлены отрицательные координаты
// + если за 3 правилом идет 3 правило рисовать их по другому
// + оптимальная высота для пунктирной линии 7го правила
// + там где нет связи выводить сообщение
// + исправлена замена объектов при одинаковом уровне вхождения
// + RuleDefault и RuleMerge прибавляются к родителю
// + замена 2го 6ым
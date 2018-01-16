function onEnter(event, callback) {
  if (event.keyCode == 13) {
    event.preventDefault();
    callback();
  }
}

function processSentence() {
  var sentence = document.getElementById('sentence').value;

  if (sentence.trim() == '') return;

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

var sentence = document.getElementById('sentence');
sentence.value = '';

/* нет примера для 5-го правила */
// sentence.value += "Old as Mary and you. "; // [[4,0], [4,1], [6,0], [6,1]]
// sentence.value += "Hello i'm your daughter. "; // [[0,0], [1,0], [2,0], [3,0]]
// sentence.value += "Ellen needs help. "; // [[1,0], [1,1]]
// sentence.value += "Ellen from Mars needs help. "; // [[1,0], [1,1]]
// sentence.value += "She's not as old as Mary. "; // [[1,0], [3,0], [2,0], [4,0], [4,1]]
// sentence.value += "The visitors from El Paso arrived on schedule. "; // [[1,0], [3,0], [0,0], [4,1], [4,0]]
// sentence.value += "The visitors from Mars on schedule. "; // [[3,0], [0,0], [4,1], [4,0]]
// sentence.value += "From Paris with love. "; // [[4,0], [4,1]]
// sentence.value += "My parents saw them at a concert a long time ago. "; // [[1,0], [3,0], [1,1], [4,1], [7,0], [4,0]]
// sentence.value += "Jennifer took on two paper routes to earn money for camp. "; // [[1,0], [0,0], [1,1], [4,1], [8,0], [4,0]]
// sentence.value += "Jennifer took on the routes from Mars to earn money for camp. "; // [[1,0], [0,0], [1,1], [4,1], [8,0], [4,0]]
// sentence.value += "The house looks tidy and good, but the yard is a mess and a bad. "; // [[1,0], [3,0], [2,0], [6,1], [6,0], [0,0], [10,0], [10,1]]
// sentence.value += "The house looks tidy, but the yard is a mess. ";
// sentence.value += "The guy must pass several trials to see and to take his bride away. "; // [[1,0], [3,0], [1,1], [8,0], [6,0], [6,1]]
// sentence.value += "The guy must pass several trials to see his bride away. ";
// sentence.value += "A see his the bride away. ";
// sentence.value += "John, Mary and Sam were there. "; // [[1,0], [0,0], [6,1], [6,0], [3,0]]
// sentence.value += "John and Sam were there. "; // [[1,0], [0,0], [6,1], [6,0], [3,0]]
// sentence.value += "The people who live on this street seem pleasant. "; // [[1,0], [3,0], [7,0], [4,0], [4,1], [0,0]]
// sentence.value += "We enjoy talking. "; // [[1,0], [11,0]]
sentence.value += "My brother and I are getting together for dinner. "; // [[1,0], [3,0], [6,0], [6,1], [11,0], [4,0], [4,1]]
// sentence.value += "He left early because he felt sick. "; // [[1,0], [3,0], [7,0], [7,1], [2,0]]
// sentence.value += "We are campers tired but happy. "; // 1 [[1,0], [2,0], [3,0], [6,0], [6,1]]
sentence.value += "He can and should finish the job. "; // [[1,0], [11,0], [6,0], [1,1], [3,0]]
// sentence.value += "And a the finish the job. "; // [[1,0], [11,0], [6,0], [1,1], [3,0]]
// sentence.value += "And finish. "; // [[1,0], [11,0], [6,0], [1,1], [3,0]]
// sentence.value += "Everyone wondered when would end the play. "; // [[1,0], [1,1], [7,0], [3,0], [11,0]]
// sentence.value += "The students worked so very hard. "; // [[1,0], [3,0], [3,0], [3,0], [3,0]]

/* 9 правило */
// sentence.value += "You choose a color that you like. "; // [[1,0], [1,1], [3,0], [9,1]]
// sentence.value += "To know him is to love him. "; // [[9,0], [9,1], [11,0], [1,0], [1,1]]
// sentence.value += "Tom stopped to take a close look at the car. "; // [[1,0], [9,1], [11,0], [1,1], [3,0], [4,0], [4,1]]

/* сложное предложение */
// 2 [[3,0], [7,0], [1,0], [2,0], [6,0], [6,1], [0,0], [4,0], [4,1]]
sentence.value += "A long time ago the house looked neat and nice, like a new one, but eventually became obsolete. ";

// [[1,0], [3,0], [4,0], [4,1]] (1)
// sentence.value += "The fighter seems out of shape. ";
// sentence.value += "The fighter seems out of of of of of the shape. ";
// sentence.value += "The fighter seems of the shape. ";


var scale = document.getElementById('range');
var canvas = document.getElementById('draw');
var graph = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
var xs = 100, ys = 100; // center
var x = xs, y = ys;
var th = 16; // text height - (font-size in px)
var tpb = 7; // text padding bottom
var tpl = 3; // text padding left
var tind = 20; // text indent
// diagonal line height
var dlh4 = 40; // для 4-го правила
var dlh8 = 50; // для 8-го правила
var lh = 110;
var prevNode = {}, nodes = {};

prevNode['rule'] = [];

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

graph.font = th + 'px Play';
graph.strokeStyle = '#000';
graph.lineWidth = 1;

function drawSents(nodeList) {
  if (!nodeList.length) return;

  var out = document.getElementById('diagrams');
  
  for (var i = 0; i < nodeList.length; i++) {
    graph.save();
    graph.clearRect(0, 0, w, h);
    graph.scale(scale.value, scale.value);
    graph.beginPath();
    x = xs; y = ys;
    graph.moveTo(x, y);
    nodes = {};

    console.log('<<<<<<<<< Sentence', i, '>>>>>>>>>');
    processTree(nodeList[i]);
    for (var node in nodes) {
      rules[nodes[node].rule].drawNode(nodes[node]);
    }

    graph.stroke();
    graph.restore();

    var img = new Image();

    img.src = canvas.toDataURL();
    out.appendChild(img);
  }
}

var tempChild = '', tempParent = '';

/*
Rule1 1 0 brother getting
Rule6 2 0 and brother


Rule1 1 0 He finish
Rule6 1 0 and finish


Rule1 1 0 house looked
Rule6 1 0 but looked
Rule6 2 0 and neat
*/

function processTree(nodeTree) {
  if ('rule' in nodeTree) {
    if (nodeTree.rule.toString() == '1,0') {
      tempChild = nodeTree.value;
      tempParent = nodeTree.parent;
    }

    if (nodeTree.rule.toString() == '6,0') {
      if (tempChild == nodeTree.parent) {
        // 6 правило было не последнее
        rules[nodeTree.rule[0]].getData(nodeTree.id, nodeTree.rule[1], nodeTree.value, nodeTree.parent, false);
      } else if (tempParent == nodeTree.parent) {
        // 6 правило было последнее
        rules[nodeTree.rule[0]].getData(nodeTree.id, nodeTree.rule[1], nodeTree.value, nodeTree.parent, true);
      } else {
        rules[nodeTree.rule[0]].getData(nodeTree.id, nodeTree.rule[1], nodeTree.value, nodeTree.parent, false);
      }
    } else if (prevNode.rule.toString() == '4,0' && nodeTree.rule.toString() == '4,0') {
      console.log('4,0->4,0');
    } else if (prevNode.rule.toString() == '4,0' && nodeTree.rule.toString() == '4,1') {
      console.log('4,0->4,1');
      rules[nodeTree.rule[0]].getData(nodeTree.id, nodeTree.rule[1], nodeTree.value, nodeTree.parent);
    } else {
      rules[nodeTree.rule[0]].getData(nodeTree.id, nodeTree.rule[1], nodeTree.value, nodeTree.parent);
    }

    prevNode = {
      'id': nodeTree.id,
      'rule': nodeTree.rule,
      'parent': nodeTree.parent
    };
  }

  for (var i = 0; i < nodeTree.childs.length; i++) {
    processTree(nodeTree.childs[i]);
  }
}

var rules = [new RuleDefault, new Rule1, new Rule2, new Rule3, new Rule4, new Rule5, new Rule6, new Rule7, new Rule8, new Rule9, new Rule10, new RuleMerge];

function Rule1() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule1', id, subRule, child, parent);
    var parentKey = parent + '_' + (id - 1);
    var childKey = child + '_' + id;

    if (subRule) { // rule_1_1
      // __ parent __|__ child __
      if (parentKey in nodes) {
        x = nodes[parentKey].right;
        y = nodes[parentKey].y;
      } else {
        nodes[parentKey] = {
          'x': x,
          'y': y,
          'left': tind,
          'value': parent,
          'rule': 1,
          'subRule': 1,
          'as': 'parent'
        };

        Object.defineProperty(nodes[parentKey], 'right', {
          configurable: true,
          get: function() { return right.call(this); }
        });
      }

      nodes[childKey] = {
        'y': y,
        'left': tind,
        'value': child,
        'rule': 1,
        'subRule': 1,
        'as': 'child'
      };

      x += tw(child) + tind*2;

      Object.defineProperties(nodes[childKey], {
        'x': {
          configurable: true,
          get: function() { return nodes[parentKey].right; }
        },
        'right': {
          configurable: true,
          get: function() { return right.call(this); }
        }
      });
    } else { // rule_1_0
      // __ child __|__ parent __
      //            |
      if (parentKey in nodes) {
        x = nodes[parentKey].x - tw(child) - tind*2;
        y = nodes[parentKey].y;
      }

      nodes[childKey] = {
        'x': x,
        'y': y,
        'left': tind,
        'value': child,
        'rule': 1,
        'subRule': 0,
        'as': 'child'
      };

      Object.defineProperty(nodes[childKey], 'right', {
        configurable: true,
        get: function() { return right.call(this); }
      });

      if (!(parentKey in nodes)) {
        nodes[parentKey] = {
          'y': y,
          'left': tind,
          'value': parent,
          'rule': 1,
          'subRule': 0,
          'as': 'parent'
        };

        x += tw(parent) + tind*2;

        Object.defineProperties(nodes[parentKey], {
          'x': {
            configurable: true,
            get: function() { return nodes[childKey].right; }
          },
          'right': {
            configurable: true,
            get: function() { return right.call(this); }
          }
        });
      }
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
    var parentKey = parent + '_' + (id - 1);
    var childKey = child + '_' + id;

    if (parentKey in nodes) {
      x = nodes[parentKey].right;
      y = nodes[parentKey].y;
    } else {
      nodes[parentKey] = {
        'x': x,
        'y': y,
        'left': tind,
        'value': parent,
        'rule': 2,
        'as': 'parent'
      };

      x += tw(parent) + tind*2;

      Object.defineProperty(nodes[parentKey], 'right', {
        configurable: true,
        get: function() { return right.call(this); }
      });
    }

    nodes[childKey] = {
      'y': y,
      'left': tind,
      'value': child,
      'rule': 2,
      'as': 'child'
    };

    Object.defineProperties(nodes[childKey], {
      'x': {
        configurable: true,
        get: function() { return nodes[parentKey].right; }
      },
      'right': {
        configurable: true,
        get: function() { return right.call(this); }
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
    var parentKey = parent + '_' + (id - 1);
    var childKey = child + '_' + id;

    if (parentKey in nodes) {
      x = nodes[parentKey].left;
      y = nodes[parentKey].y;
    } else {
      nodes[parentKey] = {
        'x': x,
        'y': y,
        'left': tind,
        'value': parent,
        'rule': 3,
        'as': 'parent'
      };

      Object.defineProperty(nodes[parentKey], 'right', {
        configurable: true,
        get: function() { return right.call(this); }
      });
    }

    nodes[childKey] = {
      'left': tind,
      'value': child,
      'rule': 3,
      'as': 'child'
    };

    Object.defineProperties(nodes[childKey], {
      'x': {
        configurable: true,
        get: (function() { return nodes[parentKey].x + 30 + this; }).bind(nodes[parentKey].left)
      },
      'y': {
        get : function() { return nodes[parentKey].y + deg50(30); }
      }
    });

    x += 30; y += deg50(30);
    nodes[parentKey].left += tw(child) + 15 + th/2;
  };

  this.drawNode = function(node) {
    // __ parent __
    //             \
    //              \ child
    //               \
    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    } else {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.x - 30, node.y - deg50(30));
      graph.fillText(node.value, node.x - 15 + th/2, node.y - deg50(15)); // 15 = 30/2
    }
  };
}

function Rule4() {
  var parKeyTemp = '', childKeyTemp = '';

  this.getData = function(id, subRule, child, parent) {
    console.log('Rule4', id, subRule, child, parent);
    var parentKey = '';
    var childKey = '';

    if (subRule) { // rule_4_1
      parentKey = parent + '_pre_' + (id - 1);
      childKey = child + '_' + id;

      if (parentKey in nodes) {
        x = nodes[parentKey].x;
        y = nodes[parentKey].y;
      } else {
        nodes[parentKey] = {
          'x': x,
          'y': y,
          'left': tind,
          'value': parent,
          'rule': 4,
          'subRule': 1,
          'as': 'parent'
        };
      }

      nodes[childKey] = {
        'y': y += deg50(dlh4),
        'left': tind,
        'value': child,
        'rule': 4,
        'subRule': 1,
        'as': 'child'
      };

      x += dlh4

      Object.defineProperties(nodes[childKey], {
        'x': {
          configurable: true,
          get: function() { return nodes[parentKey].x + dlh4; }
        },
        'right': {
          configurable: true,
          get: function() { return right.call(this); }
        }
      });

      if (childKeyTemp == parentKey) {
        nodes[parKeyTemp].left += tw(child);
      }

      parKeyTemp = childKeyTemp = '';
    } else { // rule_4_0
      parentKey = parent + '_' + (id - 1);
      childKey = child + '_pre_' + id;

      if (parentKey in nodes) {
        x = nodes[parentKey].left;
        y = nodes[parentKey].y;
      } else {
        nodes[parentKey] = {
          'x': x,
          'y': y,
          'left': tind,
          'value': parent,
          'rule': 4,
          'subRule': 0,
          'as': 'parent'
        };

        Object.defineProperty(nodes[parentKey], 'right', {
          configurable: true,
          get: function() { return right.call(this); }
        });
      }

      nodes[childKey] = {
        'y': y,
        'left': tind,
        'value': child,
        'rule': 4,
        'subRule': 0,
        'as': 'child'
      };

      Object.defineProperty(nodes[childKey], 'x', {
        configurable: true,
        get: (function() { return nodes[parentKey].x + this; }).bind(nodes[parentKey].left)
      });

      nodes[parentKey].left += Math.max(dlh4/2 + th/2 + tw(child), dlh4 + tind);
      parKeyTemp = parentKey;
      childKeyTemp = childKey;
      x += dlh4;
      y += deg50(dlh4);
    }
  };

  this.drawNode = function(node) {
    var xt = node.x; yt = node.y;
    if (node.subRule) { // rule_4_1
      // ____________
      //             \
      //              \ parent
      //               \__ child __
      if (node.as == 'parent') {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += dlh4, yt += deg50(dlh4));
        graph.fillText(node.value, xt - dlh4/2 + th/2, yt - deg50(dlh4/2));
      } else {
        graph.moveTo(xt, yt);
        graph.lineTo(xt + tw(node.value) + tind*2, yt);
        graph.fillText(node.value, xt + tind, yt - tpb);
      }
    } else { // rule_4_0
      // __ parent __
      //             \
      //              \ child
      //               \__
      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.right, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
      } else {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += dlh4, yt += deg50(dlh4));
        graph.lineTo(xt + tind, yt);
        graph.fillText(node.value, xt - dlh4/2 + th/2, yt - deg50(dlh4/2));
      }
    }
  };
}

function Rule6() {
  var union = '';
  var lh = 25, lw = tind*2;

  this.getData = function(id, subRule, child, parent) {
    console.log('Rule6', id, subRule, child, parent);
    var parentKey = parent + '_' + (id - 1);
    var childKey = child + '_' + id;

    if (subRule) { // rule_6_1
      //     ___ child ___
      //    /|            \
      // __/ |             \__
      //   \ |             /
      //    \|__ parent __/
      var mLen = Math.max(tw(union), tw(child), tw(parent));
      lw += mLen;

      if (parentKey in nodes) {
        x = nodes[parentKey].x;
        y = nodes[parentKey].y;
      } else {
        x += lh + tind;
        y += deg50(lh);

        nodes[parentKey] = {
          'x': x,
          'y': y,
          'left': tind,
          'right': x + lw,
          'value': parent,
          'rule': 6,
          'subRule': 1,
          'as': 'parent'
        };
      }

      y -= deg50(lh*2);

      nodes[childKey] = {
        'x': x,
        'y': y,
        'left': tind,
        'value': child,
        'rule': 6,
        'subRule': 1,
        'as': 'child'
      };

      y += deg50(lh);
      x += lw + lh + tind;

      Object.defineProperty(nodes[childKey], 'right', {
        configurable: true,
        get: function() {
          return Math.max(right.call(this), right.call(nodes[parentKey])) + tind + lh;
        }
      });

      Object.defineProperty(nodes[parentKey], 'right', {
        configurable: true,
        get: function() {
          return Math.max(right.call(this), right.call(nodes[childKey])) + tind + lh;
        }
      });
    } else { // rule_6_0
      //     _____________
      //    /|            \
      // __/ | child       \__
      //   \ |             /
      //    \|__ parent __/
      union = child;

      if (parentKey in nodes) {
        var tempX = Object.getOwnPropertyDescriptor(nodes[parentKey], 'x').get;

        nodes[parentKey + '_copy'] = copy(nodes[parentKey]);
        nodes[parentKey + '_copy'].value = '';

        if (tempX) {
          Object.defineProperty(nodes[parentKey], 'x', {
            configurable: true,
            get: function() { return tempX() + tind + lh; }
          });
        } else console.warn(parentKey, 'x is not defined');

        Object.defineProperty(nodes[parentKey], 'right', {
          configurable: true,
          get: function() { return right.call(this) + tind + lh; }
        });

        x = nodes[parentKey].x;
        y = nodes[parentKey].y += deg50(lh);
      } else {
        nodes[parentKey] = {
          'x': x += lh,
          'y': y += deg50(lh),
          'left': tind,
          'value': parent
        };

        Object.defineProperty(nodes[parentKey], 'right', {
          get: function() { return right.call(this) + tind + lh; }
        });
      }

      nodes[parentKey].rule = 6;
      nodes[parentKey].subRule = 0;
      nodes[parentKey].as = 'parent';

      nodes[childKey] = {
        'x': x,
        'y': y - deg50(lh),
        'value': child,
        'rule': 6,
        'subRule': 0,
        'as': 'child'
      };

      x += lw + tind + lh;
      y -= deg50(lh);
    }
  };

  this.drawNode = function(node) {
    var xt = node.x - lh - tind, yt = node.y - deg50(lh);

    if (node.subRule) { // rule_6_1
      //     ___ child ___
      //    /|            \
      // __/ |             \__
      //   \ |             /
      //    \|__ parent __/
      if (node.as == 'parent') {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += tind, yt);
        graph.lineTo(xt += lh, yt += deg50(lh));
        dashedLine(xt, yt, xt, yt - deg50(lh)*2);
        graph.lineTo(xt = node.right - tind - lh, yt);
        graph.fillText(node.value, node.x + tind, yt - tpb);
        graph.lineTo(xt += lh, yt -= deg50(lh));
        graph.lineTo(xt += tind, yt);
        graph.moveTo(xt -= tind, yt);
        graph.lineTo(xt -= lh, yt -= deg50(lh));
        graph.lineTo(xt = node.x, yt);
        graph.lineTo(xt -= lh, yt += deg50(lh));
      } else {
        graph.fillText(node.value, node.x + tind, node.y - tpb);
        lw = tind*2;
      }
    } else { // rule_6_0
      //     _____________
      //    /|            \
      // __/ | child       \__
      //   \ |             /
      //    \|__ parent __/
      if (node.as == 'parent') {
        graph.moveTo(xt, yt);
        graph.lineTo(xt += tind, yt);
        graph.lineTo(xt += lh, yt += deg50(lh));
        dashedLine(xt, yt, xt, yt - deg50(lh)*2);
        graph.lineTo(xt = node.right - tind - lh, yt);
        graph.fillText(node.value, node.x + tind, yt - tpb);
        graph.lineTo(xt += lh, yt -= deg50(lh));
        graph.lineTo(xt += tind, yt);
        graph.moveTo(xt -= tind, yt);
        graph.lineTo(xt -= lh, yt -= deg50(lh));
        graph.lineTo(xt = node.x, yt);
        graph.lineTo(xt -= lh, yt += deg50(lh));
      } else {
        graph.fillText(node.value, node.x + tpl, node.y);
      }
    }
  };
}

function Rule7() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule7', id, subRule, child, parent);
    var parentKey = parent + '_' + (id - 1);
    var childKey = child + '_' + id;

    if (subRule) { // rule_7_1
      parentKey = parent + '_7_' + (id - 1);

      if (parentKey in nodes) {
        x = nodes[parentKey].x;
        y = nodes[parentKey].y - lh;
      } else {
        nodes[parentKey] = {
          'x': x,
          'y': y,
          'value': parent,
          'rule': 7,
          'subRule': 1,
          'as': 'parent'
        };
      }

      nodes[childKey] = {
        'x': x,
        'y': y += lh,
        'value': child,
        'rule': 7,
        'subRule': 1,
        'as': 'child'
      };
    } else { // rule_7_0
      childKey = child + '_7_' + id;

      if (parentKey in nodes) {
        x = nodes[parentKey].x;
        y = nodes[parentKey].y;
      } else {
        nodes[parentKey] = {
          'x': x,
          'y': y,
          'value': parent,
          'rule': 7,
          'subRule': 0,
          'as': 'parent'
        };
      }

      nodes[childKey] = {
        'x': x,
        'y': y += lh,
        'right': x + tw(child) + tind*2,
        'value': child,
        'rule': 7,
        'subRule': 0,
        'as': 'child'
      };
    }
  };

  this.drawNode = function(node) {
    if (node.subRule) { // rule_7_1
      // __ first sentence root: parent __
      //         |
      //         | child
      //         |

      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x + tw(node.value) + tind*2, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
        dashedLine(node.x, node.y, node.x, node.y + lh);
      } else {
        graph.moveTo(node.x, node.y);
        // graph.lineTo(node.x + tw(node.value) + tind*2, node.y);
        graph.fillText(node.value, node.x + 7, node.y - 45);
        dashedLine(node.x, node.y, node.x, node.y - lh);
      }
    } else { // rule_7_0
      // __ first sentence root: parent __
      //         |
      //         |
      //         |
      // __ second sentence root: child __

      if (node.as == 'parent') {
        graph.moveTo(node.x, node.y);
        graph.lineTo(node.x + tw(node.value) + tind*2, node.y);
        graph.fillText(node.value, node.x + tind, node.y - tpb);
        dashedLine(node.x, node.y, node.x, node.y + lh);
      } else {
        graph.moveTo(node.x, node.y);
        // graph.lineTo(node.x + tw(node.value) + tind*2, node.y);
        // текст может лакладыватся
        // graph.fillText(node.value, node.x + tind, node.y - tpb);
        dashedLine(node.x, node.y, node.x, node.y - lh);
      }
    }
  };
}

function Rule8() {
  this.getData = function(id, subRule, child, parent) {
    // __ first sentence root: parent __
    //          \
    //           \ to
    //            \__ second sentence root: child __
    console.log('Rule8', id, subRule, child, parent);
    var parentKey = parent + '_' + (id - 1);
    var childKey = child + '_' + id;

    if (parentKey in nodes) {
      x = nodes[parentKey].left;
      y = nodes[parentKey].y;
    } else {
      nodes[parentKey] = {
        'x': x,
        'y': y,
        'left': tind,
        'value': parent,
        'rule': 8,
        'as': 'parent'
      };

      Object.defineProperty(nodes[parentKey], 'right', {
        configurable: true,
        get: function() { return right.call(this); }
      });
    }

    nodes[childKey] = {
      'x': x += dlh8,
      'y': y += deg50(dlh8),
      'left': tind,
      'value': child,
      'rule': 8,
      'as': 'child'
    };

    Object.defineProperties(nodes[childKey], {
      'x': {
        configurable: true,
        get: (function() { return nodes[parentKey].x + dlh8 + this; }).bind(nodes[parentKey].left)
      },
      'right': {
        configurable: true,
        get: function() { return right.call(this); }
      }
    });

    nodes[parentKey].left += dlh8 + tw(child) + tind;
  };

  this.drawNode = function(node) {
    // __ first sentence root: parent __
    //          \
    //           \ to
    //            \__ second sentence root: child __
    if (node.as == 'parent') {
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    } else {
      var xt = node.x - dlh8;
      graph.moveTo(node.x, node.y);
      graph.lineTo(xt, node.y - deg50(dlh8));
      graph.fillText('to', xt + dlh8/2 + th/2, node.y - deg50(dlh8/2));
      graph.moveTo(node.x, node.y);
      graph.lineTo(node.right, node.y);
      graph.fillText(node.value, node.x + tind, node.y - tpb);
    }
  };
}

function Rule9() {
  this.getData = function(id, subRule, child, parent) {
    console.log('Rule9', id, subRule, child, parent);
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
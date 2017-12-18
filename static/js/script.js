function onEnter(event, callback) {
  if (event.keyCode == 13) {
    event.preventDefault();
    callback();
  }
}

var result = [];
var coords = {};

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
    result = JSON.parse(this.responseText);
    console.log(result);
    drawSentences();
  };

  xhr.open('POST', '/process', true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(body);
}

var sentence = document.getElementById('sentence');

/* нет примера для 5-го правила */
// sentence.value = "Old as Mary and you"; // [[4,0], [4,1], [6,0], [6,1]]
// sentence.value = "Hello i'm your daughter"; // [[0,0], [1,0], [2,0], [3,0]]
// sentence.value = "Ellen needs help"; // [[1,0], [1,1]]
// sentence.value = "She's not as old as Mary"; // [[1,0], [3,0], [2,0], [4,0], [4,1]]
// sentence.value = "The visitors from El Paso arrived on schedule"; // [[1,0], [3,0], [0,0], [4,1], [4,0]]
// sentence.value = "My parents saw them at a concert a long time ago"; // [[1,0], [3,0], [1,1], [4,1], [7,0], [4,0]]
// sentence.value = "Jennifer took on two paper routes to earn money for camp"; // [[1,0], [0,0], [1,1], [4,1], [8,0], [4,0]]
// sentence.value = "The house looks tidy and good, but the yard is a mess and a bad"; // [[1,0], [3,0], [2,0], [6,1], [6,0], [0,0], [10,0], [10,1]]

// [[3,0], [7,0], [1,0], [2,0], [6,0], [6,1], [0,0], [4,0], [4,1]]
// sentence.value = "A long time ago the house looked neat and nice, like a new one, but eventually became obsolete";

// sentence.value = "Tom stopped to take a close look at the car"; // [[1,0], [9,1], [11,0], [1,1], [3,0], [4,0], [4,1]]
sentence.value = "The guy must pass several trials to see and to take his bride away"; // [[1,0], [3,0], [1,1], [8,0], [6,0], [6,1]]

// надо рассмотреть
// sentence.value = "The fighter seems out of shape"; // [[1,0], [3,0], [4,0], [4,1]]
// sentence.value = "To know him is to love him"; // [[9,0], [9,1], [11,0], [1,0], [1,1]]
// sentence.value = "John, Mary and Sam were there"; // [[1,0], [0,0], [6,1], [6,0], [3,0]]
// sentence.value = "You choose a color that you like"; // [[1,0], [1,1], [3,0], [9,1]]
// sentence.value = "The people who live on this street seem pleasant"; // [[1,0], [3,0], [7,0], [4,0], [4,1], [0,0]]
// sentence.value = "We enjoy talking"; // [[1,0], [11,0]]
// sentence.value = "My brother and I are getting together for dinner"; // [[1,0], [3,0], [6,0], [6,1], [11,0], [4,0], [4,1]]
// sentence.value = "He left early because he felt sick"; // [[1,0], [3,0], [7,0], [7,1], [2,0]]
// sentence.value = "We are campers tired but happy"; // [[1,0], [2,0], [3,0], [6,0], [6,1]]
// sentence.value = "He can and should finish the job"; // [[1,0], [11,0], [6,0], [1,1], [3,0]]
// sentence.value = "Everyone wondered when would end the play"; // [[1,0], [1,1], [7,0], [3,0], [11,0]]
// sentence.value = "The students worked so very hard"; // [[1,0], [3,0], [3,0], [3,0], [3,0]]


var scale = document.getElementById('range');
var canvas = document.getElementById('draw');
var graph = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
var xs = 10, ys = 70; // center
var x = xs, y = ys;
var th = 16; // text height - (font-size in px)
var tpb = 7; // text padding bottom
var tpl = 3; // text padding left
var tInd = 20; // text indent
var rule6Union = ''; // союз 6-го правила
var rule4Prepos = ''; // объект предлога 4-го правила
var prevNode = {};

prevNode['rule'] = [];

// return text width
function tw(str) { return graph.measureText(str).width; }

function deg50(x) { return x + x/2; }

// пунктирные линии
function dashedLine(x1, y, x2, y2) {
  var opt = [10, 10];

  graph.stroke();
  graph.beginPath();
  graph.moveTo(x1, y);
  graph.setLineDash(opt);
  graph.lineTo(x2, y2);
  graph.stroke();
  graph.beginPath();
  graph.setLineDash([]);
  graph.moveTo(x2, y2);
}

graph.font = th + 'px Play';
graph.strokeStyle = '#000';
graph.lineWidth = 1;

function drawNode(node) {
  if ('rule' in node) {
    if (prevNode.rule[0] == 6 && prevNode.rule[1] == 0 && prevNode.rule[0] != node.rule[0]) {
      console.log('нарисовано вручную');
      rule6Draw(prevNode.id, 1, '', prevNode.parentValue, prevNode.hasChild);
    }

    rules[node.rule[0]](node.id, node.rule[1], node.value, node.parentValue, node.childs.length != 0);

    prevNode = {
      'id': node.id,
      'rule': node.rule,
      'parentValue': node.parentValue,
      'hasChild': node.childs.length != 0,
    };
  }

  for (var i = 0; i < node.childs.length; i++) {
    drawNode(node.childs[i]);
  }
}

function drawSentences() {
  if (!result.length) return;
  
  graph.save();
  graph.clearRect(0, 0, w, h);
  graph.scale(scale.value, scale.value);
  graph.beginPath();
  x = xs; y = ys;
  graph.moveTo(x, y);
  coords = {};

  for (var i = 0; i < result.length; i++) {
    drawNode(result[i]);
  }

  graph.stroke();
  graph.restore();
}

var rules = [ruleDefault, rule1Draw, rule2Draw, rule3Draw, rule4Draw, rule5Draw, rule6Draw, rule7Draw, rule8Draw, rule9Draw, rule10Draw, ruleMerge];

function ruleDefault(id, subRule, child, parent, hasChild) {
  console.log('rule0Default:', id, subRule, child, parent, hasChild);
  if (subRule) { // subRule == 1
  } else { // subRule == 0
  }
}

function rule1Draw(id, subRule, child, parent, hasChild) {
  console.log('rule1Draw:', id, subRule, child, parent, hasChild);
  var parentKey = parent + '_' + (id - 1);
  var childKey = child + '_' + id;

  if (subRule) { // subRule == 1
    // __ parent __|__ child __
    if (parentKey in coords) {
      x = coords[parentKey].x + tw(parent) + tInd;
      y = coords[parentKey].y;
    } else {
      graph.fillText(parent, x + tInd, y - tpb);
      coords[parentKey] = {
        'x': x + tInd,
        'y': y,
        'as': 'parent'
      };
      graph.lineTo(x += tInd*2 + tw(parent), y);
    }

    graph.moveTo(x, y - 25);
    graph.lineTo(x, y);
    graph.fillText(child, x + tInd, y - tpb);
    coords[childKey] = {
      'x': x + tInd,
      'y': y,
      'as': 'child'
    };
    graph.lineTo(x += tInd*2 + tw(child), y);
  } else { // subRule == 0
    // __ child __|__ parent __
    //            |
    if (parentKey in coords) {
      x = coords[parentKey].x - tInd*3 - tw(child);
      y = coords[parentKey].y;
      graph.moveTo(x, y);
    }

    graph.fillText(child, x + tInd, y - tpb);
    coords[childKey] = {
      'x': x + tInd,
      'y': y,
      'as': 'child'
    };
    graph.lineTo(x += tInd*2 + tw(child), y);
    graph.moveTo(x, y + 25);
    graph.lineTo(x, y - 25);
    graph.moveTo(x, y);

    if (!(parentKey in coords)) {
      graph.fillText(parent, x + tInd, y - tpb);
      coords[parentKey] = {
        'x': x + tInd,
        'y': y,
        'as': 'parent'
      };
      graph.lineTo(x += tInd*2 + tw(parent), y);
    }
  }
}

function rule2Draw(id, subRule, child, parent, hasChild) {
  // subRule не используется
  // ___ parent ___\___ child ____
  console.log('rule2Draw:', id, subRule, child, parent, hasChild);
  var parentKey = parent + '_' + (id - 1);
  var childKey = child + '_' + id;

  if (parentKey in coords) {
    x = coords[parentKey].x + tw(parent) + tInd;
    y = coords[parentKey].y;
  } else {
    graph.fillText(parent, x + tInd, y - tpb);
    coords[parentKey] = {
      'x': x + tInd,
      'y': y,
      'as': 'parent'
    };
    graph.lineTo(x += tInd*2 + tw(parent) + 10, y);
  }

  graph.moveTo(x - 16, y - deg50(16));
  graph.lineTo(x, y);
  graph.fillText(child, x + tInd, y - tpb);
  coords[childKey] = {
    'x': x + tInd,
    'y': y,
    'as': 'child'
  };
  graph.lineTo(x += tInd*2 + tw(child), y);
}

function rule3Draw(id, subRule, child, parent, hasChild) {
  // subRule не используется
  // __ parent __
  //             \
  //              \ child
  //               \
  console.log('rule3Draw:', id, subRule, child, parent, hasChild);
  var parentKey = parent + '_' + (id - 1);
  var childKey = child + '_' + id;
  var xt = 0;

  if (parentKey in coords) {
    x = coords[parentKey].x;
    y = coords[parentKey].y;
  } else {
    graph.fillText(parent, x + tInd, y - tpb);
    coords[parentKey] = {
      'x': x + tInd,
      'y': y,
      'as': 'parent'
    };
    graph.lineTo((x += tInd) + tw(parent) + tInd, y);
  }
  
  graph.moveTo(x, y);
  graph.lineTo(x += 30, y += deg50(30));
  xt = x - 15 + th/2;
  coords[parentKey]['right'] = Math.max(x, xt);
  graph.fillText(child, xt, y - deg50(15)); // 15 = 30/2
  coords[childKey] = {
    'x': x,
    'y': y,
    'as': 'child'
  };
}

function rule4Draw(id, subRule, child, parent, hasChild) {
  console.log('rule4Draw:', id, subRule, child, parent, hasChild);

  if (subRule) { // subRule == 1
    // __________
    //           \
    //            \ parent
    //             \__ child __
    var parentKey = rule4Prepos + '_' + (id - 2);
    var childKey = child + '_' + id;

    if (parentKey in coords) {
      x = coords[parentKey].x;
      y = coords[parentKey].y;
      graph.moveTo(x, y);
    } else {
      graph.fillText(rule4Prepos, x + tInd, y - tpb);
      coords[parentKey] = {
        'x': x + tInd,
        'y': y,
        'as': 'parent'
      };
      graph.lineTo(x += tInd + tw(rule4Prepos) + tInd, y);
    }

    graph.lineTo(x += 40, y += deg50(40));
    graph.fillText(parent, x - 20 + th/2, y - deg50(20)); // 20 = 40/2
    graph.fillText(child, x + tInd, y - tpb);
    coords[childKey] = {
      'x': x + tInd,
      'y': y,
      'as': 'child'
    };
    graph.lineTo(x += tInd + tw(child) + tInd, y);
    rule4Prepos = '';
  } else { // subRule == 0
    // __ parent __
    //             \
    //              \ child
    //               \________
    rule4Prepos = parent;
  }
}

function rule5Draw(id, subRule, child, parent, hasChild) {
  console.log('rule5Draw:', id, subRule, child, parent, hasChild);
  // subRule не используется
  // __ parent __
  //             \
  //              \
  //               \__ child __
  graph.fillText(parent, x + tInd, y - tpb);
  graph.lineTo(x += tInd + tw(parent) + tInd, y);
  graph.lineTo(x += 30, y += deg50(30));
  graph.fillText(child, x + tInd, y - tpb);
  graph.lineTo(x += tInd + tw(child) + tInd, y);
}

function rule6Draw(id, subRule, child, parent, hasChild) {
  console.log('rule6Draw:', id, subRule, child, parent, hasChild);
  var parentKey = parent + '_' + (id - 1);

  if (subRule) { // subRule == 1
    // дописываем child к подправилу subRule == 0
    //    ___ child ____
    //   /              |\
    // _/    rule6Union | \_
    //  \               | /
    //   \___ parent ___|/
    var mLen = Math.max(tw(rule6Union), tw(child), tw(parent));
    var lw = tInd + mLen + tInd, xt = 0, yt = 0, lh = 25;

    var childKey = child + '_' + id;

    if (parentKey in coords) {
      x = coords[parentKey].x;
      y = coords[parentKey].y;
      graph.moveTo(x, y);
    }

    graph.lineTo(x += 10, y);
    graph.lineTo(x += lh, y -= deg50(lh));

    graph.textAlign = 'center';
    graph.fillText(child, x + lw/2, y - tpb);
    coords[childKey] = {
      'x': x + tInd,
      'y': y,
      'as': 'child'
    };
    graph.lineTo(x += lw, y);

    xt = x;
    yt = y += deg50(lh);
    graph.lineTo(x += lh, y);
    graph.lineTo(xt, yt += deg50(lh));
    
    dashedLine(xt, yt, xt, yt - deg50(lh)*2);

    graph.moveTo(xt, yt);
    graph.lineTo(xt -= lw, yt);
    graph.fillText(parent, xt + lw/2, yt - tpb);
    graph.lineTo(xt - lh, yt - deg50(lh));

    graph.textAlign = 'right';
    graph.fillText(rule6Union, x - lh - tpb, y);
    graph.textAlign = 'start'; // ставим выравнивание по-умолчанию
    rule6Union = '';
    graph.moveTo(x, y);
    graph.lineTo(x += 10, y);
  } else { // subRule == 0
    // запоминаем союз для subRule == 1
    // нужна проверка на существование 1-го подправила
    rule6Union = child;
  }
}

function rule7Draw(id, subRule, child, parent, hasChild, noLog) {
  if (!noLog) console.log('rule7Draw:', id, subRule, child, parent, hasChild);

  if (subRule) { // subRule == 1
    // __ first sentence root: parent __
    //         |
    //         | child
    //         |
    graph.fillText(child, x + tpl, y - 55); // 55 = 110/2
    graph.moveTo(x, y);
  } else { // subRule == 0
    // __ first sentence root: parent __
    //         |
    //         |
    //         |
    //  __ second sentence root: child __
    var parentKey = parent + '_' + (id - 1);

    if (parentKey in coords) {
      x = coords[parentKey].x;
      y = coords[parentKey].y;
      graph.moveTo(x, y);
    }

    dashedLine(x, y, x, y += 110);
    graph.moveTo(x, y);
  }
}

function rule8Draw(id, subRule, child, parent, hasChild) {
  console.log('rule8Draw:', id, subRule, child, parent, hasChild);
  // subRule не используется
  // __ first sentence root: parent __
  //          \
  //           \ to
  //            \__ second sentence root: child __
  var parentKey = parent + '_' + (id - 1);

  if (parentKey in coords) {
    x = coords[parentKey].x;
    y = coords[parentKey].y;
    graph.moveTo(x, y);
  }

  graph.lineTo(x += 50, y += deg50(50));
  graph.fillText('to', x - 25 + th/2, y - deg50(25)); // 25 = 50/2
}

function rule9Draw(id, subRule, child, parent, hasChild) {
  console.log('rule9Draw:', id, subRule, child, parent, hasChild);
  var first = 'first sentence root: ' + parent;
  var second = 'second sentence root: ' + child;
  var xt = 0, yt = 0;

  if (subRule) { // subRule == 1
    //            _first_sentence_root:_child_
    //                                   |
    //                                   |
    //                                   |
    // __|_second_sentence_root:_root_\_/\
    graph.fillText(first, x + tInd, y - tpb);
    graph.lineTo(tInd + (x += tInd + tw(first)), y);

    graph.moveTo(x -= 20, y);
    graph.lineTo(x, y += 40);

    graph.lineTo(xt = x - 10, yt = y + deg50(10));
    graph.lineTo(xt -= 15, yt);
    graph.lineTo(xt - 10, yt - deg50(10));
    graph.moveTo(xt, yt);
    
    graph.lineTo(xt -= tInd + tw(second) + tInd, yt);
    graph.fillText(second, xt + tInd, yt - tpb);
    graph.lineTo(xt, yt - deg50(10));
    graph.moveTo(xt, yt);
    graph.lineTo(xt - 15, yt);
    
    graph.moveTo(x, y);
    graph.lineTo(x += 10, y += deg50(10));
  } else { // subRule == 0
    //     _first_sentence_root:_child_
    //           |
    //           |
    //           |
    // _________/\______|_second_sentence_root:_root_
    var fc = tInd + tw(first) + tInd;

    graph.fillText(first, x + tInd, y - tpb);
    graph.lineTo(x + fc, y);

    graph.moveTo(x += fc/2, y);
    graph.lineTo(x, y += 40);

    graph.lineTo(xt = x - 10, yt = y + deg50(10));
    graph.lineTo(xt - (fc/2 - 10), yt);
    graph.moveTo(x, y);

    graph.lineTo(x += 10 , y += deg50(10));
    graph.lineTo(x += 40 , y);
    graph.lineTo(x, y - deg50(10));
    graph.moveTo(x, y);
    graph.fillText(second, x + tInd, y - tpb);
    graph.lineTo(x += tInd + tw(second) + tInd, y);
  }
}

function rule10Draw(id, subRule, child, parent, hasChild) {
  console.log('rule10Draw:', id, subRule, child, parent, hasChild);
  if (subRule) { // subRule == 1
    // __first_sentence_root:_root__
    //         |
    //         |child
    //         |
    rules[7](id, subRule, child, parent, hasChild, true);
  } else { // subRule == 0
    // __first_sentence_root:_root__
    //         |
    //         |
    //         |
    // ___second_sentence_root:_child__
    rules[7](id, subRule, child, parent, hasChild, true);
  }
}

function ruleMerge(id, subRule, child, parent, hasChild) {
  console.log('rule11Merge:', id, subRule, child, parent, hasChild);
  if (subRule) { // subRule == 1
  } else { // subRule == 0
  }
}
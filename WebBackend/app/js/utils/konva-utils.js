var basics = require('./basics.js');
var exists = basics.exists;

var setNodeState = function(node, state) {
  node.visible(state);
  node.listening(state);
}

var enableNode = function(node) {
  return setNodeState(node, true);
}

var disableNode = function(node) {
  return setNodeState(node, false);
}

var isNodeEnabled = function(node) {
  return node.visible() && node.listening();
}

var isNodeDisabled = function(node) {
  return !isNodeEnabled(node);
}

var toggleNodeState = function(node) {
  if (isNodeEnabled(node)) {
    disableNode(node);
  } else {
    enableNode(node);
  }
}

var countChildrenNode = function(node, nb) {
  if (!(node instanceof Konva.Node)) {
    return 0;
  } else if (!node.hasChildren()) {
    return 1;
  }

  if (!exists(nb)) {
    nb = 0;
  }

  var children = node.getChildren();
  var nbChildren = children.length;
  var nbChildrenNodes = 0;
  for (var i = 0; i < nbChildren; i++) {
    var child = children[i];
    nbChildrenNodes += countChildrenNode(child, nb);
  }

  return nb + nbChildrenNodes;
}

module.exports.setNodeState = setNodeState;
module.exports.enableNode = enableNode;
module.exports.disableNode = disableNode;
module.exports.isNodeEnabled = isNodeEnabled;
module.exports.isNodeDisabled = isNodeDisabled;
module.exports.toggleNodeState = toggleNodeState;
module.exports.countChildrenNode = countChildrenNode;
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

module.exports.setNodeState = setNodeState;
module.exports.enableNode = enableNode;
module.exports.disableNode = disableNode;
module.exports.isNodeEnabled = isNodeEnabled;
module.exports.isNodeDisabled = isNodeDisabled;
module.exports.toggleNodeState = toggleNodeState;
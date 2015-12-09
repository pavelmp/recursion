// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className){
  function drillDown(classNeeded,currentNode,accumulator){
    if(currentNode.nodeType === 1){
	  if(currentNode.classList.contains(classNeeded)){
		accumulator.push(currentNode);
	  }
	  for(var child in currentNode.childNodes){
		drillDown(classNeeded,currentNode.childNodes[child],accumulator);
	  }
	}
  };

  var result = [];
  drillDown(className,document.body,result);
  return result;
};

// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  var result = '';
  
  if(obj == null || typeof obj === 'number' || typeof obj === 'boolean'){result += '' + obj + '';}
  else if(typeof obj === 'string'){result += '"' + obj + '"';}
  else if(obj.constructor === Object){
  	result += '{';
  	Object.keys(obj).forEach(function(key,i,a){
  	  if(typeof obj[key] !== 'function' && obj[key] !== undefined){	
  		result += '"' + key + '":';
  		result += stringifyJSON(obj[key]);
  		if(i !== a.length-1){result += ','};
  	  };
  	});
  	result += '}';
  } else if(Array.isArray(obj)){
  	result += '[';
  	obj.forEach(function(value,i,a){
  	  if(typeof value !== 'function' && value !== undefined){		
  		result+= stringifyJSON(value);
  		if(i !== a.length-1){result += ','};
  	  };
  	});
  	result += ']';
  };
  return result; 
};

// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:


// The code is copied from O'Reilly book: http://archive.oreilly.com/pub/a/javascript/excerpts/javascript-good-parts/json.html
// with some modifications and reductions

var parseJSON = function() {

  var at,     // The index of the current character
      ch,     // The current character
      escapee = {
         '"':  '"',
         '\\': '\\',
         '/':  '/',
         b:    'b',
         f:    '\f',
         n:    '\n',
         r:    '\r',
         t:    '\t'
      },
      text,

	 // Call error when something is wrong.         
  error = function () {throw SyntaxError()},

  next = function (c) {
    if (c && c !== ch) {error()};
	ch = text.charAt(at);
	at += 1;
	return ch;
  },

// Parse a number value.
  number = function () {
	 var number,
	     string = '';

	 if (ch === '-') {
	     string = '-';
	     next('-');
	 }
	 while (ch >= '0' && ch <= '9') {
	     string += ch;
	     next();
	 }
	 if (ch === '.') {
	     string += '.';
	     while (next() && ch >= '0' && ch <= '9') {
	         string += ch;
	     }
	 }
	 if (ch === 'e' || ch === 'E') {
	     string += ch;
	     next();
	     if (ch === '-' || ch === '+') {
	         string += ch;
	         next();
	     }
	     while (ch >= '0' && ch <= '9') {
	         string += ch;
	         next();
	     }
	 }
	 number = +string;
	 if (isNaN(number)) {error()} else {return number}
	},

// Parse a string value.
  string = function () {
	 var hex,
	     i,
	     string = '',
	     uffff;

	// When parsing for string values, we must look for " and \ characters.

	 if (ch === '"') {
	     while (next()) {
	         if (ch === '"') {
	             next();
	             return string;
	         } else if (ch === '\\') {
	             next();
	             if (ch === 'u') {
	                 uffff = 0;
	                 for (i = 0; i < 4; i += 1) {
	                     hex = parseInt(next(), 16);
	                     if (!isFinite(hex)) {
	                         break;
	                     }
	                     uffff = uffff * 16 + hex;
	                 }
	                 string += String.fromCharCode(uffff);
	             } else if (typeof escapee[ch] === 'string') {
	                 string += escapee[ch];
	             } else {
	                 break;
	             }
	         } else {
	             string += ch;
	         }
	     }
	 }
	 error("Bad string");
	},

// Skip whitespace.
  white = function () {
     while (ch && ch <= ' '){next();}
  },

  word = function () {

	 switch (ch) {
		 case 't':
		     next('t');
		     next('r');
		     next('u');
		     next('e');
		     return true;
		 case 'f':
		     next('f');
		     next('a');
		     next('l');
		     next('s');
		     next('e');
		     return false;
		 case 'n':
		     next('n');
		     next('u');
		     next('l');
		     next('l');
		     return null;
	 }
	 error("Unexpected '" + ch + "'");
 },

  value,  // Place holder for the value function.

// Parse an array value.
  array = function () {

	 var array = [];

	 if (ch === '[') {
	     next('[');
	     white();
	     if (ch === ']') {
	         next(']');
	         return array;   // empty array
	     }
	     while (ch) {
	         array.push(value());
	         white();
	         if (ch === ']') {
	             next(']');
	             return array;
	         }
	         next(',');
	         white();
	     }
	 }
	 error("Bad array");
  },

// Parse an object value.
  object = function () {

	 var key,
	     object = {};

	 if (ch === '{') {
	     next('{');
	     white();
	     if (ch === '}') {
	         next('}');
	         return object;   // empty object
	     }
	     while (ch) {
	         key = string();
	         white();
	         next(':');
	         object[key] = value();
	         white();
	         if (ch === '}') {
	             next('}');
	             return object;
	         }
	         next(',');
	         white();
	     }
	 }
	 error("Bad object");
	};


// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.  
  value = function () {

     white();
     switch (ch) {
     case '{':
         return object();
     case '[':
         return array();
     case '"':
         return string();
     case '-':
         return number();
     default:
         return ch >= '0' && ch <= '9' ? number() : word();
     }
  };

// Return the parseJSON function. It will have access to all of the above
// functions and variables.

     return function (source) {
         var result;
         text = source;
         at = 0;
         ch = ' ';
         result = value();
         white();
         if(ch) {error("Syntax error")}
         return result;
     };
}();

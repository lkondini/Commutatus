
//setstyles function is common and used by all functions in scripts.js
function setStyles(element, styles) {
	for (var key in styles) {
		element.style[key] = styles[key];
	}
}


function addOnScrollListener(listener) {
	// todo: trottle callback execution for 100ms or so
	window.addEventListener('scroll', listener);
}
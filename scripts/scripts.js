// window.onscroll = function(){func()};




var headerNav = document.getElementsByClassName('header-inner')[0];
var navObj = document.getElementById('main-nav');
var sideBarObj = document.getElementById('main-aside');
var zone = document.getElementById('article');

//returns the element by passing id 
function getElementById(id){
	var element = document.getElementById(id);
	return element;
}

//returns the element by passing classname 
function getElementByClass(className){
	var element = document.getElementsByClassName(className);
	return element;
}

/**
 * Scroll manager manages scrolling and positioning of floating objects
 * floatingObj - element which gets fixed and floats in page
 * zone - container in which floatingObj has permission to float
 */
class ScrollManager {

	constructor(floatingObj, zone, corrections) {
		this.floatingObj = floatingObj;
		this.zone = zone;
		this.onScroll = this.onScroll.bind(this);
		this.onResize = this.onResize.bind(this);
		this.corrections = Object.assign({
			baselineTop: 0,
		}, corrections);
		this.attachListeners();
	}
	//listener
	attachListeners() {
		addOnScrollListener(this.onScroll);
		window.addEventListener("resize", this.onResize);
		if (window.outerWidth < 1100) this.onResize();
	}

	reset() {
		setStyles(this.floatingObj,{
			position: 'relative',
			top: 0,
			left: 'auto',
		});
	}

	getZoneTop() {
		var zoneTop = this.zone.offsetTop;
		return zoneTop;
	}

	getZoneBottom() {
		var zoneBottom = this.getZoneTop() + this.zone.offsetHeight;
		return zoneBottom;
	}

	getFloatingObjHeight() {
		var floatObjHeight = this.floatingObj.offsetHeight;
		return floatObjHeight;
	}


	getFloatingObjBottom(){
		var floatObjBottom = window.scrollY + this.getFloatingObjHeight();
		return floatObjBottom;
	}

	heightToSet(){
		var top = window.scrollY - this.getZoneTop();
		return top;
	}

	onResize() {
		if(window.outerWidth > 1100){
			this.disabled = false;
		} else {
			this.disabled = true;
			this.reset();
		}
	}

	onScroll() {
		if (this.disabled) return;
		var parentTop = this.getZoneTop();
		var parentBottom = this.getZoneBottom();
		var floatObjBottom = this.getFloatingObjBottom();
		var setTop = this.heightToSet() + this.corrections.baselineTop;
		if(window.scrollY + this.corrections.baselineTop >= parentTop){
			if(floatObjBottom >= parentBottom){
				if (this.isPositionFixed) {
					setStyles(this.floatingObj,{
						position: 'absolute',
						top: setTop + 'px',
						left: this.floatingObj.offsetLeft > 0 ? this.floatingObj.offsetLeft - this.floatingObj.parentNode.parentNode.offsetLeft + 'px' : 0,
					});
					this.isPositionFixed = false;
				}
			} 
			else {
				if (!this.isPositionFixed) {
					const coords = this.floatingObj.getBoundingClientRect();
					setStyles(this.floatingObj,{
						position: 'fixed',
						top: this.corrections.baselineTop + 'px',
						left: coords.left + 'px',
					});
					this.isPositionFixed = true;
				}
			}
		}
		else if(window.scrollY <= parentTop){
			if (this.isPositionFixed) {
				setStyles(this.floatingObj,{
					position: 'absolute',
					top: 0,
					right: 'auto',
					left: this.floatingObj.offsetLeft - this.floatingObj.parentNode.parentNode.offsetLeft + 'px',
				});
				this.isPositionFixed = false;
			}
		}
	}
}


//Nav instance for the scroll manager class  
var navBarScrollManager = new ScrollManager(navObj, zone, { baselineTop: headerNav.offsetHeight});
//SideBar instance for the scroll manager class 
var sideBarScrollManager = new ScrollManager(sideBarObj, zone, { baselineTop: headerNav.offsetHeight });

var index = 0;

//function manges the sliding operations to view divs in the footer section 
function slide(increment){
	var previousIndex = index;
	var rightArrow = getElementByClass('arrow-right')[0];
	var leftArrow = getElementByClass('arrow-left')[0];
	var parent = getElementByClass('alpha-inner-container')[0];
	var ancestor = getElementByClass('alpha-outer-container')[0];  
	index+=increment;
	leftToApply = (ancestor.offsetWidth * (increment > 0 ? Math.abs(index) : index)) * (previousIndex - index);
	
	if(Math.abs(leftToApply) + ancestor.offsetWidth >= parent.offsetWidth){
		setStyles(parent,{
			left: (ancestor.offsetWidth - parent.offsetWidth) + 'px',
		});
		rightArrow.classList.add('disable');
	}
	else {
		setStyles(parent, {
			left: leftToApply + 'px',
		});
		rightArrow.classList.remove('disable');
		leftArrow.classList.remove('disable');
		if(index === 0){
			leftArrow.classList.add('disable');
		}
	}
}

addOnScrollListener(changeBackground);

//function adds background to navbar while scrolling
function changeBackground(){
	var header = getElementByClass('header-inner')[0];
	if(window.scrollY >= 10){
		header.classList.add('add-background');
	}
	else{
		if(window.scrollY < 10){
			header.classList.remove('add-background');
		}
	}
}

//function moves to the section you have clicked in the navigation bar [overview, prerequistes, VAndL, testimonials]
function scrollToSecton(sectionid){
	var headerNavHeight = headerNav.offsetHeight;
	var navHeight =  navObj.offsetHeight;
	var section = getElementById(sectionid);
	const coords = section.getBoundingClientRect();
	var sectionTop = coords.top;
	console.log(sectionTop + window.scrollY,navHeight,headerNavHeight)
	window.scrollTo(0, sectionTop + window.scrollY - navHeight - headerNavHeight - 10);
	navBarScrollManager.onScroll();
	sideBarScrollManager.onScroll();
}

// P5 STUFF

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {	
	var bg = map(alpha, 0, 359, 0, 255);
	background(bg);

}


// declare orientation and motion variables
var alpha, beta, gamma;
var xmo, ymo, zmo;

// other javascript down here
// runs after page has loaded
function init(){
//// Orientation


// function for orientation
function handleOrientation(event){
	alpha = Math.floor(event.alpha);
	beta = Math.floor(event.beta);
	gamma = Math.floor(event.gamma);

	// socket 
	socket.emit('orientation', {
		'alpha': alpha,
		'beta': beta,
		'gamma':gamma
	});

	// send values to DOM so we can see what they are - attached to <span id=names>
	document.getElementById('alpha').innerHTML = alpha;
	document.getElementById('beta').innerHTML = beta;
	document.getElementById('gamma').innerHTML = gamma;
}

// event listener for orientation (built into js)
window.addEventListener('deviceorientation', handleOrientation, true)

//// Motion
function deviceMotion(event){
	var acc = event.acceleration;  // retuns an acceleration object
	xmo = acc.x; // optionally Math.abs(acc.x);
	ymo = acc.y;
	zmo = acc.z;

	// send up to DOM
	document.getElementById('xmo').innerHTML = xmo;
	document.getElementById('ymo').innerHTML = ymo;
	document.getElementById('zmo').innerHTML = zmo;
}

window.addEventListener('deviceMotion', deviceMotion, true);

}

// call init after the rest of the page has loaded
window.addEventListener('load', init);
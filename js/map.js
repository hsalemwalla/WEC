var mapText;
var requestText;

function parseFiles() {
    //var mapInput = document.getElementById("InputMapFile");
    var mapFile = document.getElementById("InputMapFile").files;
    var requestFile = document.getElementById("InputRequestFile").files;

    //if (!mapFile || !mapFile[0] || !requestFile || !requestFile[0]) {
        //// Something isn't right
        //return;
    //}
    
    var mapReader = new FileReader();
    var requestReader = new FileReader();

    mapReader.onload = function(e) {
      var mapText = mapReader.result;
      console.log(mapText);
    }
    requestReader.onload = function(e) {
      var requestText = requestReader.result;
      console.log(requestText);
    }

    mapReader.readAsText(mapFile[0]);
    requestReader.readAsText(requestFile[0]);
}

/* 2D array representation of the map
 * To access a given cell, use m[y][x] or m.byXY(x, y)
 * 
 * Properties:
 * 	m.size: (int) size of the map (lenght of one side)
 */
var m = [];
var M_INPUT_TRANSFORM = {'X': 0, 'H': 1, ' ': 1};

/* Parse input string and puts map into m; ignores any invalid characters.
 * Returns m if import successful (input has correct dimensions)
 * Returns false otherwise
 */
var m_import = function (input) {

	// Get lines out of the file
	var lines = input.replace('\r', '').split('\n');

	// Turn the lines into an array of M_WALL and M_STREET
	var map = [], size = lines.length;
	for (var i = 0; i < size; ++i) {

		var line = lines[i];
		map[i] = [];
		
		for (var j = 0; j < size; ++j) {
			var character = line[j];
			if (M_INPUT_TRANSFORM[character] !== undefined) {
				map[i].push(M_INPUT_TRANSFORM[character]);
			} else {
				console.error("m_import: Invalid character at (line ", i, ", col ", j, ") of input: ", character);
			}
		}

		if (map[i].length != size) {
			console.error("m_import: Map not square (stopped at line ", i, ")");
			return false;
		}
	}

	m = map;
	_m_init(m);
	m.size = size;

	return m;
};

/* Prints the map in the console */
var m_print = function () {
	var str = '';
	m.forEach(function (map_line) {
		str += map_line.join('') + '\n';
	});
	console.log(str);
};


/* PRIVATE! (DO NOT USE in other files than request.js)
 * Initialize map properties
 */
(window._m_init = function (m) {

	if (!m) m = [];
	
	// Define m.size = null
	if (!m.hasOwnProperty('size')) {
		Object.defineProperty(m, 'size', {enumerable: false, value: null});
	}

	// Define m.byXY(x, y): returns cell at (x, y), or null if not found
	if (!m.hasOwnProperty('byXY')) {
		Object.defineProperty(m, 'byXY', {
			enumerable: false,
			value: function (x, y) {
				var cell = m[y] && m[y][x];
				return cell !== undefined ? cell : null;
			},
		});
	}

})(m);

var mapText;
var requestText;

function parseFiles() {
    //var mapInput = document.getElementById("InputMapFile");
    var mapFile = document.getElementById("InputMapFile").files;
    var requestFile = document.getElementById("InputRequestFile").files;

    // Error checking
    //if (!mapFile || !mapFile[0] || !requestFile || !requestFile[0]) {
        //// Something isn't right
        //console.log("Map or Request file not uploaded");
        //alert("You must upload a map and request file");
        //return;
    //}
    
    var mapReader = new FileReader();
    var requestReader = new FileReader();

    mapReader.onload = function(e) {
      var mapText = mapReader.result;
      console.log(mapText);
      m_import(mapText);
      if (requestReader.result != "") {
        generate();
      }
    }
    requestReader.onload = function(e) {
      var requestText = requestReader.result;
      console.log(requestText);
      r_import(requestText);
      if (mapReader.result != "") {
        generate();
      }
    }

    mapReader.readAsText(mapFile[0]);
    requestReader.readAsText(requestFile[0]);

    
}

function generate() {
    // Let's get the map array and request and ensure they have been populated
    if (!m || !r) {
        // Not defined
        console.log("No map or requests");
        return;
    }

    beginAlg(m, r);

    // Once the algorithm has run, the output file should be ready
    // We can now simulate the ui
    draw();
}
/* This function will draw the ui to simulate the car movements */
function draw(actions) {
    var content = document.getElementById("content");
}



var STREET   = ' ';
var BUILDING = 'X';
var VISITED  = 'V';
var PICKUP   = 'P';


function beginAlg() {
    
    var numCars = cars.length;
    var pickup = r_chunk(numCars);
    var actions;

    for (var i = 0; i < cars.length; i++) {
        actions[i] = generateActions(pickup[i]);
    }

    var output = combineActions(actions);
}



function generateActions(carRequests) {
    //var tempMap = m.slice(0);
    var tempMap = m.map(function (row) {
        return row.map(function (cell) {
            if (cell) {
                return STREET;
            } else {
                return BUILDING;
            }
        });
    });
    carRequests.forEach(function (request) {
        var x, y;
        x = request.pickup.x;
        y = request.pickup.y;
        tempMap[y][x] = PICKUP;
    });

    var Hx;
    var Hy;
    // Start the car on headquarters
}

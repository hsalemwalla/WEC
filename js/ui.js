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

    window.loaded = 0;

    mapReader.onload = function(e) {
      var mapText = mapReader.result;
      // console.log(mapText);
      m_import(mapText);
      loaded++;
      if (requestReader.result != "") {
        generate();
      }
    }

    requestReader.onload = function(e) {
      var requestText = requestReader.result;
      // console.log(requestText);
      r_import(requestText);
      loaded++;
      if (mapReader.result != "") {
        generate();
      }
    }

    mapReader.readAsText(mapFile[0]);
    requestReader.readAsText(requestFile[0]);

    
}

var loaded;

function generate() {
    // Let's get the map array and request and ensure they have been populated
    if (!m || !r) {
        // Not defined
        console.log("No map or requests");
        return;
    }

    var itvl = setInterval(function () {
        if (loaded == 2) {
            beginAlg(m, r);
            clearInterval(itvl);
        }
    }, 100);

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
    
    // var numCars = cars.length;
    var numCars = 1;
    var pickup = r_chunk(numCars);
    var actions = [];

    for (var i = 0; i < numCars; i++) {
        actions[i] = generateActions(pickup[i]);
    }

    var output = combineActions(actions);
    console.log(output);

    var str = JSON.stringify(output);
    if (profit) alert('Profit: ' + profit(str));
    if (waitTime) alert('Wait time: ' + waitTime(str));
    $(function () {
        $('#output').text(str);
    });
}



// Returns an array of actions
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
    console.log('map',tempMap);
    carRequests.forEach(function (request) {
        var x, y;
        x = request.pickup.x;
        y = request.pickup.y;
        tempMap[y][x] = PICKUP;
    });

    var Hx;
    var Hy;
    // Start the car on headquarters
    var x1, y1, x2, y2, tempPoint, path = [];
    var actions = [
        {
            action: "start",
            x: hx,
            y: hy,
        },
    ];

    var pstr = function(a){return a.x+';'+a.y};
    var astr = function(a){return a.action == 'drive' ? a.action+';'+a.x+';'+a.y : a.action};
    // First trip: HQ to pickup 1
    x1 = hx;
    y1 = hy;
    x2 = carRequests[0].pickup.x;
    y2 = carRequests[0].pickup.y;
    path = pathToDest(x1, y1, x2, y2);
    console.log('path',path.map(pstr));
    // path.shift();   // Remove first in path
    actions = actions.concat(path.map(function (point) {
        // Given a point, generate action
        return {
            action: "drive",
            x: point.x,
            y: point.y,
        };
    }));
    actions = actions.concat({action: "pickup", id: carRequests[0].id});

    x1 = carRequests[0].pickup.x;
    y1 = carRequests[0].pickup.y;
    x2 = carRequests[0].dropoff.x;
    y2 = carRequests[0].dropoff.y;
    path = pathToDest(x1, y1, x2, y2);
    console.log(x1, y1, x2, y2, 'path',path.map(pstr));
    actions = actions.concat(path.map(function (point) {
        return {
            action: "drive",
            x: point.x,
            y: point.y,
        };
    }));
    actions = actions.concat({action: "dropoff", id: carRequests[0].id});

    for (var i = 1; i < carRequests.length; ++i) {
        // Last dropoff to curr pickup
        x1 = carRequests[i-1].dropoff.x;
        y1 = carRequests[i-1].dropoff.y;
        x2 = carRequests[i].pickup.x;
        y2 = carRequests[i].pickup.y;
        path = pathToDest(x1, y1, x2, y2);
        actions = actions.concat(path.map(function (point) {
            return {
                action: "drive",
                x: point.x,
                y: point.y,
            };
        }));
        actions = actions.concat({action: "pickup", id: carRequests[i].id});

        // Pickup to dropoff
        x1 = carRequests[i].pickup.x;
        y1 = carRequests[i].pickup.y;
        x2 = carRequests[i].dropoff.x;
        y2 = carRequests[i].dropoff.y;
        path = pathToDest(x1, y1, x2, y2);
        actions = actions.concat(path.map(function (point) {
            return {
                action: "drive",
                x: point.x,
                y: point.y,
            };
        }));
        actions = actions.concat({action: "dropoff", id: carRequests[i].id});
    }

    console.log('final actions for this car',actions.map(astr),actions);
    return actions;
}

function combineActions(actions) {
    console.log('combineActions', actions);
    return actions.map(function (raw_arr, i) {
        return {
            "carrierId": "car" + i,
            "actions": raw_arr,
        };
    });
}


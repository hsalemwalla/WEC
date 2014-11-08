
// I assume I've got objects

// Map constants. Subject to change.
var STREET   = ' ';
var BUILDING = 'X';
var VISITED  = 'V';
var PICKUP   = 'P';

// The map itself, which is a 2D array of characters (?).
var map = [['X','X','X','X','X','X','X','X'],
           ['X','X',' ','X','X','X',' ','X'],
           ['X',' ',' ','P',' ',' ',' ','X'],
           ['X','X',' ','X','X','X',' ','X'],
           ['X',' ',' ','X','X','X',' ','X'],
           ['X','H',' ','X','X','X','P','X'],
           ['X',' ',' ',' ',' ',' ',' ','X'],
           ['X','X','X','X','X','X','X','X']];


/**
 * Determines the coordinates of the nearest pickup location to the given x,y coordinates.
 *
 * @param  {Number} x - x-coordinate of current location.
 * @param  {Number} y - y-coordinate of current location.
 *
 * @return Anonymous object containing fields for x and y.
 */
function closestPickup (row, col) {

    var cells = [];

    //console.log(map[row][col]);

    while (map[row][col] !== PICKUP) {

        // Mark entry in map as visited.
        map[row][col] = VISITED;

        // Push adjacent streets into the queue. This assumes that visited locations have been marked
        // in some way.
        if (map[row + 1][col] === STREET || map[row + 1][col] === PICKUP)
            cells.push({'row' : row + 1, 'col' : col});
        if (map[row - 1][col] === STREET || map[row - 1][col] === PICKUP)
            cells.push({'row' : row - 1, 'col' : col});
        if (map[row][col + 1] === STREET || map[row][col + 1] === PICKUP)
            cells.push({'row' : row, 'col' : col + 1});
        if (map[row][col - 1] === STREET || map[row][col - 1] === PICKUP)
            cells.push({'row' : row, 'col' : col - 1});

        // Pop out of the queue.
        coord = cells.shift();
        row   = coord['row'];
        col   = coord['col'];
    }

    // Coordinates of the closest pickup location.
    return {'y': row, 'x': col};
}

function pathToDest (x1, y1, x2, y2) {
    var cells = [{'x' : x2, 'y' : y2, 'c' : 0}];

    for (var i = 0; i < cells.length; ++i) {

        x2 = cells[i]['x'];
        y2 = cells[i]['y'];
        var c = cells[i]['c'] + 1;

        // Path found! Return cells.
        if (x2 === x1 && y2 === y1)
            return cells;

        if (map[y2 + 1][x2] !== BUILDING) {
            checkList(x2, y2 + 1, c)
            cells.push({'x' : x2, 'y' : y2 + 1, 'c' : c});
        }
        if (map[y2 - 1][x2] !== BUILDING) {
            checkList(x2, y2 - 1, c)
            cells.push({'x' : x2, 'y' : y2 - 1, 'c' : c});
        }
        if (map[y2][x2 + 1] !== BUILDING) {
            checkList(x2 + 1, y2, c)
            cells.push({'x' : x2 + 1, 'y' : y2, 'c' : c});
        }
        if (map[y2][x2 - 1] !== BUILDING) {
            checkList(x2 - 1, y2, c)
            cells.push({'x' : x2 - 1, 'y' : y2, 'c' : c});
        }
    }

    // The shortest path. Start with the destination cell.
    var path = [cells[0]];

    for (var i = 0; i < path.length; ++i) {
        path.push(getNeighbourWithLowestCount(path[i]['x'], path[i]['y']));

    }

    function getNeighbourWithLowestCount(x, y) {
        var lowestCountNeighbourCellIndex;
        for (var i = 0; i < cells.length; ++i) {
            if (Math.abs(cells[i]['x'] - x) - Math.abs(cells[i]['y'] - y) === 1) {
                if (!lowestCountNeighbourCellIndex) {
                    lowestCountNeighbourCellIndex = i;
                } else {
                    if (cells[i]['c'] < cells[lowestCountNeighbourCellIndex]['c']) {
                        cells.remove(lowestCountNeighbourCellIndex);
                        lowestCountNeighbourCellIndex = i;
                    }
                }
            }
        }
        var lowestCell = cells[lowestCountNeighbourCellIndex];
        cells.remove(lowestCountNeighbourCellIndex);
        return lowestCell;
    }


    function checkList(x, y, c) {
        for (var i = 0; i < cells.length; ++i) {
            if (cells[i]['x'] === x && cells[i]['y'] === y && cells[i]['c'] >= c) {
                cells.splice(i, 1); // Remove cell with higher count.
                return;
            }
        }
    }

    return path;
}


var x = 1;
var y = 5;

var coord = closestPickup(y, x);
var x2 = coord['x'];
var y2 = coord['y'];

console.log(pathToDest(x, y, x2, y2));

console.log('Pickup location: ' + x2 + " " + y2);

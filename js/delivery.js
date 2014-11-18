
// I assume I've got objects

// Map constants. Subject to change.
var STREET   = ' ';
var BUILDING = 'X';
var VISITED  = 'V';
var PICKUP   = 'P';

// The map itself, which is a 2D array of characters (?).
var mapArray = [[ 'X','X','X','X','X','X','X','X'],
               [ 'X','X',' ','X','X','X',' ','X'],
               [ 'X',' ',' ','P',' ',' ',' ','X'],
               [ 'X','X',' ','X','X','X',' ','X'],
               [ 'X',' ',' ','X','X','X',' ','X'],
               [ 'X','H',' ','X','X','X','P','X'],
               [ 'X',' ',' ',' ',' ',' ',' ','X'],
               [ 'X','X','X','X','X','X','X','X']];

function updateMap(tempMap) {
    for (var i = 0; i < tempMap.length; ++i) {
        mapArray[i] = tempMap[i].slice(0);
    }
}

function copyMap() {
    var tempMap = [];
    for (var i = 0; i < mapArray.length; ++i)
        tempMap[i] = mapArray[i].slice(0);
    return tempMap;
}

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

    // Copy the map because it is going to get modified.

    var map = copyMap();

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


/**
 * Determines the shortest path between two points.
 *
 * @param  {Number} x1 - First x coord.
 * @param  {Number} y1 - First y coord.
 * @param  {Number} x2 - Second x coord.
 * @param  {Number} y2 - Second y coord.
 *
 * @return {Array} Objects with x and y properties. First object is the start point, last object is
 * the finish point. Intermediate objects define the path in between.
 */
function pathToDest (x1, y1, x2, y2, map) {

    var destX = x1;
    var destY = y1;

    var currentX = x2;
    var currentY = y2;

    var originIndex;

    var map = mapArray;

    // A list of points that are potentially part of the path.
    var cells = [{'x' : x2, 'y' : y2, 'c' : 0}];

    // Find the shortest distance to every street cell in the graph, stopping when the destination
    // cell has been reached.
    for (var i = 0; i < cells.length; ++i) {

        currentX = cells[i]['x'];
        currentY = cells[i]['y'];
        var c = cells[i]['c'] + 1;

        // Path found! We're done with this loop.
        if (currentX === x1 && currentY === y1) {
            originIndex = i;
            break;
        }

        // Examine adjacent cells to the list and add them to the path candidates if they:
        // 1. Are not a building.
        // 2. Are either not in the list or have a lower count value than the existing entry for
        //    that cell.
        if (isPathCandidate(currentX, currentY + 1, c)) {
            cells.push({'x' : currentX, 'y' : currentY + 1, 'c' : c});
            if (currentX === x1 && currentY + 1 === y1) {
                originIndex = i;
                break;
            }
        }
        if (isPathCandidate(currentX, currentY - 1, c)) {
            cells.push({'x' : currentX, 'y' : currentY - 1, 'c' : c});
            if (currentX === x1 && currentY - 1 === y1) {
                originIndex = i;
                break;
            }
        }
        if (isPathCandidate(currentX + 1, currentY, c)) {
            cells.push({'x' : currentX + 1, 'y' : currentY, 'c' : c});
            if (currentX + 1 === x1 && currentY === y1) {
                originIndex = i;
                break;
            }
        }
        if (isPathCandidate(currentX - 1, currentY, c)) {
            cells.push({'x' : currentX - 1, 'y' : currentY, 'c' : c});
            if (currentX - 1 === x1 && currentY === y1) {
                originIndex = i;
                break;
            }
        }
    }

    // The shortest path. Start with the destination cell. After it has been added to the path,
    // remove it from the list of cells.
    var path = [cells[originIndex]];
    cells.splice(originIndex, 1);

    // Eliminate cells not used in the final path.
    for (var i = 0; i < path.length; ++i) {
        var neighbour = getNeighbourWithLowestCount(path[i]['x'], path[i]['y'], destX, destY);
        path.push(neighbour);
        if (neighbour['x'] === destX && neighbour['y'] === destY)
            break;
    }


    function isPathCandidate(x, y, c) {
        return map[y][x] !== BUILDING && checkList(x, y, c);
    }


    function getNeighbourWithLowestCount(x, y, xf, yf) {
        var lowestCountNeighbourCellIndex;
        for (var i = 0; i < cells.length; ++i) {
            if (Math.abs(cells[i]['x'] - x) + Math.abs(cells[i]['y'] - y) === 1) {
                if (!lowestCountNeighbourCellIndex) {
                    lowestCountNeighbourCellIndex = i;
                } else {
                    if (cells[i]['x'] === xf && cells[i]['y'] === yf)
                        return cells[i];
                    else if (cells[i]['c'] < cells[lowestCountNeighbourCellIndex]['c']) {
                        cells.splice(lowestCountNeighbourCellIndex, 1);
                        lowestCountNeighbourCellIndex = i;
                    }
                }
            }
        }
        var lowestCell = cells[lowestCountNeighbourCellIndex];
        cells.splice(lowestCountNeighbourCellIndex, 1);
        return lowestCell;
    }


    function checkList(x, y, c) {
        for (var i = 0; i < cells.length; ++i) {
            if (cells[i]['x'] === x && cells[i]['y'] === y && cells[i]['c'] > c) {
                cells.splice(i, 1); // Remove cell with higher count.
                return true;
            } else if (cells[i]['x'] === x && cells[i]['y'] === y && cells[i]['c'] <= c) {
                return false;
            }
        }
        return true;
    }

    return path.reverse();
}

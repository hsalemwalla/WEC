var MAP_NAME = "map8_1.txt";
var size;   // Dimension of the map


$(document).ready(function() {
    xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET",MAP_NAME,false);
    xmlhttp.send();
    xmlDoc=xmlhttp.responseText;
});

function parseMap(data) {
    var rowText;    // Holds each row
    console.log(data);
}
/*
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
}


		string rowText;			// The text contained in each row
		string[] rowValues;		// Temp array to hold the strings from the row
		int rowCount;		// Number of rows
		int colCount;		// Number of columns

		StreamReader sr = new StreamReader(inFileName);
		rowCount = int.Parse(sr.ReadLine());		
		colCount = int.Parse(sr.ReadLine());	
		elevations = new double[ rowCount,colCount ];
		
		// rowValues = new double[elevations(1)];
		
		// Read File and add to 2D array
		for(int r = 0;r<elevations.GetLength(0);r++)
		{
			// Read the text to a string,
			// then split text to an array
			rowText = sr.ReadLine();
			rowValues = rowText.Split(',');
			
			for(int c = 0;c<elevations.GetLength(1);c++)
			{
				elevations[r,c] = double.Parse(rowValues[c]);
			}
		}
		
		sr.Close();
        */

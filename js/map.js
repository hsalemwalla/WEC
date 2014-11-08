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

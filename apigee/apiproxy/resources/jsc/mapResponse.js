var mapName = context.getVariable("mapName");
var mapArr = getMap(mapName);
var jsonResponse = context.getVariable("jsonResponse");
if (mapArr !== undefined) {
  context.setVariable("mapArr", JSON.stringify(mapArr));

  var mapr = new JSMapr();
  mapr.setMapArray(mapArr);
/*
  var entryNum = 1;
  mapr.setLoggingFunc(function(entry) {
	context.setVariable("MAPLOG["+entryNum+"]", entry);
	entryNum++;
  });
  mapr.setLoggingEnabled(true);
*/

  var objToMap = JSON.parse(jsonResponse);

  objToMap = mapr.map(objToMap);

  context.setVariable("response.content", JSON.stringify(objToMap));
} else {
  context.setVariable("response.content", jsonResponse);
}
context.setVariable("response.header.Content-Type", "application/json");


// convert date to two fields: date without time, and day of the week
var holidaysDateFunc = function(srcObj, parms) {
  var d = new Date(srcObj.Date);
  srcObj.date = (srcObj.Date.split('T')[0]);
  var daysOfWeek = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
  srcObj.dayOfWeek = daysOfWeek[d.getUTCDay()];
  return srcObj;
};


function getMap(opName) {
  var map = undefined;
  switch(opName) {
	case "getCountries":
	  map = [
			  JSMapr.MAKEARRAY("/Envelope/Body/GetCountriesAvailableResponse/GetCountriesAvailableResult/CountryCode"),
			  JSMapr.MOVE("/Envelope/Body/GetCountriesAvailableResponse/GetCountriesAvailableResult/CountryCode", "/"),
			  JSMapr.MAPEACH("/",
							 [
								JSMapr.MOVE("/Code", "/code"),
								JSMapr.MOVE("/Description", "/description")
							 ]
							)
	  ];
	  break;
	case "getHolidaysList":
	  map = [
			  JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysAvailableResponse/GetHolidaysAvailableResult/HolidayCode"),
			  JSMapr.MOVE("/Envelope/Body/GetHolidaysAvailableResponse/GetHolidaysAvailableResult/HolidayCode", "/"),
			  JSMapr.MAPEACH("/",
							 [
								JSMapr.MOVE("/Code", "/code"),
								JSMapr.MOVE("/Description", "/description")
							 ]
							)
	  ];
	  break;
	case "getHolidaysForMonth":
	  map = [
			  // initialize /Date with empty array, in case there is nothing at .../Holiday (indicating no holidays returned)
			  JSMapr.ADD("/HolidayArray", []),
			  // next two are no-ops if .../Holiday doesn't exist, otherwise overwrites the default empty array
			  JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult/Holiday"),
			  JSMapr.MOVE("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult/Holiday", "/HolidayArray"),
			  // move the array to root
			  JSMapr.MOVE("/HolidayArray", "/"),
			  JSMapr.MAPEACH("/",
							 [
								JSMapr.EXEC(holidaysDateFunc),
								JSMapr.MOVE("/HolidayCode", "/code"),
								JSMapr.MOVE("/Descriptor", "/description"),
								JSMapr.DEL("/RelatedHolidayCode"),
								JSMapr.DEL("/BankHoliday"),
								JSMapr.DEL("/Country"),
								JSMapr.DEL("/DateType"),
								JSMapr.DEL("/HolidayType"),
								JSMapr.DEL("/Date")
							 ]
							)
	  ];
	  break;
	case "getHolidaysForYear":
	  map = [
			  JSMapr.ADD("/HolidayArray", []),
			  JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult/Holiday"),
			  JSMapr.MOVE("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult/Holiday", "/HolidayArray"),
			  JSMapr.MOVE("/HolidayArray", "/"),
			  JSMapr.MAPEACH("/",
							 [
								JSMapr.EXEC(holidaysDateFunc),
								JSMapr.MOVE("/HolidayCode", "/code"),
								JSMapr.MOVE("/Descriptor", "/description"),
								JSMapr.DEL("/RelatedHolidayCode"),
								JSMapr.DEL("/BankHoliday"),
								JSMapr.DEL("/Country"),
								JSMapr.DEL("/DateType"),
								JSMapr.DEL("/HolidayType"),
								JSMapr.DEL("/Date")
							 ]
							)
	  ];
	  break;
	case "getHolidaysForDateRange":
	  map = [
			  JSMapr.ADD("/HolidayArray", []),
			  JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult/Holiday"),
			  JSMapr.MOVE("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult/Holiday", "/HolidayArray"),
			  JSMapr.MOVE("/HolidayArray", "/"),
			  JSMapr.MAPEACH("/",
							 [
								JSMapr.EXEC(holidaysDateFunc),
								JSMapr.MOVE("/HolidayCode", "/code"),
								JSMapr.MOVE("/Descriptor", "/description"),
								JSMapr.DEL("/RelatedHolidayCode"),
								JSMapr.DEL("/BankHoliday"),
								JSMapr.DEL("/Country"),
								JSMapr.DEL("/DateType"),
								JSMapr.DEL("/HolidayType"),
								JSMapr.DEL("/Date")
							 ]
							)
	  ];
	  break;
	case "getHolidayDate":
	  map = [
			  // move the date field to /Date to take advantage of the same holidaysDateFunc
			  JSMapr.COPY("/Envelope/Body/GetHolidayDateResponse/GetHolidayDateResult", "/Date"),
			  JSMapr.DEL("/Envelope"),
			  JSMapr.MAP1("/",
							 [
								JSMapr.EXEC(holidaysDateFunc),
								JSMapr.DEL("/Date")
							 ]
						 )
	  ];
	  break;
  }
  return map;
}


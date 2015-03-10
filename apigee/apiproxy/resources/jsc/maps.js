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
			  JSMapr.IFTYPE("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult/Holiday", "null object",
							JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult/Holiday")),
			  JSMapr.IFTYPE("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult/Holiday", "array",
							// yes, it is an array
							[
								JSMapr.MOVE("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult/Holiday", "/"),
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
							],
							// no it isn't, if GetHolidaysForMonth exists, make this an empty array
							JSMapr.IFEXISTS("/Envelope/Body/GetHolidaysForMonthResponse/GetHolidaysForMonthResult", JSMapr.ADD("/", []))
						   )
	  ];
	  break;
	case "getHolidaysForYear":
	  map = [
			  JSMapr.IFTYPE("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult/Holiday", "null object",
							JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult/Holiday")),
			  JSMapr.IFTYPE("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult/Holiday", "array",
							// yes, it is an array
							[
								JSMapr.MOVE("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult/Holiday", "/"),
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
							],
							// no it isn't
							JSMapr.IFEXISTS("/Envelope/Body/GetHolidaysForYearResponse/GetHolidaysForYearResult", JSMapr.ADD("/", []))
						   )
	  ];
	  break;
	case "getHolidaysForDateRange":
	  map = [
			  JSMapr.IFTYPE("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult/Holiday", "null object",
							JSMapr.MAKEARRAY("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult/Holiday")),
			  JSMapr.IFTYPE("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult/Holiday", "array",
							// yes, it is an array
							[
								JSMapr.MOVE("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult/Holiday", "/"),
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
							],
							// no it isn't
							JSMapr.IFEXISTS("/Envelope/Body/GetHolidaysForDateRangeResponse/GetHolidaysForDateRangeResult", JSMapr.ADD("/", []))
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


//   new Date(2017,1,31)
//=> Fri Mar 03 2017 00:00:00 GMT-0800 (Pacific Standard Time)
function dateValid(dateArray, dateToCheck) {
  return dateArray.join() === [dateToCheck.getMonth()+1, dateToCheck.getDate(), dateToCheck.getFullYear()].join()
}

function splitInputDate(dateString) {
  return dateString.match(/\d+/g);
}

function dateFromArray(dateArray) {
  return new Date(dateArray[2], dateArray[0]-1, dateArray[1]);
}

function datesAreSame(d1, d2) {
  return d1.valueOf() === d2.valueOf();
}

function period(year, from, to, exludedDates) {
  if (typeof(exludedDates) === 'undefined') {
    exludedDates = [from, to];
  } else {
    exludedDates.unshift(from, to);
  }
  splitDates = exludedDates.map(function(e){
    var s = splitInputDate(e);
    s.push(year);
    return s;
  });
  from = splitDates.shift();
  to   = splitDates.shift();

  exludedDates = splitDates.map(function(e){return dateFromArray(e)})
  
  fromDate = dateFromArray(from);
  toDate   = dateFromArray(to);

  if (!dateValid(from, fromDate)) {
    return "from-date invalid";
  }

  if (!dateValid(to, toDate)) {
    return "to-date invalid";
  }

  var till = parseInt((toDate-fromDate)/1000/60/60/24+1);
  
  var dateArray = [];
  for (var i=0; i<= till; i++) {
    var d = dateFromArray(from);
    d.setDate( d.getDate()+i );

    var isDin = exludedDates.filter(function(e){return datesAreSame(e,d)});
    if (isDin.length !== 0) {
      continue;
    }

    dateArray.push( d );

    if (datesAreSame(d,toDate)) {
      break;
    }
  }

  var initDays = {"Mon": [], "Tue": [], "Wed": [], "Thu": [], "Fri": [], "Sat": [], "Sun": []};
  var days = dateArray.
    reduce(function(acc, curr){
      var dateS = curr.toDateString();
      var currDay = dateS.split(/\s/)[0];

      acc[currDay].push(dateS);
      return acc;
    }, initDays);

  days["mw"]  = days.Mon.length + days.Wed.length;
  days["mwf"] = days.mw + days.Fri.length;
  days["tuth"]= days.Tue.length + days.Thu.length;
  days["wf"]  = days.Wed.length + days.Fri.length;

  days["report"] = "MW=  " + days.mw +"\nMWF= " + days.mwf + "\nTuTh=" + days.tuth + "\nWF=  " + days.wf + "\n";

  return days;
}


//period(2017, "7/1", "9/31"); 
// 9/31 - date invalid

//period(2017, "7/1", "7/10", ["7/7","7/5","7/9"])
// checking excluded dates

// concrete examples
//period(2016, "7/1", "9/30", ["7/4", "7/29", "8/26", "9/5", "9/30"])
//period(2016, "10/1", "12/31", ["10/28","11/23","11/24","11/25","12/23","12/24","12/25","12/26","12/27","12/28","12/29","12/30","12/31"])
//period(2017, "1/1", "3/31", ["1/2", "1/16", "2/20", "2/3", "3/3", "3/31"])

/* DESCRIPTION
   Calculates instructional days for a certain quarter to 
   schedule authorizations. This awesome tool will save AT
   LEAST 30 minutes a year. 
*/

/* TODO
   - rewrite in purescript
   - it only works with a period in the same year
   - does not check if period is valid (e.g. 11/27 - 7/1)
   - add ranges (9/1..10/31) - would help in excluded dates
   - add frontend
*/

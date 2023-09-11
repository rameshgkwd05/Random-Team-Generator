var teams = [];
// Do any page setup, like modifying placeholder text
function init() {
	var textarea = document.getElementsByTagName('textarea')[0];
	textarea.placeholder = textarea.placeholder.replace(/\\n/g, '\n');
}

function getRandomTeam(arr, groupSize) {
	var currentTeam = [];
	for (var i = 0; i < groupSize; i++) {

		var randomPerson = arr[Math.floor(Math.random() * arr.length)];

		// If we get undefined, out of choices, break out of loop.
		if (randomPerson === undefined) {
			break;
		}

		// Get person's index and remove person from the array
		var indexOfPerson = arr.indexOf(randomPerson);
		arr.splice(indexOfPerson, 1);

		currentTeam.push(randomPerson);
	}
	return currentTeam;
}

function padDummyPeople(peopleArray, groupSize) {
	var dummiesNeeded = peopleArray.length%groupSize;
	for(var di = 1; di <= dummiesNeeded; di++) {
		peopleArray.push('dummy'+di);
	}
}

function generateAllTeams(peopleArray, groupSize) {
	teams = [];
	// level input people array by adding dummy players for missing entries
	padDummyPeople(peopleArray, groupSize);
	while (peopleArray.length > 0) {
		var currentGroup = getRandomTeam(peopleArray, groupSize);
		teams.push(currentGroup);
	}
	addTeamsHTML(teams);
}

function generateTeamRow(teamPlayers) {
	var teamRow = ''
	var pi=1;
	for(; pi<teamPlayers.length; pi++) {
		var stringToAppend = pi+'. ' + teamPlayers[pi-1] + ', ';
		teamRow += stringToAppend;
	}
	var stringToAppend = pi+'. ' + teamPlayers[pi-1];
	teamRow += stringToAppend;
	return teamRow
}

function addTeamsHTML(teamsArray) {

	var tabularOuputRequested = document.getElementById('tabular-output-switch').checked;	
	// reset display areas
	document.getElementById('team-container').innerHTML = '';
	document.getElementById("team-table").innerHTML = '';

	if (tabularOuputRequested == false) {
		var teamContainerEl = document.getElementById('team-container');
		for (var i = 0; i < teamsArray.length; i++) {
			var teamGroupHTML = document.createElement('div');
			var teamNumber = i + 1;
			teamGroupHTML.classList.add('team');
			var teamRow = generateTeamRow(teamsArray[i])
			teamGroupHTML.innerHTML = 'Team #' + teamNumber + ': ' + teamRow;
			teamContainerEl.appendChild(teamGroupHTML);
		}
	} else {

		var html = "<table class='styled-table'>";
		html+="<tr><th> </th>";
		for(var hi=0; hi<teamsArray[0].length; hi++){
			html+="<th>Player"+(hi+1)+"</th>";
		}
		html+="</tr>";
		for (var i = 0; i < teamsArray.length; i++) {
			html+="<tr>";
			var tnum = i+1;
			html+="<th> Team #"+tnum;
			teamPlayers = teamsArray[i];
			// console.log(teamPlayers)
			for(var pi=0; pi<teamPlayers.length; pi++) {
				html+="<td>"+ teamPlayers[pi]+"</td>";
			}
			html+="</tr>";
		}
		html+="</table>";
		document.getElementById("team-table").innerHTML = html;
	}
}

function formatTextareaValue(textAreaValue) {
	var inputPeopleArray = textAreaValue.split('\n');
	// console.log(inputPeopleArray);
	var peopleArray = inputPeopleArray.filter((str) => str.trim() !== '');
	// console.log(peopleArray)
	return peopleArray;
}

function validateUserInput(value) {
	// must be > 0 and an integer
	return value > 0 && value % 1 === 0;
}

function generateErrors(inputValidity, textareaValidity) {
	var validityTests = [
		{
			validity: inputValidity,
			errorId: 'size-error',
			type: 'input'
		},
		{
			validity: textareaValidity,
			errorId: 'people-error',
			type: 'textarea'
		}
	];

	for (var i = 0; i < validityTests.length; i++) {
		var targetEl = document.getElementById(validityTests[i].errorId);
		var inputError = '!*** Values must be an integer > 0';
		var textareaError = '!*** No People Info Entered';
		var errorText = validityTests[i].type === 'input' ? inputError : textareaError;

		if (!validityTests[i].validity) {
			targetEl.innerHTML = errorText;
		} else {
			targetEl.innerHTML = '';
		}
	}
}

document.getElementById('team-settings').addEventListener('submit', function (e) {
	e.preventDefault();

	var inputValue = document.getElementsByTagName('input')[0].value;
	var textAreaValue = document.getElementsByTagName('textarea')[0].value;

	var peopleArray = formatTextareaValue(textAreaValue);

	var isValidInputValue = validateUserInput(inputValue);
	var isValidTextarea = validateUserInput(peopleArray.length);

	generateErrors(isValidInputValue, isValidTextarea);

	if (isValidInputValue && isValidTextarea) {
		document.getElementById('team-container').innerHTML = '';
		generateAllTeams(peopleArray, inputValue);
		document.getElementById("download-button").focus();
	}
});

function convertArrayOfObjectsToCSV(teamlist) {
	// console.log("in convert function");

	data = teamlist || null;
	if (data == null || !data.length) {
		return null;
	}
	console.log("got a valid team list:");
	// console.log(teamlist);
	columnDelimiter = ',';
	lineDelimiter = '\n';
	cellSeparator = ','
	keys = Object.keys(data[0]);
	// console.log(keys)

	result = '';
	
	header = ' ,';
	var playercount = 1;
	keys.forEach(function (key){
		var player = "Player"+playercount+", ";
		playercount++;
		header += player
	})
	header.slice(0, -2);
	header += lineDelimiter
	result+= header

	// add data rows
	var teamCount = 1;
	var teamTitle = '';
	data.forEach(function (item) {
		// console.log(item)
		line = '';
		keys.forEach(function (key) {
			line += item[key];
			line += ', '
			
		});
		line.slice(0, -2);
		line += lineDelimiter;
		teamTitle = "Team-"+teamCount+", ";
		teamCount++;
		result += teamTitle;
		result += line;
	});
	console.table(result);
	return result;
}

function downloadCSV(args) {
	
	var data, filename, link;

	var csv = convertArrayOfObjectsToCSV(teams);
	console.log("is csv ready?");
	if (csv == null) {
		console.log("Invalid or empty input!");
		alert("Can't trick the system.\n No way around.\n Please fill all fields in the form!");
		return;
	}
	console.log("file is ready");

	filename = args.filename || 'export.csv';

	if (!csv.match(/^data:text\/csv/i)) {
		csv = 'data:text/csv;charset=utf-8,' + csv;
	}
	data = encodeURI(csv);

	link = document.createElement('a');
	link.setAttribute('href', data);
	link.setAttribute('download', filename);
	link.click();
}



init();


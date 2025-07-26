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

function generateAllTeams(peopleArray, teamCount) {
	teams = [];
	// Calculate group size
	var groupSize = Math.ceil(peopleArray.length / teamCount);
	console.log("People in array: " + peopleArray.length);
	console.log("Team count: " + teamCount);
	console.log("Group size: " + groupSize);

	// Generate teams
	while (peopleArray.length > 0) {
		var currentGroup = getRandomTeam(peopleArray, teamCount);
		teams.push(currentGroup);
	}

	// Add dummy players only to the last group
	var lastGroup = teams[teams.length - 1];
	var dummiesNeeded = (teamCount - lastGroup.length) % teamCount;
	console.log("Number of dummies needed: " + dummiesNeeded);

	for (var di = 1; di <= dummiesNeeded; di++) {
		lastGroup.push('dummy' + di);
	}

	// Render the teams
	addTeamsHTML(teams);
}

function generateTeamRow(teamPlayers) {
	var teamRow = ''
	var pi = 1;
	for (; pi < teamPlayers.length; pi++) {
		var stringToAppend = pi + '. ' + teamPlayers[pi - 1] + ', ';
		teamRow += stringToAppend;
	}
	var stringToAppend = pi + '. ' + teamPlayers[pi - 1];
	teamRow += stringToAppend;
	return teamRow
}

function prepareTeamNames(teamCount, comeAliveLabelsRequested) {
	console.log("Preparing team names for " + teamCount + " teams.");
	var teamNames = [];
	var preDefinedNameForComeAlive = ['Team Agni', 'Team Akash', 'Team Prithvi', 'Team Vayu', 'Team BrahMos', 'Team Astra', 'Team Trishul', 'Team Nirbhay', 'Team Dhanush', 'Team Nag'];
	if (comeAliveLabelsRequested) {
		for (var i = 0; i < teamCount; i++) {
			if (i < preDefinedNameForComeAlive.length) {
				teamNames.push(preDefinedNameForComeAlive[i]);
			}
			else {
				teamNames.push('Team Team ' + (i + 1));
			}
		}
	} else {
		for (var i = 0; i < teamCount; i++) {
			teamNames.push('Team ' + (i + 1));
		}
	}
	return teamNames;
}

function addTeamsHTML(teamsArray) {
	var tabularOuputRequested = document.getElementById('tabular-output-switch').checked;
	var comeAliveLabelsRequested = document.getElementById('custom-labels-switch').checked;
	// reset display areas
	document.getElementById('team-container').innerHTML = '';
	document.getElementById("team-table").innerHTML = '';

	teamNames = prepareTeamNames(teamsArray[0].length, comeAliveLabelsRequested);

	// Define symbols for specific team names
	const teamSymbols = {
		"Team Agni": "🔥",
		"Team Akash": "☁️",
		"Team Prithvi": "🌍",
		"Team Vayu": "💨"
	};

	if (tabularOuputRequested == false) {
		var teamContainerEl = document.getElementById('team-container');

		// Add the first row of team names
		var teamNamesRow = document.createElement('div');
		teamNamesRow.classList.add('team-names-row');
		teamNamesRow.innerHTML = teamNames.map((name, index) => {
			const symbol = teamSymbols[name] || ""; // Add symbol if available
			return `${symbol} ${name}`;
		}).join(' '); // Separate team names with a pipe (|) or any other delimiter
		teamContainerEl.appendChild(teamNamesRow);

		// Add the players row for each team
		for (var i = 0; i < teamsArray.length; i++) {
			var teamGroupHTML = document.createElement('div');
			var teamPlayers = teamsArray[i];
			teamGroupHTML.classList.add('team');
			var teamRow = generateTeamRow(teamPlayers); // Generate the row of players
			teamGroupHTML.innerHTML = `${teamRow}`;
			teamContainerEl.appendChild(teamGroupHTML);
		}
		var playerCountDiv = document.createElement('div');
		playerCountDiv.innerHTML = '<p align="center"> per team players: ' + teamsArray.length + '</p>';
		teamContainerEl.appendChild(playerCountDiv);
	} else {
		var html = "<table class='styled-table'>";
		html += "<tr><th> </th>";
		for (var hi = 0; hi < teamsArray[0].length; hi++) {
			var columnColor = '';
			if (comeAliveLabelsRequested) {
				// Assign background colors based on column index
				var colors = ['#FFCCCC', '#87CEEB', '#90EE90', '#FFFFFF']; // faint red, sky-blue, light-green, white
				columnColor = colors[hi % colors.length];
			}

			// Add symbol if the team name matches
			const teamName = teamNames[hi];
			const symbol = teamSymbols[teamName] || ""; // Use symbol if available, otherwise empty string
			html += `<th style="background-color: ${columnColor};">${symbol} ${teamName}</th>`;
		}
		html += "</tr>";
		for (var i = 0; i < teamsArray.length; i++) {
			html += "<tr>";
			var tnum = i + 1;
			html += "<th> Player #" + tnum;
			teamPlayers = teamsArray[i];
			for (var pi = 0; pi < teamPlayers.length; pi++) {
				var columnColor = '';
				if (comeAliveLabelsRequested) {
					// Assign background colors based on column index
					var colors = ['#FFCCCC', '#87CEEB', '#90EE90', '#FFFFFF']; // faint red, sky-blue, light-green, white
					columnColor = colors[pi % colors.length];
				}
				html += `<td style="background-color: ${columnColor};">${teamPlayers[pi]}</td>`;
			}
			html += "</tr>";
		}
		html += "</table>";

		html += '<p align="center"> per team players: ' + teamsArray.length + '</p>';
		document.getElementById("team-table").innerHTML = html;
	}
}

function formatPlayersList(textAreaValue) {
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

	var teamCount = document.getElementById('teamCount').value;
	var playersList = document.getElementById('playersList').value;

	var peopleArray = formatPlayersList(playersList);

	var isValidInputValue = validateUserInput(teamCount);
	var isValidTextarea = validateUserInput(peopleArray.length);

	generateErrors(isValidInputValue, isValidTextarea);

	if (isValidInputValue && isValidTextarea) {
		document.getElementById('team-container').innerHTML = '';
		generateAllTeams(peopleArray, teamCount);
		document.getElementById("download-button").focus();
	}
});

// Add event listeners to switches
document.getElementById('tabular-output-switch').addEventListener('change', function () {
	if (teams.length > 0) {
		addTeamsHTML(teams); // Re-render teams when the switch is toggled
	}
});

document.getElementById('custom-labels-switch').addEventListener('change', function () {
	if (teams.length > 0) {
		addTeamsHTML(teams); // Re-render teams when the switch is toggled
	}
});

function convertArrayOfObjectsToCSV(teamlist, teamNames) {
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
	var teamCount = 0;
	keys.forEach(function (key) {
		var team = teamNames[teamCount] + ", ";
		teamCount++;
		header += team
	})
	header.slice(0, -2);
	header += lineDelimiter
	result += header

	// add data rows
	var playerCount = 1;
	var playerRowTitle = '';
	data.forEach(function (item) {
		// console.log(item)
		line = '';
		keys.forEach(function (key) {
			line += item[key];
			line += ', '

		});
		line.slice(0, -2);
		line += lineDelimiter;
		playerRowTitle = "Player-" + playerCount + ", ";
		playerCount++;
		result += playerRowTitle;
		result += line;
	});
	console.table(result);
	return result;
}

function downloadCSV(args) {

	var data, filename, link;


	// Use predefined team names
	const teamNames = prepareTeamNames(teams[0].length, document.getElementById('custom-labels-switch').checked);
	var csv = convertArrayOfObjectsToCSV(teams, teamNames);
	console.log("is csv ready?");
	if (csv == null) {
		console.log("Invalid or empty input!");
		alert("Can't trick the system.\n No way around.\n Please fill all fields in the form!");
		return;
	}
	console.log("csv is ready");

	filename = args.filename || 'export.csv';
	// Generate filename with current date and time
	const now = new Date();
	const timestamp = now.toISOString().replace(/[-:T]/g, '').split('.')[0]; // Format: YYYYMMDDHHMMSS
	filename = filename.replace('.csv', `_${timestamp}.csv`);

	if (!csv.match(/^data:text\/csv/i)) {
		csv = 'data:text/csv;charset=utf-8,' + csv;
	}
	data = encodeURI(csv);

	console.log("csv file is ready: " + filename);
	link = document.createElement('a');
	link.setAttribute('href', data);
	link.setAttribute('download', filename);
	link.click();
}



init();


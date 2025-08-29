function generateMatches() {
    let teamAList = document.getElementById('teamAList').value.trim().split('\n').filter(Boolean);
    let teamBList = document.getElementById('teamBList').value.trim().split('\n').filter(Boolean);
    const sideSize = parseInt(document.getElementById('side-size').value, 10) || 1;

    // Validate input
    if (teamAList.length === 0 || teamBList.length === 0) {
        alert("Both Team A and Team B must have at least one player.");
        return;
    }

    if (isNaN(sideSize) || sideSize < 1) {
        document.getElementById('side-size-error').textContent = "Error: Please enter a valid side size (minimum 1).";
        return;
    } else {
        document.getElementById('side-size-error').textContent = ""; // Clear error if valid
    }

    // Check for duplicate names in Team A
    const teamASet = new Set(teamAList);
    if (teamASet.size !== teamAList.length) {
        const duplicatesA = teamAList.filter((item, index) => teamAList.indexOf(item) !== index);
        document.getElementById('teamA-error').textContent = `Error: Duplicate names found in Team A: "${[...new Set(duplicatesA)].join('", "')}".`;
        return;
    } else {
        document.getElementById('teamA-error').textContent = ""; // Clear error if no duplicates
    }

    // Check for duplicate names in Team B
    const teamBSet = new Set(teamBList);
    if (teamBSet.size !== teamBList.length) {
        const duplicatesB = teamBList.filter((item, index) => teamBList.indexOf(item) !== index);
        document.getElementById('teamB-error').textContent = `Error: Duplicate names found in Team B: "${[...new Set(duplicatesB)].join('", "')}".`;
        return;
    } else {
        document.getElementById('teamB-error').textContent = ""; // Clear error if no duplicates
    }

    // Shuffle the team lists
    teamAList = teamAList.sort(() => Math.random() - 0.5);
    teamBList = teamBList.sort(() => Math.random() - 0.5);

    const matchContainer = document.getElementById('match-container');
    const matchTableContainer = document.getElementById('match-table-container');
    matchContainer.innerHTML = ''; // Clear previous matches
    matchTableContainer.innerHTML = ''; // Clear previous table

    const matches = [];
    const maxMatches = Math.ceil(Math.max(teamAList.length, teamBList.length) / sideSize); // Calculate matches based on side size

    for (let i = 0; i < maxMatches; i++) {
        const teamASide = teamAList.slice(i * sideSize, (i + 1) * sideSize).join(', ') || "Bye";
        const teamBSide = teamBList.slice(i * sideSize, (i + 1) * sideSize).join(', ') || "Bye";
        matches.push({ matchNumber: i + 1, teamASide, teamBSide });
    }

    // Check the toggle state
    const isTableOutput = document.getElementById('output-toggle').checked;

    if (isTableOutput) {
        // Display matches as a table
        const table = document.createElement('table');
        table.classList.add('styled-table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Match #</th>
                <th>Team A</th>
                <th>Team B</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        matches.forEach(match => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${match.matchNumber}</td>
                <td>${match.teamASide}</td>
                <td>${match.teamBSide}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        matchTableContainer.appendChild(table);
    } else {
        // Display matches as CSV content
        const csvContent = matches.map(match => `${match.matchNumber},${match.teamASide},${match.teamBSide}`).join('\n');
        const csvPre = document.createElement('pre');
        csvPre.textContent = `Match #,Team A,Team B\n${csvContent}`;
        matchContainer.appendChild(csvPre);
    }

    // Store matches for CSV download
    window.generatedMatches = matches.map(match => `${match.matchNumber},${match.teamASide},${match.teamBSide}`);

    // Check for imbalanced teams
    const imbalanceWarning = document.getElementById('imbalance-warning') || document.createElement('p');
    imbalanceWarning.id = 'imbalance-warning';
    imbalanceWarning.style.color = 'red';
    imbalanceWarning.style.fontWeight = 'bold';

    if (teamAList.length !== teamBList.length) {
        imbalanceWarning.textContent = "Warning: Non-equal team sizes result in BYEs in matches.";
    } else {
        imbalanceWarning.textContent = ""; // Clear warning if teams are balanced
    }

    // Append the warning below the output
    if (!document.getElementById('imbalance-warning')) {
        matchContainer.parentNode.appendChild(imbalanceWarning);
    }
}

function downloadMatchesCSV(args) {
    const matches = window.generatedMatches || [];
    if (matches.length === 0) {
        alert("No matches to download. Please generate matches first.");
        return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,Match #,Team A,Team B\n' + matches.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', args.filename || 'matches.csv');
    link.click();
}

function toggleOutput() {
    const isTableOutput = document.getElementById('output-toggle').checked;
    const matchContainer = document.getElementById('match-container');
    const matchTableContainer = document.getElementById('match-table-container');

    matchContainer.innerHTML = ''; // Clear previous content
    matchTableContainer.innerHTML = ''; // Clear previous content

    if (window.generatedMatches && window.generatedMatches.length > 0) {
        const matches = window.generatedMatches;

        if (isTableOutput) {
            // Display matches as a table
            const table = document.createElement('table');
            table.classList.add('styled-table');
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Match #</th>
                    <th>Team A</th>
                    <th>Team B</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            matches.forEach(match => {
                const row = document.createElement('tr');
                const [matchNumber, playerA, playerB] = match.split(',');
                row.innerHTML = `
                    <td>${matchNumber}</td>
                    <td>${playerA}</td>
                    <td>${playerB}</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            matchTableContainer.appendChild(table);
        } else {
            // Display matches as CSV content
            const csvContent = matches.join('\n');
            const csvPre = document.createElement('pre');
            csvPre.textContent = `Match #,Team A,Team B\n${csvContent}`;
            matchContainer.appendChild(csvPre);
        }
    }

    // Check for imbalanced teams
    const imbalanceWarning = document.getElementById('imbalance-warning') || document.createElement('p');
    imbalanceWarning.id = 'imbalance-warning';
    imbalanceWarning.style.color = 'red';
    imbalanceWarning.style.fontWeight = 'bold';

    if (window.teamAList && window.teamBList && window.teamAList.length !== window.teamBList.length) {
        imbalanceWarning.textContent = "Warning: Non-equal team sizes result in BYEs in matches.";
    } else {
        imbalanceWarning.textContent = ""; // Clear warning if teams are balanced
    }

    // Append the warning below the output
    if (!document.getElementById('imbalance-warning')) {
        matchContainer.parentNode.appendChild(imbalanceWarning);
    }
}

// Attach event listener to the "Generate Matches" button
document.getElementById('generate-matches-button').addEventListener('click', generateMatches);

// Attach event listener to the toggle switch
document.getElementById('output-toggle').addEventListener('change', toggleOutput);

// Set placeholder for side size input
const sideSizeInput = document.getElementById('side-size');
if (sideSizeInput) {
    sideSizeInput.placeholder = "Enter side size (default is 1)";
}
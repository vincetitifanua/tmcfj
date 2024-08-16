let mainTimerInterval;
let mainTimerSeconds = 0;
let displayWindow = null;
let schools = [];

function setMainTimer() {
    const minutes = parseInt(document.getElementById('mainMinutesInput').value) || 0;
    const seconds = parseInt(document.getElementById('mainSecondsInput').value) || 0;
    mainTimerSeconds = minutes * 60 + seconds;
    updateMainTimerDisplay();
}

function startMainTimer() {
    clearInterval(mainTimerInterval);
    mainTimerInterval = setInterval(() => {
        if (mainTimerSeconds > 0) {
            mainTimerSeconds--;
            updateMainTimerDisplay();
        } else {
            clearInterval(mainTimerInterval);
        }
    }, 1000);
}

function pauseMainTimer() {
    clearInterval(mainTimerInterval);
}

function resetMainTimer() {
    clearInterval(mainTimerInterval);
    mainTimerSeconds = 0;
    updateMainTimerDisplay();
}

function updateMainTimerDisplay() {
    const minutes = Math.floor(mainTimerSeconds / 60);
    const seconds = mainTimerSeconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('main-timer').innerText = formattedTime;

    // Send the timer update to the display window
    if (displayWindow && !displayWindow.closed) {
        displayWindow.postMessage({
            type: 'updateTimer',
            timerText: formattedTime
        }, '*');
    }
}

function openDisplay() {
    if (displayWindow && !displayWindow.closed) {
        displayWindow.focus();
        return;
    }

    displayWindow = window.open('', 'TMC Display', 'width=1000,height=600');

    displayWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>TMC Scoreboard Display</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #d1d1e0;
                    margin: 0;
                    padding: 30px;
                    text-align: center;
                }
                h1 {
                    color: #333;
                }
                #display-timer {
                    font-size: 48px;
                    color: red;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .school {
                    margin: 10px;
                    padding: 20px;
                    background-color: #f1f1f1;
                    border-radius: 4px;
                    display: inline-block;
                    width: calc(33% - 40px);
                    box-sizing: border-box;
                }
                .points-display {
                    font-size: 35px;
                    color: red;
                    font-weight: bold;  
                }
            </style>
        </head>
        <body>
        <h1>Welcome</h1>
            <h2>Team Mathematics Competition FIJI</h2>
            <div id="display-timer">00:00</div>
            <div id="school-list"></div>
            <script>
                window.addEventListener('message', (event) => {
                    if (event.origin !== window.location.origin) return;

                    const { type, timerText } = event.data;

                    if (type === 'updateTimer') {
                        document.getElementById('display-timer').innerText = timerText;
                    }
                });
            </script>
        </body>
        </html>
    `);
}

function addSchool() {
    const schoolName = prompt("Enter the school name:");
    const points = prompt("Enter the initial points for this school:");

    if (schoolName && points !== null) {
        const schoolId = `school-${schools.length}`;
        schools.push({
            id: schoolId,
            name: schoolName,
            points: parseInt(points) || 0
        });

        const schoolElement = document.createElement('div');
        schoolElement.setAttribute('id', schoolId);
        schoolElement.innerHTML = `
            <table>
                <tr>
                    <td>
                        <h3>${schoolName}</h3>
                        <div>
                            <button onclick="changePoints('${schoolId}', 5)">+5 Points</button>
                            <button onclick="changePoints('${schoolId}', -5)">-5 Points</button>
                            <button onclick="removeSchool('${schoolId}')">Remove School</button>
                            <span id="points-${schoolId}" style="font-size: 24px;">Points: ${points}</span>
                        </div>
                        <input type="checkbox" id="select-${schoolId}">
                        <label for="select-${schoolId}">Select to Award Points</label>
                    </td>
                </tr>
            </table>
        `;
        document.getElementById('scoreboard').appendChild(schoolElement);

        document.getElementById('schoolName').value = '';
        updateDisplayWindow();
    }
}

function removeSchool(schoolId) {
    // find and remove the school from the box 
    schools = schools.filter(school => school.id !== schoolId);

    // Here is tp remove the school element from the scoreboard
    const schoolElement = document.getElementById(schoolId);
    if (schoolElement) {
        schoolElement.remove();
    }

    updateDisplayWindow();
}

function changePoints(schoolId, points) {
    const school = schools.find(s => s.id === schoolId);
    school.points += points;
    if (school.points < 0) school.points = 0;
    document.getElementById(`points-${schoolId}`).textContent = `Points: ${school.points}`;
    updateDisplayWindow();
}
// existing code...

function awardPointsToAllSchools(points) {
    schools.forEach(school => {
        changePoints(school.id, points);
    });
    updateDisplayWindow();
}
function awardPointsToAllSchools(points) {
    schools.forEach(school => {
        changePoints(school.id, points);
    });
    updateDisplayWindow();
}

// this is the function to award 100 points to all schools
function award100PointsToAllSchools() {
    awardPointsToAllSchools(5);
}
function updateDisplayWindow() {
    if (!displayWindow || displayWindow.closed) return;

    const schoolList = displayWindow.document.getElementById('school-list');
    schoolList.innerHTML = '';

    schools.forEach(school => {
        const schoolElement = document.createElement('div');
        schoolElement.classList.add('school');
        schoolElement.innerHTML = `
            <h3>${school.name}</h3>
            <div class="points-display">Points: ${school.points}</div>
        `;
        schoolList.appendChild(schoolElement);
    });
}

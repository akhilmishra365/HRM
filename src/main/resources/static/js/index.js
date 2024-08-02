        var startTime;
        var timer;
        var elapsedBeforePause = 0;

        function startTimer() {
            startTime = new Date().getTime(); // Record the start time
            localStorage.setItem('startTime', startTime); // Save the start time to local storage
            timer = setInterval(updateTimer, 1000);
        }

        function updateTimer() {
            var now = new Date().getTime();
            var elapsed = elapsedBeforePause + (now - startTime);
            var minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
            document.getElementById('update').innerHTML = ' ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }

        function pauseTimer() {
            clearInterval(timer);
            var now = new Date().getTime();
            elapsedBeforePause += (now - startTime);
            localStorage.setItem('elapsedBeforePause', elapsedBeforePause);
        }

        function resumeTimer() {
            startTime = new Date().getTime();
            timer = setInterval(updateTimer, 1000);
        }

        async function clockIn(userId) {
            const response = await fetch(`/api/clockings/clock-in/${userId}`, { method: 'POST' });
            const clocking = await response.json();
            const clockInTime = new Date(clocking.clockInDate).toLocaleString();
            document.getElementById('clockingId').value = clocking.id;
            document.getElementById('clockInTime').innerText = clockInTime;

            localStorage.setItem('clockingId', clocking.id);
            localStorage.setItem('clockInTime', clockInTime);
            localStorage.setItem('clockInUserId', userId);

            document.getElementById('clockInButton').classList.add('disabled'); // Disable Clock In button
            document.getElementById('clockOutButton').classList.remove('disabled'); // Enable Clock Out button
            startTimer(); // Start the timer when clocking in
        }

        async function clockOut() {
            const clockingId = document.getElementById('clockingId').value || localStorage.getItem('clockingId');

            const response = await fetch(`/api/clockings/clock-out/${clockingId}`, { method: 'POST' });
            const clocking = await response.json();
            const clockOutTime = new Date(clocking.clockOutDate).toLocaleString();
            document.getElementById('clockOutTime').innerText = clockOutTime;

            localStorage.setItem('clockOutTime', clockOutTime);
            localStorage.removeItem('startTime'); // Remove start time from local storage on clock out
            localStorage.removeItem('elapsedBeforePause'); // Remove elapsed time from local storage on clock out

            document.getElementById('clockInButton').classList.remove('disabled'); // Enable Clock In button
            document.getElementById('clockOutButton').classList.add('disabled'); // Disable Clock Out button
            pauseTimer(); // Pause the timer when clocking out
        }

        window.onload = function () {
            const startTime = localStorage.getItem('startTime');
            const clockingId = localStorage.getItem('clockingId');
            const clockInTime = localStorage.getItem('clockInTime');
            const clockInUserId = localStorage.getItem('clockInUserId');
            elapsedBeforePause = parseInt(localStorage.getItem('elapsedBeforePause')) || 0;

            if (startTime && clockingId && clockInTime && clockInUserId) {
                document.getElementById('clockingId').value = clockingId;
                document.getElementById('clockInTime').innerText = clockInTime;

                document.getElementById('clockInButton').classList.add('disabled'); // Disable clock-in button
                document.getElementById('clockOutButton').classList.remove('disabled'); // Enable clock-out button

                resumeTimer();
            } else {
                document.getElementById('clockInButton').classList.remove('disabled'); // Enable clock-in button
                document.getElementById('clockOutButton').classList.add('disabled'); // Disable clock-out button
            }
        }

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                console.log('Screen is off at ' + new Date().toLocaleString());
                pauseTimer();
            } else {
                console.log('Screen is back on at ' + new Date().toLocaleString());
                resumeTimer();
            }
        });

        function generateCalendar() {
            const today = new Date();
            const month = today.getMonth(); // 0-based index
            const year = today.getFullYear();

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0).getDate();

            const monthYearElement = document.getElementById('monthYear');
            monthYearElement.textContent = `${getMonthName(month)} ${year}`;

            const calendarBody = document.getElementById('calendarBody');
            calendarBody.innerHTML = '';

            let date = 1;
            for (let i = 0; i < 6; i++) {
                const row = document.createElement('tr');
                for (let j = 0; j < 7; j++) {
                    const cell = document.createElement('td');
                    if (i === 0 && j < firstDay.getDay()) {
                        row.appendChild(cell);
                    } else if (date > lastDay) {
                        break;
                    } else {
                        cell.textContent = date;
                        if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                            cell.classList.add('today');
                        }
                        row.appendChild(cell);
                        date++;
                    }
                }
                calendarBody.appendChild(row);
            }
        }

        function getMonthName(monthIndex) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return months[monthIndex];
        }

        document.addEventListener('DOMContentLoaded', function() {
            generateCalendar();
        });

        function updateDateTime() {
            const dateEl = document.getElementById('current-date');
            const timeEl = document.getElementById('current-time');
            const now = new Date();

            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.innerText = now.toLocaleDateString(undefined, options);

            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            timeEl.innerText = now.toLocaleTimeString(undefined, timeOptions);
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);

        document.addEventListener('DOMContentLoaded', function() {
            var dropdowns = document.querySelectorAll('.dropdown > a');

            dropdowns.forEach(function(dropdown) {
                dropdown.addEventListener('click', function(e) {
                    e.preventDefault();

                    var parentLi = this.parentNode;
                    parentLi.classList.toggle('show');
                });
            });
        });

        document.addEventListener("DOMContentLoaded", function() {
            if (window.location.search.includes("logout")) {
                localStorage.removeItem("sessionId");
                localStorage.removeItem("userRole");
            }
        });
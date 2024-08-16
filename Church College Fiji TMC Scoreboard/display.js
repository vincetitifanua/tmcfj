window.onload = () => {
    window.addEventListener('message', (event) => {
        if (event.data.type === 'updateTimer') {
            document.getElementById('display-timer').innerText = event.data.timerText;
        }
    });
};

fetch('https://zenquotes.io/api/random')
    .then(response => response.json())
    .then(data => {
        document.getElementById('quote').textContent = `"${data[0].q}" — ${data[0].a}`;
    })
    .catch(error => {
        const backupQuotes = [
            `"In the middle of difficulty lies opportunity." — Albert Einstein`,
            `"Do what you can, with what you have, where you are." — Theodore Roosevelt`,
            `"Success is not final, failure is not fatal: It is the courage to continue that counts." — Winston Churchill`
        ];
        const randomQuote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
        document.getElementById('quote').textContent = randomQuote;
    });
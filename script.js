document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('smsForm');
    const startBtn = document.getElementById('startBtn');
    const statusDiv = document.getElementById('status');
    const resultsDiv = document.getElementById('results');
    const progressBar = document.getElementById('progressBar');
    const totalEl = document.getElementById('total');
    const successEl = document.getElementById('successCount');
    const failEl = document.getElementById('failCount');
    const resultJson = document.getElementById('resultJson');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const number = document.getElementById('number').value.trim();
        const threads = parseInt(document.getElementById('threads').value) || 10;
        const count = parseInt(document.getElementById('count').value) || 30;
        const delay = parseFloat(document.getElementById('delay').value) || 0.3;
        
        if (!number) {
            alert('Please enter a Bangladesh phone number');
            return;
        }
        
        // Reset UI
        statusDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        startBtn.disabled = true;
        startBtn.querySelector('.btn-text').textContent = '⏳ Sending SMS...';
        progressBar.style.width = '0%';
        totalEl.textContent = '0';
        successEl.textContent = '0';
        failEl.textContent = '0';
        
        try {
            const response = await fetch('/api/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number, threads, count, delay })
            });
            
            const result = await response.json();
            
            // Update stats
            totalEl.textContent = result.total_sent || 0;
            successEl.textContent = result.successful || 0;
            failEl.textContent = result.failed || 0;
            progressBar.style.width = '100%';
            
            // Show results
            resultJson.textContent = JSON.stringify(result, null, 2);
            resultsDiv.classList.remove('hidden');
            
        } catch (error) {
            resultJson.textContent = `❌ Error: ${error.message}\n\nPossible causes:\n• Vercel timeout (max 30s)\n• Network issue\n• Invalid number format`;
            resultsDiv.classList.remove('hidden');
        } finally {
            startBtn.disabled = false;
            startBtn.querySelector('.btn-text').textContent = '🚀 Start Fucking 🖕';
        }
    });
});
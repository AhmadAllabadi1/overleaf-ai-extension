document.addEventListener('DOMContentLoaded', function() {
  const generateButton = document.getElementById('generate');
  const promptTextarea = document.getElementById('prompt');
  const statusDiv = document.getElementById('status');

  generateButton.addEventListener('click', async () => {
    const prompt = promptTextarea.value.trim();

    if (!prompt) {
      showStatus('Please enter a prompt', 'error');
      return;
    }

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Current tab:', tab);

      if (!tab) {
        throw new Error('No active tab found');
      }

      if (!tab.url.includes('overleaf.com')) {
        throw new Error('Please open an Overleaf document first');
      }

      // First try to send the message
      try {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'generateLatex',
          prompt: prompt
        });
        console.log('Message sent successfully, response:', response);
        
        if (response.success) {
          showStatus('LaTeX code generated and inserted successfully!', 'success');
        } else {
          showStatus('Error: ' + response.error, 'error');
        }
      } catch (error) {
        console.log('First message attempt failed, trying to inject script:', error);
        
        // If message fails, try to inject the script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        console.log('Content script injected, trying message again');

        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 500));

        // Try sending the message again
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'generateLatex',
          prompt: prompt
        });
        console.log('Second message attempt response:', response);

        if (response.success) {
          showStatus('LaTeX code generated and inserted successfully!', 'success');
        } else {
          showStatus('Error: ' + response.error, 'error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showStatus('Error: ' + error.message, 'error');
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}); 
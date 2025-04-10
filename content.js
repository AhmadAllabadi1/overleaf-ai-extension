// Initialize message listener
console.log('Overleaf AI Assistant content script loaded');

// Store the last known cursor position
let lastCursorPosition = null;

// Listen for cursor position changes
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    lastCursorPosition = selection.getRangeAt(0).cloneRange();
  }
});

// Function to handle messages
function handleMessage(request, sender, sendResponse) {
  console.log('Content script received message:', request);
  
  if (request.action === 'generateLatex') {
    handleLatexGeneration(request.prompt)
      .then(result => {
        console.log('Generation result:', result);
        sendResponse(result);
      })
      .catch(error => {
        console.error('Generation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Required for async response
  }
}

// Register the message listener
chrome.runtime.onMessage.addListener(handleMessage);

// Also register a one-time message to confirm the script is loaded
chrome.runtime.sendMessage({ action: 'contentScriptLoaded' }, response => {
  console.log('Content script loaded confirmation sent');
});

async function handleLatexGeneration(prompt) {
  try {
    // Wait for the editor to be available
    await waitForElement('.cm-editor');
    
    // Find the Overleaf editor
    const editor = document.querySelector('.cm-editor');
    if (!editor) {
      throw new Error('Could not find Overleaf editor');
    }

    // Get the current cursor position
    const cursor = editor.querySelector('.cm-cursor');
    if (!cursor) {
      throw new Error('Could not find cursor position');
    }

    // First check if the backend is available
    try {
      const healthCheck = await fetch('http://localhost:3000/health', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!healthCheck.ok) {
        throw new Error(`Backend server responded with status: ${healthCheck.status}`);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Could not connect to backend server. Please make sure it is running on http://localhost:3000');
    }

    // Call the backend server to generate LaTeX code
    const response = await fetch('http://localhost:3000/generate-latex', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.error || `Failed to generate LaTeX code: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response:', data);

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate LaTeX code');
    }

    if (!data.latexCode) {
      throw new Error('No LaTeX code received from server');
    }

    const latexCode = data.latexCode;

    // Find the editor content element
    const editorContent = editor.querySelector('.cm-content');
    if (!editorContent) {
      throw new Error('Could not find editor content');
    }

    // Get the current selection
    const selection = window.getSelection();
    if (!selection) {
      throw new Error('Could not get selection');
    }

    // Use the last known cursor position if available
    if (lastCursorPosition) {
      selection.removeAllRanges();
      selection.addRange(lastCursorPosition);
    } else {
      // Fallback to the current selection
      const range = document.createRange();
      range.selectNodeContents(editorContent);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Insert the text
    document.execCommand('insertText', false, latexCode);

    return { success: true };
  } catch (error) {
    console.error('Error in handleLatexGeneration:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to wait for an element to be available
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);
  });
} 
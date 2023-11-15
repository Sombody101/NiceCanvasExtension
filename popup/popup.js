// popup.js
const SEP = '\0'
document.getElementById('switchTheme').addEventListener('click', () => {    
    chrome.runtime.sendMessage({ action: `dark_theme` });
});


// Function to convert text to bionic reading format
function convertToBionicReading(text) {
    // Split text into words
    return text.split(' ').map(word => {
        if (word.length <= 1) return word;
        
        // Calculate how many characters to bold (roughly half)
        const boldLength = Math.ceil(word.length / 2);
        
        // Bold the first part of the word
        const boldPart = `<strong>${word.substring(0, boldLength)}</strong>`;
        const normalPart = word.substring(boldLength);
        
        return boldPart + normalPart;
    }).join(' ');
}

// Function to process text nodes
function processTextNode(node) {
    // Check if the text contains multiple lines by looking for periods followed by whitespace
    const hasMultipleLines = node.textContent.match(/\.\s+[A-Z]/);
    
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '' && hasMultipleLines) {
        const span = document.createElement('span');
        span.setAttribute('data-bionic-reading', 'true');
        span.innerHTML = convertToBionicReading(node.textContent);
        node.replaceWith(span);
    }
}

// Function to process all text nodes in a given element
function processElement(element) {
    // First, remove any existing bionic reading spans
    element.querySelectorAll('span[data-bionic-reading]').forEach(span => {
        span.replaceWith(span.textContent);
    });

    // Skip script, style, headings, and navigation elements
    if (element.tagName === 'SCRIPT' || 
        element.tagName === 'STYLE' || 
        /^H[1-6]$/.test(element.tagName) ||
        element.tagName === 'NAV' ||
        element.tagName === 'MENU' ||
        element.tagName === 'HEADER') {
        return;
    }

    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach(processTextNode);
}

// Make the function available globally
window.applyBionicReading = () => processElement(document.body);

// Initial processing
applyBionicReading();

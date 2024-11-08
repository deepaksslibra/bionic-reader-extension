function transformContent() {
    // Always remove existing bionic styling first
    document.querySelectorAll('[data-bionic-original]').forEach(element => {
        element.innerHTML = element.getAttribute('data-bionic-original');
        element.removeAttribute('data-bionic-original');
    });
    document.body.removeAttribute('data-bionic-active');

    // If we were removing styling, stop here
    if (document.body.hasAttribute('data-bionic-removing')) {
        document.body.removeAttribute('data-bionic-removing');
        return;
    }

    // Mark as transformed and proceed with new transformation
    document.body.setAttribute('data-bionic-active', 'true');

    // First try to find main content container
    const mainContent = document.querySelector('article, [role="main"], main, .article-content, .post-content');
    
    if (mainContent) {
        // If we found a main content container, process its paragraphs
        mainContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(processElement);
    } else {
        // Fallback: look for quality text throughout the document
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(processElement);
    }
}

function processElement(element) {
    const text = element.textContent.trim();
    if (isQualityText(text)) {
        // Store original content
        element.setAttribute('data-bionic-original', element.innerHTML);
        element.innerHTML = convertToBionicReading(text);
    }
}

function isQualityText(text) {
    if (text.length < 20) return false;  // Too short
    
    // Check for common patterns that indicate low-quality content
    const lowQualityIndicators = [
        /^[0-9\s]*$/, // Only numbers
        /^copyright/i,
        /^all rights reserved/i,
        /^\d+\s+(comments|replies)/i,
        /^share\s+this/i,
        /^follow us/i,
        /^subscribe/i,
        /^advertisement/i
    ];

    if (lowQualityIndicators.some(pattern => pattern.test(text))) {
        return false;
    }

    // Check for reasonable sentence structure
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    if (sentences.length === 0) return false;

    // Check for reasonable word count and structure
    const words = text.split(/\s+/);
    const avgWordLength = words.join('').length / words.length;
    if (avgWordLength < 3 || avgWordLength > 15) return false;  // Suspicious average word length

    return true;
}

function convertToBionicReading(text) {
    return text.split(' ').map(word => {
        if (word.length <= 1) return word;
        const boldLength = Math.ceil(word.length / 2);
        const boldPart = `<strong>${word.substring(0, boldLength)}</strong>`;
        const normalPart = word.substring(boldLength);
        return boldPart + normalPart;
    }).join(' ');
}

// Add CSS for dark mode support only if it doesn't exist yet
if (!document.querySelector('#bionic-reader-style')) {
    const style = document.createElement('style');
    style.id = 'bionic-reader-style';
    style.textContent = `
        /* System dark mode */
        @media (prefers-color-scheme: dark) {
            [data-bionic-active] strong {
                color: #ffffff;
                font-weight: 700;
            }
        }

        /* Common dark mode class patterns */
        :is(.dark-mode, .darkMode, [data-theme="dark"], .dark-theme, .theme-dark) [data-bionic-active] strong,
        .dark [data-bionic-active] strong {
            color: #ffffff;
            font-weight: 700;
        }

        /* Handle dark backgrounds regardless of mode */
        [data-bionic-active] strong {
            color: var(--text-color, currentColor);
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
}

transformContent();
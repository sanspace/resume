/**
 * @typedef {object} MarkdownOptions
 * @property {object} [markedOptions] - Options to pass directly to the marked.parse() function.
 * @property {string} [selector='.markdown-content'] - CSS selector for elements containing Markdown.
 */

/**
 * Process Markdown withing specified elements.
 * @param {MarkdownOptions} [options={}] - Configurations options.
 */
function processMarkdownElements(options = {}) {
    const defaults = {
        markedOptions: {},
        selector: '.markdown-content'
    };
    
    // merge default and user options
    const config = { ...defaults, ...options};

    if (typeof marked === 'undefined') {
        console.error('Markdown processing requires the "marked" library.');
        return;
    }

    /**
     * Extracts text content from an element and removes leading whitespace
     * Based on reveal.js's markdown plugin logic for robustness.
     * @param {HTMLElement} element - The element with MD content
     * @returns {string} the processed MD text
     */
    function getAndTrimMarkdown(element) {
        let text = element.textContent;
        const lines = text.split('\n');

        let minIndent = Infinity;
        lines.forEach(line => {
            const match = line.match(/^\s*/);
            if (match) {
                const indent = match[0].length;
                if (line.trim().length > 0 && indent < minIndent) {
                    minIndent = indent;
                }
            }
        });

        if (minIndent > 0 && minIndent !== Infinity) {
            text = lines.map(line => line.startsWith(' '.repeat(minIndent)) || line.startsWith('\t'.repeat(minIndent)) ? line.substring(minIndent) : line).join('\n');
        }

        return text.trim();
    }

    function renderMarkdown() {
        const elements = document.querySelectorAll(config.selector);
        
        if (elements.length === 0) {
            console.warn(`No elements found with selector: ${config.selector}`);
            return;
        }

        elements.forEach((element, i) => {
            try {
                const markdownText = getAndTrimMarkdown(element);
                const html = marked.parse(markdownText, config.markedOptions);
                element.innerHTML = html;
                element.classList.add('processed');
                if (element.nodeName === 'SCRIPT' || element.nodeName ==='TEXTAREA') {
                    element.style.display = 'none';
                }
            } catch (error) {
                console.error(`Error processing element ${i}:`, element, error);
                element.innerHTML = '<p style="color: red;">Error processing Markdown</p>';
            }
        });

    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderMarkdown);
    } else {
        renderMarkdown();
    }
}
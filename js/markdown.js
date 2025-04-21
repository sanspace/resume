// excerpt from https://github.com/hakimel/reveal.js/blob/master/plugin/markdown/markdown.js

// Get Markdown content from an element
function getMarkdownFromElement(element) {
  var text = element.textContent;
  var leadingWs = text.match( /^\n?(\s*)/ )[1].length,
  leadingTabs = text.match( /^\n?(\t*)/ )[1].length;

  if( leadingTabs > 0 ) {
    text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
  }
  else if( leadingWs > 1 ) {
    text = text.replace( new RegExp('\\n? {' + leadingWs + '}', 'g'), '\n' );
  }

  return text;
}

// Collect, parse and render markdown
function renderMarkdown() {
  document.querySelectorAll('.markdown-content').forEach(function(element, i){
    markdown = getMarkdownFromElement(element);
    html = marked.parse(markdown)
    element.innerHTML = html;
  });
}

renderMarkdown();
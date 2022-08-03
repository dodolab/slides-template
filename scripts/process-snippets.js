const utils = require('./utils');
const prism = require('prismjs');

require('prismjs/components/prism-typescript');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-asm6502');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-json');
require('prismjs/components/prism-sql');


// add your languages here
// check out supported languages: https://lucidar.me/en/web-dev/list-of-supported-languages-by-prism/
const extensionMapper = (ext) => {
	switch (ext) {
		case 'sql':
			return 'sql';
		case 'ts':
			return 'typescript';
		case 'cpp':
			return 'cpp';
		case 'js':
			return 'javascript';
		case 'json':
			return 'json';
		case 'bash':
			return 'bash';
		case 'asm':
			return 'asm6502';
		default:
			return 'javascript';
	}
};


module.exports = {
	processSnippets: function () {

		const snippetFiles = utils.searchFiles('./slides/assets', null, 'snippets');
		for (let file of snippetFiles) {
			const snippet = utils.fileToStr(file);
			const extension = file.substr(file.lastIndexOf('.') + 1);
			const withoutExtension = file.substr(0, file.lastIndexOf('.'));
			const targetPath = withoutExtension.replace('snippets', 'snippets_generated') + '.html';

			if (withoutExtension === '') {
				// .xxx file
				continue;
			}
			else if (extension.toLowerCase() === 'html') {
				// just copy the file
				utils.copyFileSync(file, targetPath)
			} else {
				const language = extensionMapper(extension);
				console.log(`Parsing code snippet from ${file} with language ${language}`);

				// each line that starts with @fragment will be highlighted
				let allLines = snippet.split('\n');
				let highlights = new Map();
				let highlightCounter = 0;

				allLines.forEach((line, index) => {
					if (line.startsWith('@fragment')) {
						const highlight = line.substring(1);
						highlights.set(highlightCounter, highlight);
					} else {
						highlightCounter++;
					}
				});

				allLines = allLines.filter(line => !line.startsWith('@fragment'));

				const highlighted = prism.highlight(allLines.join('\n'), Prism.languages[language], language);


				const withLineNumbers = highlighted
					.split('\n')
					.map((line, index) => {
						if (highlights.has(index)) {
							return `<tr class="${highlights.get(index)}"><td><span><span class="linenum">${(index + 1).toString().padStart(4, ' ')}</span></td><td>&nbsp;<span>${line}</span></td></tr>`;
						}
						return `<tr><td><span class="linenum">${(index + 1).toString().padStart(4, ' ')}</span></td><td>&nbsp;${line}</td></tr>`;
					})
					.join('\n');

				const wrappedHtml = `<pre><table>${withLineNumbers}</table></pre>`;
				utils.strToFile(targetPath, wrappedHtml);
			}
		}
	}
};

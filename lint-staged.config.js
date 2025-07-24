module.exports = {
  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js|jsx)': (filenames) => [
    `npx eslint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  // Prettify only Markdown, JSON, CSS, SCSS, HTML files
  '**/*.(md|json|css|scss|html)': (filenames) => [
    `npx prettier --write ${filenames.join(' ')}`,
  ],
};
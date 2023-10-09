const path = require('path');
const sass = require('node-sass');
const fs = require('fs-extra');

const srcPath = path.join(__dirname, 'src');
const outputDir = path.join(__dirname, 'build');

// Compile SCSS files
sass.render(
    {
        file: path.join(srcPath, 'index.scss'), // Entry SCSS file
        outFile: path.join(outputDir, 'index.css'), // Output CSS file
        sourceMap: true,
    },
    (error, result) => {
        if (!error) {
            // Create the output directory if it doesn't exist
            fs.ensureDirSync(outputDir);
            // Write the compiled CSS to the output file
            fs.writeFileSync(path.join(outputDir, 'index.css'), result.css.toString());
            // Write the source map file
            fs.writeFileSync(path.join(outputDir, 'index.css.map'), result.map.toString());
        } else {
            console.error(error);
        }
    }
);
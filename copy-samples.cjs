// Creates a minimal PNG with visible text pattern or helper
const fs = require('fs');

// We also copy sample files to public/samples
fs.copyFileSync('samples/lecture-neuroscience.txt', 'public/samples/lecture-neuroscience.txt');
fs.copyFileSync('samples/cellular-biology.md', 'public/samples/cellular-biology.md');
console.log('Sample files mirrored to public/samples');

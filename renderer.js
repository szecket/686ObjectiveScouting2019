// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {webFrame} = require('electron')

// Set the zoom factor to 200%
webFrame.setZoomFactor(0.95);

var includeFolder = require('include-folder');


module.exports = includeFolder(__dirname.replace(/\\/g,"/") +"/../templates" );

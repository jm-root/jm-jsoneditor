var jmcommon = require('jm-common');
var utils = jmcommon.utils;
var fs = require('fs');
var Project = require('./lib');

var root = fs.realpathSync('./examples');
var project = new Project({
    fileRoot: root + '/testfiles',
    templateRoot: root + '/templates'
});

project.load(root + '/projects/test.json');

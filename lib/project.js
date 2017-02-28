var jmcommon = require('jm-common');
var utils = jmcommon.utils;
var util = require("util");
var Node = require('./node');

var Project = function(opts){
    opts = opts || {};
    Node.call(this, null, opts);
    this.fileRoot = opts.fileRoot || './';
    this.templateRoot = opts.templateRoot || this.fileRoot;
};

util.inherits(Project, Node);

var prototype = Project.prototype;

module.exports = Project;

/*
* 加载编辑器配置信息, 步骤
*
* １，读取fileName 保存到data
* ２，定义nodes数组，把data.nodes中的每个配置项目重新包装为节点
*     格式为｛
*         data: 原始数据
*         nodes: [] 子节点
*     ｝
*
* 参数 fileName 项目文件名称
*
* */
prototype.load = function(fileName, opts){
    opts = opts || {};
    var data = utils.readJsonSync(fileName);
    this.data = data;
    this.loadNodes(data);
    return this;
};



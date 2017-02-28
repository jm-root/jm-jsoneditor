var jmcommon = require('jm-common');
var utils = jmcommon.utils;

var Node = function(projectOrNode, opts){
    if(opts){
        utils.clone(opts, this);
    }
    if(!projectOrNode) return;
    var parent = null;
    var project = projectOrNode;
    if(project.parent){
        parent = project;
        project = parent.project;
    }
    this.parent = parent;
    this.project = project;
};

var prototype = Node.prototype;

module.exports = Node;

/*
* 加载编辑器配置信息, 步骤
*
* １，读取root.json 保存到数组ｖ
* ２，定义root数组，把ｖ中的每个配置项目重新包装为节点
*     格式为｛
*         data: 原始配置数据
*         rules: {}
*         types: {}
*         templates: {}
*     ｝
* ３,针对每个root中的节点进行processNode处理
*
* 参数 appName 项目名称
*      fileName 目标文件名称， 如果不为空，会返回正对此目标文件的配置信息，否则以数组形式返回全部配置信息
* */
prototype.load = function(opts){
    if(!opts) return this;
    this.data = opts;

    if(opts.fileName){
        this.loadTarget();
    }

    this.loadTemplates();

    return this;
};

/*
* 加载模板信息，保存到节点的rules中，　如果有多个模板，　则进行合并
* 每条rule包装成新的节点对象，其格式同root中的节点格式类似，　只是去掉了rules和template对象
*
* */
prototype.loadTemplates = function(){
    var templates = this.data.templates;
    if(!templates) {
        return this;
    }
    for(var i in templates) {
        var t = templates[i];
        var filename = this.project.templateRoot + '/' + t + '.json';
        var o = utils.readJsonSync(filename);
        this.loadNodes(o);
    }
    return this;
};

prototype.hasTag = function(tag){
    var tags = this.data.tags;
    if(!tags) return false;
    return tags.indexOf(tag) != -1;
};

prototype.findNodeByFileName = function(fileName){
    if(!fileName) return null;
    var nodes = this.nodes;
    for(var key in nodes){
        var node = nodes[key];
        if(node.data.fileName == fileName){
            return node;
        }
    }
    return null;
};

prototype.loadNodes = function(opts){
    var nodes = this.nodes || {};
    if(!opts) {
        return this;
    }
    for(var key in opts){
        var node = new Node(this);
        node.load(opts[key]);
        nodes[key] = node;
    }
    this.nodes = nodes;
    return this;
};

prototype.loadTarget = function(){
    var fileName = this.data.fileName;
    if(fileName){
        fileName = this.project.fileRoot + '/' + fileName;
        this.target = utils.readJsonSync(fileName);
    }
    return this;
};

prototype.saveTarget = function(){
    var fileName = this.data.fileName;
    if(fileName){
        fileName = this.project.fileRoot + '/' + fileName;
        utils.writeJsonSync(fileName, this.target);
    }
    return this;
};

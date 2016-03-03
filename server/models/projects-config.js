var mongoose = require('mongoose');
var ProjectConfigSchema = require('../schemas/projects-config');
var ProjectConfigModel = mongoose.model('projects', ProjectConfigSchema);

module.exports = ProjectConfigModel;
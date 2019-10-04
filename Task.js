let mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    id: String,
    text: String,
    checked: Boolean
});


module.exports = mongoose.model('Task', taskSchema);
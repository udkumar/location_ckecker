// Mongoose import
var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);
mongoose.connect('mongodb://localhost/myLocation');
// Mongoose Schema definition
var UserLocationsSchema = new mongoose.Schema({
    username: String,
    location: String,
    date: { type: Date, default: Date.now }
});
// Mongoose Model definition
var UserLocations = mongoose.model('user_locations', UserLocationsSchema);
module.exports = {
  UserLocations: UserLocations
};
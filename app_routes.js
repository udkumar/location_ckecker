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
module.exports = function(app){
    app.get('/saveLocation', function (req, res) {
        var username = req.query.username;
        var location = req.query.location;
        var date = Date.now();
        if(username !== '' && location !== ''){
            var userLocations = new UserLocations({
                'username': username,
                'location': location,
                'date': date
            });
            userLocations.save(function(err, userLocations) {
                if (err){
                    console.log(err);
                    res.json({status: 403, message: 'Error: '+err});
                }
                else{
                    console.dir(userLocations);
                    res.json({status:200, message: 'User Location data Saved'});
                }
            });
        } else {
            res.json({status: 403, message: 'No username or location'});
        }
    });
    app.get('/getLocations', function (req, res) {
        console.log(req.query);
        var username = (req.query.username)?req.query.username:'';
        var location = (req.query.location)?req.query.location:'';
        var searchDate = {};
        if(username !== '' && location !== '')
            searchDate = {username: username,location:location};
        else
            searchDate = { $or:[{username: username}, {location:location}]};
        UserLocations.find(searchDate, {_id:0,username:1,location:1,date:1}, function(err, docs) {
            if (err){
                console.location(err);
                res.json({status: 403, mssage: 'Error: '+err});
            }else{
                console.dir(docs.length);
                res.json({status:200, data: docs});
            }
        });
    });
};
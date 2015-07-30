var UserLocations = require('./Model').UserLocations;
var utilApi = require('./utilities.js');
module.exports = function(app){
    //Save the location os user by username and location
    app.get('/saveLocation', function (req, res) {

        var username = req.query.username;
        var location = req.query.location;
        var date = utilApi.getDateTime(new Date());
        if(username && location){
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
                    res.json({status:200, message: 'User Location data Saved'});
                }
            });
        } else {
            res.json({status: 403, message: 'No username or location'});
        }
    });
    //get location data by username or location or both
    app.get('/getLocations', function (req, res) {
        console.log(req.query);
        var username = req.query.username;
        var location = req.query.location;
        var searchDate = {};
        if(!username && !location)
            res.json({status: 403, message: 'No username and location'});
        else{
            if(username && location)
                searchDate = {username: username,location:location};
            else if(username)
                searchDate = {username: username}
            else if(location)
                searchDate = { location:location };
            UserLocations.find(searchDate, {_id:0,username:1,location:1,date:1}, {sort: {date: -1}}, function(err, docs) {
                if (err){
                    console.log(err);
                    res.json({status: 403, message: 'Error: '+err});
                }else{
                    res.json({status:200, data: docs});
                }
            });
        }
    });
    app.get('/', function (req, res){
        res.send('Connected');
    });
};
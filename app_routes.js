var UserLocations = require('./Model').UserLocations;
var utilApi = require('./utilities.js');
module.exports = function(app){
    //Save the location os user by username and location
    app.get('/saveLocation', function (req, res) {
        //getting params urom url send by Get method
        var username = req.query.username;
        var location = req.query.location;
        var date = utilApi.getDateTime(new Date());
        if(username && location){
            var userLocations = new UserLocations({     //create an initilize object of UserLocations Model
                'username': username,
                'location': location,
                'date': date
            });
            userLocations.save(function(err, userLocations) {   //save data to db
                if (err){               //Mongo Error
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
        var searchDate = {};                //what need to search
        var projectData = {_id:0, __v:0};   //what now to retrive from db
        if(!username && !location)          // Sent Error Message of nothing is available
            res.json({status: 403, message: 'No username and location'});
        else{
            if(username){
                searchDate = {username: username};
                projectData.username = 0;           //dont show username if search by username param
            }
            else if(location){
                searchDate = { location:location }; //dont show location if search by location param
                projectData.location = 0;
            }
            //seach data sort by time
            UserLocations.find(searchDate, projectData, {sort: {date: -1}}, function(err, docs) {
                if (err){               //Mongo error
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
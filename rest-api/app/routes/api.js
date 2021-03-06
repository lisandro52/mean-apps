var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

//super secret for creating tokens
var superSecret = config.secret;

module.exports = function (app, express) {

    //get an instance of the express router
    var apiRouter = express.Router();


    apiRouter.post('/authenticate', function (req, res) {
    
        //find the user
        //select the name username and password explicitly
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

            if (err) throw err;
        
            //no user with that username
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong username/password'
                });
            } else if (user) {
            
                //check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong username/password'
                    });
                } else {
                    //if user is found and password is right
                    //create a token
                    var token = jwt.sign({
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                            expiresInMinutes: 1440 //expires in 24 hours
                        });
                
                    //return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });


    //middleware to use for all requests
    apiRouter.use(function (req, res, next) {
    
        //check header on url parameters or post parameters for token
        var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    
        //decode token
        if (token) {

            //verifies secret and checks exp
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token'
                    });
                } else {
                    //if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next();
                }
            });
        } else {

            //if there is no toekn
            //return an HTTP response of 403 (access forbidden) and an error message
            return res.status(403).send({
                success: false,
                message: 'No token provided'
            });

        }
    });
    
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    //on routes that end in /users
    apiRouter.route('/users')

        .post(function (req, res) {
    
        //create a new instance of the User model
        var user = new User();
    
        //set the users information (comes from the request)
    
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.save(function (err) {
            if (err) {
                //duplicate entry
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already existe' });
                else
                    return res.send(err);
            }

            res.json({ message: 'User created!' });
        });
    })
        .get(function (req, res) {
        User.find(function (err, users) {
            if (err) res.send(err);
        
            //return the users
            res.json(users);
        });
    });


    //on routes that end in /users/:user_id
    apiRouter.route('/users/:user_id')

    //get the user with that id
    // accessed at GET
        .get(function (req, res) {

        User.findById(req.params.user_id, function (err, user) {
            if (err) res.send(err);
        
            //return the user
            res.json(user);
        });

    })

        .put(function (req, res) {

        User.findById(req.params.user_id, function (err, user) {

            if (err) res.send(err);
        
            //upadte the users info only if its new
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
        
            //save the user
            user.save(function (err) {
                if (err) res.send(err);
            
                //return a message
                res.json({ message: 'User updated!' });
            });
        });
    })

        .delete(function (req, res) {
        User.remove({
            _id: req.params.user_id
        }, function (err, user) {
                if (err) return res.send(err);

                res.json({ message: 'Successfully deleted' });
            });

    });

    return apiRouter;

};
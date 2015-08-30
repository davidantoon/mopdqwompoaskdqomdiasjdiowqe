(function(angular) {
    // 'use strict';
    angular.module('IntelLearner').factory('User', ['$rootScope', '$http', 'Server', '$httpR',
        function($rootScope, $http, Server, $httpR) {

            function User(tempJson, UID, firstName, lastName, username, email, profilePicture, role, token) {
                if (tempJson) {
                    this.UID = tempJson.UID;
                    this.firstName = tempJson.FIRST_NAME;
                    this.lastName = tempJson.LAST_NAME
                    this.username = tempJson.USERNAME;
                    this.email = tempJson.EMAIL;
                    this.creationDate = new Date(tempJson.CREATION_DATE);
                    this.profilePicture = tempJson.PROFILE_PICTURE;
                    this.role = tempJson.ROLE;
                    this.token = tempJson.token;

                } else {
                    this.UID = UID;
                    this.firstName = firstName;
                    this.lastName = lastName
                    this.username = username;
                    this.email = email;
                    this.creationDate = new Date();
                    this.profilePicture = profilePicture;
                    this.role = role;
                    this.token = token;
                }
            }


            /**
             * Connets with server, check the entered username and password for login
             * @param {String} username username
             * @param {String} Password password
             * @return {User} return null if wrong info, else User Object
             */
            User.login = function(username, password, callback) {
                try {
                    if (username == "dummy" && password == "dummy") {
                        // dummy login
                        console.warn("Logged as dummy user");
                        var dummyUSer = new User(null, "David", "Antoon", username, "david.antoon@hotmail.com", "https://graph.facebook.com/100003370268591/picture", "Learner");
                        dummyUSer.updateCookies(function(success, error) {
                            if (error || !success) {
                                console.error("error logging in dummy", error);
                                callback(null, error);
                            } else {
                                callback(dummyUSer);
                                return;
                            }
                        });
                    } else {
                        var data = {
                            "username": username,
                            "password": password
                        };
                        $httpR.connectToServer(data, $httpR.logIn, function(result, error) {
                            if (result) {
                                console.log("connectToServer response: ", result);
                                var newUser = new User(result);
                                newUser.updateCookies(function(success, error) {
                                    if (success) {
                                        console.log("updateCookies response: ", success);
                                        callback(newUser);
                                        return;
                                    } else {
                                        console.error("could not update cookies: ", error)
                                        callback(null, error);
                                    }
                                });
                            } else {
                                console.error("error logging in: ", error);
                                callback(null, error);
                            }
                        });
                    }
                } catch (e) {
                    console.error("error logging in: ", e);
                    callback(null, e);
                }
            }

            /**
             * registers for the server
             * @param  {String}   firstName      first name
             * @param  {String}   lastName       last name
             * @param  {String}   username       username
             * @param  {Strinf}   password       password
             * @param  {String}   email          E-mail
             * @param  {String}   profilePicture profile picture link
             * @param  {String}   role           what is the role of the user
             * @param  {Function} callback       callback function
             */
            User.singup = function(firstName, lastName, username, password, email, profilePicture, role, callback) {
                try {
                    var data = {
                        firstName: firstName,
                        lastName: lastName,
                        username: username,
                        email: email,
                        password: password,
                        profilePicture: profilePicture,
                        role: role
                    };
                    $httpR.connectToServer(data, $httpR.signUp, function(result, error) {
                        if ((result) && error != null) {
                            var newUser = new User(result);
                            newUser.updateCookies(function(success, error) {
                                if (error || !(success)) {
                                    callback(null, error);
                                } else {
                                    callback(newUser);
                                    return;
                                }
                            });
                        } else {
                            console.error("error signing up: ", error);
                            callback(null, error);
                        }
                    });
                } catch (e) {
                    console.error("error signing up: ", e);
                    callback(null, e);
                }
            }
            User.prototype = {

                /**
                 * saves user object in local storage
                 * @return {[type]}      [description]
                 */
                updateCookies: function(callback) {
                    try {
                        localStorage.setItem("com.intel.user", this.toJSON());
                        callback(true);
                    } catch (e) {
                        callback(null, false);
                    }
                },

                /**
                 * removes user from local storage
                 */
                removeCookies: function() {
                    localStorage.removeItem("com.intel.user");
                },
                /**
                 * Changes the password for the use
                 * @param  {String} newPassword new password
                 */
                changePassword: function(oldpassword, newPassword, callback) {
                    try {
                        debugger;
                        var data = {
                            Token: this.token,
                            password: oldpassword,
                            new_password: newPassword
                        }
                        $httpR.connectToServer(data, $httpR.changePassword, function(success, error) {
                            if (error || !success) {
                                console.error("could not change password: ", error);
                                callback(null, error);
                            } else {
                                callback(success);
                            }
                        });
                    } catch (e) {
                        console.error("could not change password: ", e);
                        callback(null, error);
                    }
                },

                /**
                 * Updates the user information
                 * @param  {string}   firstName      first name
                 * @param  {string}   lastName       last name
                 * @param  {string}   email          email
                 * @param  {string}   profilePicture picture link
                 * @param  {string}   role           role of the user
                 * @param  {Function} callback       callback function
                 */
                updateUser: function(firstName, lastName, email, profilePicture, role, callback) {
                    try {
                        var data = {
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            profilePicture: profilePicture,
                            role: role
                        }
                        $httpR, connectToServer(data, $httpR.updateUser, function(success, error) {
                            if (error || !success) {
                                console.error("could not update data: ", error);
                                callback(null, error);
                            } else {
                                this.firstName = success["firstName"];
                                this.lastName = success["lastName"];
                                this.email = success["email"];
                                this.profilePicture = success["profilePicture"];
                                this.role = success["role"];
                                callback(this);
                            }
                        });
                    } catch (e) {
                        console.error("could not update data: ", error);
                        callback(null, e);
                    }
                },

                /**
                 * Gets the user's workspace from server (include settings and steps)
                 * @return {[type]} [description]
                 */
                getMyWorkspace: function(callback) {
                    try {

                    } catch (e) {

                    }
                },

                /**
                 * Save user's workspace in server (include settings and steps)
                 * @return {[type]} [description]
                 */
                setMyWorkspace: function(callback) {
                    try {

                    } catch (e) {

                    }
                },

                toJSON: function() {
                    try {
                        return {
                            "UID": this.UID,
                            "firstName": this.firstName,
                            "lastName": this.lastName,
                            "username": this.username,
                            "email": this.email,
                            "creationDate": this.creationDate,
                            "profilePicture": this.profilePicture,
                            "role": this.role,
                            "token": this.token
                        }
                    } catch (e) {
                        $rootScope.currentScope.Toast.show("Error!", "There was an error in converting to JSON", Toast.LONG, Toast.ERROR);
                        console.error("toJson: ", e);
                        return null;
                    }
                }
            }
            return User;
        }
    ]);
})(window.angular);
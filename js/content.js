(function(angular) {
    // 'use strict';
	angular.module('IntelLearner').factory('Content', ["$rootScope", 'Globals', "Toast", "Server", "$httpR","Log", function($rootScope, Globals, Toast, Server, $httpR, Log){
	
		function Content(conData, forceLastmodefied, forceServerPull){
			try{
				this.id = ((conData != undefined)?conData.id:'');
				this.name = ((conData != undefined)?conData.name:''); // Term STRING
				this.kBitsNeeded = ((conData != undefined)?conData.kBitsNeeded:[]);
				this.kBitsProvided = ((conData != undefined)?conData.kBitsProvided:[]);
				this.terms = ((conData != undefined)?conData.terms:[]);
				this.description = ((conData != undefined)?conData.description:''); // Term MEANING
				this.url = ((conData != undefined)?conData.url:'');  
				this.locked = ((conData != undefined)?conData.locked:false);
				this.lockedBy = ((conData != undefined)?conData.lockedBy:null);
				this.lastModified = ((conData != undefined)?conData.lastModified:null);
				this.inProgress = ((conData != undefined && conData.inProgress)?conData.inProgress:false);
				this.type = ((conData != undefined)?conData.type:null);
				this.termScope = ((conData !=undefined)?conData.termScope: null);
				this.linkType = ((conData !=undefined)?conData.linkType: null);
				this.connectToDataBase = ((this.type && new Server(this.type, $rootScope.currentScope.isDummy)) || null);
				this.progressWizard = ((conData != undefined)?conData.progressWizard:{});
				this.newData = ((conData != undefined)?conData.newData:null);
				if(!this.progressWizard){
					this.progressWizard = {};
				}
				this.revision = ((conData != undefined)?conData.revision:1);
			}catch(e){
				$rootScope.currentScope.Toast.show("Error!","There was an error in creating new Content", Toast.LONG, Toast.ERROR);
	            Log.e("Content","Content", e);
	            return null;
			}
		}

		

		Content.prototype = {

			objectType: "Content",
			/**
			 * Lock Object in the server to prevent others to edit (Readonly)
			 * @param  {Function} callback Function called after execute object method. Return success/error result
			 */
			lock: function(callback){
				try{

					var dataToSend = {};
					dataToSend[this.type.toLowerCase()+"UID"] = this.id;
					var passThis = this;
					$httpR.connectToServer(dataToSend, this.type.toUpperCase() + "beginEdit", Globals, function(success, error){
						if(error && !success){
							Log.e("Content","lock", "Error locking object", error, passThis);
							if(error.statusText && error.statusText == "timeout")
								callback(1);
							else
								callback(false);
						}else{
							Log.d("Content","lock", "Object locked", success, passThis);
							passThis.locked = true;
							passThis.lockedBy = Globals.CurrentUser;
							callback(true);
						}
					});
				}catch(e){
	           		Log.e("Content","lock", "Error saving object as editing mode", error, this);
	           		callback(false);
				}
			},

			/**
			 * Create copy of object to begin editing
			 */
			createTempData: function(){
				this.newData = {
					"name": this.name,
					"description": this.description,
					"url": this.url,
					"kBitsNeeded": [],
					"kBitsProvided": [],
					"terms": []
				};
				if(this.type == "Delivery"){
					// loop in kBitsNeeded
					for(var i=0; i<this.kBitsNeeded.length; i++){
						this.newData.kBitsNeeded.push(this.kBitsNeeded[i]);
					}
					// loop in kBitsProvided
					for(var i=0; i<this.kBitsProvided.length; i++){
						this.newData.kBitsProvided.push(this.kBitsProvided[i]);
					}
				}
				// loop in terms
				for(var i=0; i<this.terms.length; i++){
					this.newData.terms.push(this.terms[i]);
				}
			},



			modifyContent: function(keepSpinner){
				switch(this.type){
					case "Delivery":
						this.name = this.newData.name;
						this.description = this.newData.description;
						this.url = this.newData.url;
						this.kBitsNeeded = this.newData.kBitsNeeded;
						this.kBitsProvided = this.newData.kBitsProvided;
						this.terms = this.newData.terms;
					break;
					case "Kbit":
						this.name = this.newData.name;
						this.description = this.newData.description;
						this.url = this.newData.url;
						this.terms = this.newData.terms;
					break;
					default:
					break;
				}
			},

			/**
			 * Save Object to server as (DEBUG MODE)
			 * @param  {String}   versionNotes Note about updated object
			 * @param  {Function} callback Function called after execute object method. Return success/error result
			 */
			save: function(versionNotes, callback){
				try{
					this.modifyContent();
					var passThis = this;
					this.connectToDataBase.saveElement(passThis, function(success, error){
						if(error || !success){
							Log.e("Content","save", "Error saving object as editing mode", error, passThis);
							callback(false);
						}else{
							Log.d("Content","save", "Object saved as editing mode", success, passThis);
							callback(true);
						}
					});
				}catch(e){
					Log.e("Content","save", "Error saving object as editing mode", error, this);
	            	callback(false);
	            }
			},

			/**
			 * Save Object to server as (PRODUCT MODE) and Unlock it
			 * @param  {String}   versionNotes Note about updated object
			 * @param  {Function} callback     Function called after execute object method. Return success/error result
			 */
			release: function(versionNotes, callback){
				try{
					if(this.type != "Term"){
						var data = {};
						var passThis = this;
						data[this.type.toLowerCase()+"UID"] = this.id;
						$httpR.connectToServer(data,  this.type.toUpperCase()+ "publish", Globals, function(success, error){
							if(error || !success){
								passThis.progressWizard = {};
								passThis.newData = {};
								Log.e("Content", "Release", "Error releaseing object from editing", error, passThis);
								callback(false);
							}else{
								passThis.progressWizard = {};
								passThis.newData = {};
								passThis.lastModified = +(new Date());
	                            passThis.locked = false;
	                            passThis.lockedBy = {};
								Log.d("Content","Release", "Object released from editing", success, passThis);
								callback(true);
							}
						});
					}else{
						Log.e("Content", "Release", "Bad Content Type", this, passThis);
					}
				}catch(e){
	           		Log.e("Content", "Release", "Error releaseing object from editing", e, this);
				}
			},


			revoke: function(versionNotes, callback){
				try{
					var data = {};
					var passThis = this;
					data[this.type.toLowerCase()+"UID"] = this.id;
					$httpR.connectToServer(data,  this.type.toUpperCase()+ "cancelEdit", Globals, function(success, error){
						if(error || !success){
							Log.e("Content", "revoke", "Error revoking object to original", error, passThis);
							callback(false);
						}else{
							Log.d("Content","revoke", "Object revoked to original", success, passThis);
							callback(ngScope.objectServerToClient(success));
						}
					});

				}catch(e){
					Log.e("Content", "revoke", "Error revoking object to original", error, this);
	            	callback(false);
	            }
			},

			/**
			 * Remove object from server database
			 * @param  {Boolran}  includePreviousVersions TRUE to remove object and it's history versions (NOT RECOMMENDED)
			 * @param  {Function} callback                Function called after execute object method. Return success/error result
			 */
			remove: function(includePreviousVersions, callback){
				try{

				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in removing content", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","remove", e);
				}
			},

			/**
			 * Restore object data from previous versions by versionId
			 * @param  {string}   versionId The version id of previous version to restore
			 * @param  {Function} callback  Function called after execute object method. Return success/error result
			 */
			reversion: function(versionId, callback){
				try{

				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in restoring content", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","reversion", e);
				}
			},

			/**
			 * Get list of previous version (id, dateAdded, notes)
			 * @param  {Function} callback Function called after execute object method. Return success/error result
			 */
			getVersions: function(callback){
				try{

				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in getting previous versions", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","getVersions", e);
				}
			},

			/**
			 * Override to operator "=="
			 * @param  {Content} contentObj Content object to compare with
			 * @return {Boolean} If this object is the same as passed object
			 */
			equals: function(contentObj){
				try{
					return (this.id == contentObj.id);
				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in checking equal content", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","equal", e);
	           		return false;
				}
			},

			/**
			 * Override to operator "=" without pointer
			 * @param  {Content} contentObj Content
			 * @return {[type]}            [description]
			 */
			dublicate: function(contentObj){
				try{
					return new Content(contentObj);
				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in dublicating content", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","dublicate", e);
	           		return null;
				}
			},

			/**
			 * Override toString default 
			 * @return {String} return json stringify
			 */
			toString: function(){
				try{	
					return JSON.stringify(this.toJson());
				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in converting to string", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","toString", e);
	           		return null;
				}
			},
			toJson: function(){
				try{
					return {
						"id": this.id,
						"name": this.name,
						"kBitsNeeded": this.kBitsNeeded,
						"kBitsProvided": this.kBitsProvided,
						"terms": this.terms,
						"description": this.description,
						"url": this.url,
						"locked": this.locked,
						"lockedBy": this.lockedBy,
						"lastModified": this.lastModified,
						"inProgress": this.inProgress,
						"type": this.type,
						"termScope": this.termScope,
						"objectType": this.objectType,
						"progressWizard": this.progressWizard,
						"newData": this.newData,
						"linkType": this.linkType,
						"revision": this.revision
					}
				}catch(e){
					$rootScope.currentScope.Toast.show("Error!","There was an error in converting to JSON", Toast.LONG, Toast.ERROR);
	           		Log.e("Content","toJson", e);
	           		return null;
				}
			},

			toJsonSteps: function(){
				return {
					"id": this.id,
					"type": this.type,
					"progressWizard": this.progressWizard,
					"newData": this.newData,
					"inProgress": this.inProgress
				}
			},

			toJsonDeliveryServer: function(){
				try{
					var tempJSON = {
						"UID": this.id,
						"TITLE": this.name,
						"DESCRIPTION": this.description,
						"KBITS": {
							"NEEDED": [], // this.kBitsNeeded
							"PROVIDED": [], // this.kBitsProvided
							"OTHERS": []
							
						},
						"TERMS": [], // this.terms
						"FRONT_DELIVERY": {
							"FRONT_TYPE": "DELIVERY_FRONT",
							"PATH": this.url
						}
					}
					for(var i=0; i<this.kBitsNeeded.length; i++){
						tempJSON.KBITS.NEEDED.push(Number(this.kBitsNeeded[i].id));
					}
					for(var i=0; i<this.kBitsProvided.length; i++){
						tempJSON.KBITS.PROVIDED.push(Number(this.kBitsProvided[i].id));
					}
					for(var i=0; i<this.terms.length; i++){
						tempJSON.TERMS.push(Number(this.terms[i].id));
					}
					return tempJSON;
				}catch(e){
	           		Log.e("Content","toJson", e);
	           		return null;
				}
			},

			toJsonKbitServer: function(){
				var tempJSON = {
					"UID": this.id,
					"TITLE": this.name,
					"DESCRIPTION": this.description,
					"TERMS": [], // this.terms
					"FRONT_KBIT": {
						"FRONT_TYPE": "KBIT_FRONT",
						"PATH": this.url
					}
				}
				for(var i=0; i<this.terms.length; i++){
					tempJSON.TERMS.push(Number(this.terms[i].id));
				}
				return tempJSON;
			},
			/**
			 * Gets difference in kbits needed
			 * @param  {ArraY} oldArray old kbits needed array
			 * @param  {Array} newArray new kbits needed array
			 * @return {object}         object contains the deleted and inserted
			 */
			getDiffKbitsNeeded: function(){
				return {
	                "deleted":(this.kBitsNeeded.filter(function(a) {
	                    var found = false;
	                    for(var i=0; i<this.newData.length ;i++){
	                        if(this.newData[i].id == a.id){
	                            found = true;
	                        }
	                    }
	                    return (!found);
	                })),
	                "inserted":(this.newData.filter(function(a) {
	                    var found = false;
	                    for(var i=0; i<this.kBitsNeeded.length ;i++){
	                        if(this.kBitsNeeded[i].id == a.id){
	                            found = true;
	                        }
	                    }
	                    return (!found);
	                }))
            	}
			},

			/**
			 * Gets difference in kbits provided
			 * @param  {ArraY} oldArray old kbits needed array
			 * @param  {Array} newArray new kbits needed array
			 * @return {object}         object contains the deleted and inserted
			 */
			getDiffKbitsProvided: function(){
				return {
	                "deleted":(this.kBitsProvided.filter(function(a) {
	                    var found = false;
	                    for(var i=0; i<this.newData.length ;i++){
	                        if(this.newData[i].id == a.id){
	                            found = true;
	                        }
	                    }
	                    return (!found);
	                })),
	                "inserted":(this.newData.filter(function(a) {
	                    var found = false;
	                    for(var i=0; i<this.kBitsProvided.length ;i++){
	                        if(this.kBitsProvided[i].id == a.id){
	                            found = true;
	                        }
	                    }
	                    return (!found);
	                }))
            	}
			}

		}


		return Content;
	}]);
})(window.angular);







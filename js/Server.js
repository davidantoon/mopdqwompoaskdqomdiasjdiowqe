app.factory('Server', function(){
	
	function Server(connectionType){
		this.baseUrl = "dummy";
		this.searchQuery = "dummy";
		this.getElemQuery = "dummy";
		this.saveObjectQuery = "dummy";
		this.TypeOfData = connectionType;
	}

	Server.prototype = {

		/**
		 * Search element in server
		 * @param  {string}   searchText The text we are going to search
		 * @param  {Function} callback   callback function
		 */
		searchElement: function(dataToSeach, callback){
			if(this.baseUrl == "dummy"){
				switch (dataToSeach.dataType){
					case 0:
						var KbitsDB = JSON.parse(localStorage.getItem("com.intel.Server.Kbits"));
						for (var i = KbitsDB.length - 1; i >= 0; i--) {
							switch (dataToSeach.searchBy){
							case 0:
								if( KbitsDB[i].name.toLowerCase() == dataToSeach.text.toLowerCase() ){
									callback(KbitsDB[i], null);
									return;
								}
							break;
							case 1:
								if( contains( KbitsDB[i].description, dataToSeach.text) ){
									callback(KbitsDB[i], null);
									return;
								}
							break;
							case 2:
								if( KbitsDB[i].id.toLowerCase() == dataToSeach.text.toLowerCase() ){
									callback(KbitsDB[i], null);
									return;
								}
							break;
							}
						}
					case 1:
					var deliveryDB = JSON.parse(localStorage.getItem("com.intel.Server.delivery"));
						for (var i = deliveryDB.length - 1; i >= 0; i--) {
							switch (dataToSeach.searchBy){
							case 0:
								if( deliveryDB[i].name.toLowerCase() == dataToSeach.text.toLowerCase() ){
									callback(deliveryDB[i], null);
									return;
								}
							break;
							case 1:
								if( contains( deliveryDB[i].description, dataToSeach.text) ){
									callback(deliveryDB[i], null);
									return;
								}
							break;
							case 2:
								if( deliveryDB[i].id.toLowerCase() == dataToSeach.text.toLowerCase() ){
									callback(deliveryDB[i], null);
									return;
								}
							break;
							}
						}
					break;
					case 2:
					var termsDB = JSON.parse(localStorage.getItem("com.intel.Server.terms"));
						for (var i = termsDB.length - 1; i >= 0; i--) {
							switch (dataToSeach.searchBy){
							case 0:
								if( termsDB[i].name.toLowerCase() == dataToSeach.text.toLowerCase() ){
									callback(termsDB[i], null);
									return;
								}
							break;
							case 1:
								if( termsDB[i].description.toLowerCase() == dataToSeach.text.toLowerCase()) ){
									callback(termsDB[i], null);
									return;
								}
							break;
							case 2:
								if( termsDB[i].id.toLowerCase() == dataToSeach.text.toLowerCase() ){
									callback(termsDB[i], null);
									return;
								}
							break;
							}
						}
					break;
				}
			}else{
				$.ajax({
					url: baseUrl+searchQuery,
					type: 'GET',
					dataType: 'Content-Type: application/json',
					data: {text: searchText},
					success: function(res){
						callback(res);
					},
					error: function(err){
						callback("Error");
					}
				});
			}
		},

		/**
		 * Saves data to server
		 * @param {object}   obj      object we are going to save
		 * @param {Function} callback callback function
		 */
		
		// deleviry , settings, kbits,steps, 
		saveElement: function(obj, callback){

			if(this.saveObjectQuery == "dummy"){

				switch (this.TypeOfData){
					case "Deliveries":
						var deliveryDB = JSON.parse(localStorage.getItem("com.intel.Server.delivery"));
						deliveryDB.push(obj);
						localStorage.removeItem("com.intel.Server.delivery");
						localStorage.setItem("com.intel.Server.delivery", JSON.stringify(deliveryDB));
						callback({"message":"delivery saved correctly","code":""} ,null);
					break;
					case "kbits":
						var kbitsDB = JSON.parse(localStorage.getItem("com.intel.server.kbits"));
						kbitsDB.push(obj);
						localStorage.removeItem("com.intel.server.kbits");
						localStorage.setItem("com.intel.server.kbits", JSON.stringify(kbitsDB));
						callback({"message":"kbits saved correctly","code":""}, null);
					break;
					case "settings":
						var settingsDB = JSON.parse(localStorage.getItem("com.intel.server.settings"));
						settingsDB.push(obj);
						localStorage.removeItem("com.intel.server.settings");
						localStorage.setItem("com.intel.server.settings", JSON.stringify(settingsDB));
						callback({"message":"settings saved correctly","code":""}, null);
					break;
					case "steps":
						// var stepsDB = JSON.parse(localStorage.getItem("com.intel.server.steps"));
						localStorage.removeItem("com.intel.server.steps");
						localStorage.setItem("com.intel.server.steps", JSON.stringify(obj));
						callback({"message":"steps saved correctly","code":""}, null);
					break;
					case "Terms":
						var termsDB = JSON.parse(localStorage.getItem("com.intel.server.terms"));
						termsDB.push(obj);
						localStorage.removeItem("com.intel.server.terms");
						localStorage.setItem("com.intel.server.terms", JSON.stringify(termsDB));
						callback({"message":"term saved correctly","code":""}, null);
					break;
					default:
						callback(null, {"message":"Could not save element","code":""});
					break;
				}
				console.warn("DUMMY REQUESTS");
			}else{
				// AJAX
			}
		},

		/**
		 * Gets element from server by ID
		 * @param  {Number}   objID    the ID of the object
		 * @param  {Function} callback callback funtion
		 * @return {object}            returns the objects we asked for
		 */
		getElementByID: function(objID, callback){
			if(saveObjectQuery == "dummy"){
			// 	return localStorage.getItem("dummy");
			// }

				switch (this.TypeOfData){
					case "delivery":
						var deliveryDB = JSON.parse(localStorage.getItem("com.intel.Server.delivery"));
						for(var i = 0; deliveryDB.length; i++){
							if(deleviry[i].id == obj.id){
								callback(deleviry[i], null);
								return;
							}
						}
						callback(null, {"message":"Object delivery not found","code":"404"});
						return;
					break;
					case "kbits":
						var kbitsDB = JSON.parse(localStorage.getItem("com.intel.server.kbits"));
						for(var i = 0; kbitsDB.length; i++){
							if(kbitsDB[i].id == obj.id){
								callback(kbitsDB[i],null);
								return;
							}
						}
						callback(null, {"message":"Object kbits not found","code":"404"});
						return;
					break;
					case "term":
						var termsDB = JSON.parse(localStorage.getItem("com.intel.server.terms"));
						for(var i = 0; termsDB.length; i++){
							if(termsDB[i].id == obj.id){
								callback(termsDB[i],null);
								return;
							}
						}
						callback(null, {"message":"Object term not found","code":"404"});
						return;
					break;
					default:
						callback(null, {"message":"Save Element func Object is not found","code":"404"});
						return;
					break;
				}
			}else{
				// AJAAAXXX
			}

		},

		/**
		 * Delete the element of the of the provided ID.
		 * @param  {Number}   objID    the object ID
		 * @param  {Function} callback callback funtion
		 */
		deleteElementByID: function(objID, callback){
			if(saveObjectQuery == "dummy"){
				localStorage.removeItem("dummy");
				callback("success",{"message": "dummy has been removed","code" : ""});
			}

			switch(this.TypeOfData){
				case "delivery":
					var deliveryDB = JSON.parse(localStorage.getItem("com.intel.server.delivery"));
					for(var i = 0; i < deliveryDB.length; i++){
						if(deliveryDB[i].id == obj.id){
							deliveryDB.splice(i,1);
							localStorage.setItem("com.intel.server.delivery",deliveryDB);
							callback({"message":"delivery has successfuly removed","code":""},null);
							return;
						}
					}
					callback(null,{"message":"could not remove delivery","code":""});
					return;
				break;
				case "kbits":
					var kbitsDB = JSON.parse(localStorage.getItem("com.intel.server.kbits"));
					for(var i = 0; i < kbitsDB.length; i++){
						if(kbitsDB[i].id == obj.id){
							kbitsDB.splice(i,1);
							localStorage.setItem("com.intel.server.kbits",kbitsDB);
							callback({"message":"kbits has successfuly removed","code":""},null);
							return;
						}
					}
					callback(null,{"message":"could not remove kbits","code":""});
					return;
				break;
				case "term":
					var termsDB = JSON.parse(localStorage.getItem("com.intel.server.term"));
					for(var i = 0; i < termsDB.length; i++){
						if(termsDB[i].id == obj.id){
							termsDB.splice(i,1);
							localStorage.setItem("com.intel.server.term",termsDB);
							callback({"message":"term has successfuly removed","code":""},null);
							return;
						}
					}
					callback(null,{"message":"could not remove term","code":""});
					return;
				break;
				default:
					callback(null, {"message":"Delete Element func Object is not found","code":"404"});
					return;
				break;
			}
		},

		/**
		 * Gets the version of the provided ID
		 * @param  {Number}   objID    the object ID
		 * @param  {Function} callback callback funtion
		 * @return {object}            the object version we need
		 */
		getVersionsByID: function(objID, callback){
			callback(null, null);
		},

		/**
		 * Gets the versions list of the provided ID
		 * @param  {Number}   objID    the object ID
		 * @param  {Function} callback callback funtion
		 * @return {list}              the object versions.
		 */
		getVersionList: function(objID, callback){
			callback(null, null);
		},

		/**
		 * Gets the steps from server.
		 * @param  {callback} callback callback funtion
		 * @return {json}              steps
		 */
		getSteps: function(callback){
			var stepsDB = localStorage.getItem("com.intel.server.steps");
			if(stepsDB == null || stepsDB == undefined){
				callback(null, {"message":"could not get steps from server", "code": ""});
				return;
			}else{
				if(stepsDB.length == 0){
					callback(null, {"message":"there is no steps in server", "code": ""});
					return;
				}
				callback(JSON.parse(stepsDB), null);
				return;
			}
		},

		/**
		 * 	------------------------------- ASK IF IT SHOULD TAKE ID TO GET SPECIFIC SETTINGS -------------------------------------
		 * Gets the settings from Server
		 * @param  {callback} callback callback function
		 * @return {json}              steps found in server
		 */
		getSettings: function(callback){
			var settingsDB = localStorage.getItem("com.intel.server.settings");
			if(settingsDB == null || settingsDB == undefined){
				callback(null, {"message":"could not get settings from server","code":""});
				return;
			}else{
				if(settingsDB.length == 0){
					callback({"message":"there is no settings in server", "code": ""}, null );
					return;
				}
				callback(JSON.parse(settingsDB), null);
				return;
			}
		}
	}
	return Server;
});


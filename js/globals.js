(function(angular) {
    'use strict';
	angular.module('IntelLearner').value('Globals', {
		CashedObjects:{},
		get: function(id, type){
			return this.CashedObjects[type+id];
		},
		set: function(obj){
			this.CashedObjects[obj.type+obj.id] = obj;
		},
		clear: function(){
			this.CashedObjects = {};
		},
		allObjectsaved: function(){
			console.warn("allObjectsaved not implemented!");
			return true;
			// var isSaved = 1;
			// for(var i=0; i<this.CashedObjects.length; i++){
			// 	isSaved *= ((this.CashedObjects[i].inProgress)?0:1);
			// }
			// return isSaved;
		},
		pop: function(id, type){
			var tempObj = this.CashedObjects[type+id];
			delete this.CashedObjects[type+id];
			return tempObj;
		},
		getMinimized: function(callback){
			var dataToRetrun = [];
			var CashedObjectsKeys =  Object.keys(this.CashedObjects);
			for(var i=0; i<CashedObjectsKeys.length; i++){
				dataToRetrun.push({
					"id": this.CashedObjects[CashedObjectsKeys[i]].id,
					"type": this.CashedObjects[CashedObjectsKeys[i]].type,
					"lastModified": this.CashedObjects[CashedObjectsKeys[i]].lastModified,
				});
			}
			callback(dataToRetrun);
		}
	})
	.value('TypeOf', {
		init: function(){
			Number.prototype.objectType = "number";
			Array.prototype.objectType = "array";
			String.prototype.objectType = "string";
			(function(){}).prototype.objectType = "function";
		},	
		get: function(obj){
			return obj.objectType;
		}
	})
	.value('ServerReq', "Not initialized");
})(window.angular);

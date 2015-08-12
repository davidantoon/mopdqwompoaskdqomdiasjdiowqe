angular.module('IntelLearner', ['onsen', 'firebase']).factory('Tab', ['content', function(content){
	
	// constant static members 
	Tab.NORMAL_TAB = 0;// Search | Create | Edit'
	Tab.SEARCH_TAB = 1;
	Tab.CREATE_TAB = 2;
	Tab.EDIT_TAB = 3;

	function Tab(id, workflow){

		if(id && workflow){
			this.parentWF = (workflow || null);
			this.ID = (id || null);
			this.title = 'Tab '+id;
			this.Type = Tab.NORMAL_TAB; /*  0 => 'Search/Create/Edit'  ||  1 => 'Search'  ||  2 => 'Create'  ||  3 => 'Edit'  */
			this.content = null;
			this.orderTab = id;
			this.dataHolding = {};
			return this;
		}else{
			throw "Id or parentWorkflow not specified!";
			return null;
		}
	}
	
	Tab.prototype = {
		/**
		 * ChangTitle will change tab title that displayed at top of workflow.
		 * @param  {String} newTitle String Object
		 */
		changeTitle: function(newTitle){
			this.title = newTitle;
		},
		/**
		 * ChangeType will change the type of tab and his status. Optional tab types:<br> 
		 * 0) NORMAL_TAB
		 * 1) SEARCH_TAB
		 * 2) CREATE_TAB
		 * 3) EDIT_TAB
		 * @param  {String} newType (Tab.NORMAL_TAB || Tab.SEARCH_TAB || Tab.CREATE_TAB || Tab.EDIT_TAB)
		 */
		changeType: function(newType){
			switch (newType){
				case Tab.SEARCH_TAB:
					this.addData({
						"searchText": "",
						"resultsCount": 0,
						"results": [],
						"selectedResult": -1
					});
				break;
				case Tab.CREATE_TAB:
					
				break;
				case Tab.EDIT_TAB:
					
				break;
				default:
				break;
			}
			this.Type = newType;
		},

		/**
		 * The dataHolding member used to manage current tab state, this function automatically called after changeType.
		 * @param {Object} dataHolding Current tab's data holding state 
		 */
		addData: function(dataHolding){
			this.dataHolding = dataHolding;
		}
		/**
		 * Get instance or create new Content object and link it to this tab
		 * @param {Content || String} contentObj if the type of passed parameter is Content then will link to this tab.
		 *                    					 if the type is String, will check global cached contents, or get from server.
		 */
		addContent: function(contentObj){

			// check if exsit

			// this.content = contentObj;
		},
		/**
		 * Get tab XY posistion in the workflow tab bar to manage responsive UI.
		 * @return {Object} Tab Position {'left': LeftPosition, 'top': TopPosition}
		 */
		getTabPos: function(){
			var parentWFPos = this.parentWF.getPosition();
			var tabPos = {
				"left": (parentWFPos.width / this.parentWF.tabs.length)/2 + parentWFPos.left,
				"top": parentWFPos.top + 15
			};
			return tabPos;
		},
	}


	return Tab;
}]);

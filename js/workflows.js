app.factory('Workflow', ['Tab', 'TypeOf', function(Tab, TypeOf){

    function Workflow(tempJson, id, fx, fy, tx, ty){
        try{
            if(tempJson != null || (id != null && fx != null && fy != null && tx != null && ty != null)){
                if (tempJson == null) {
                    this.ID = id;
                    this.fx = fx;
                    this.fy = fy;
                    this.tx = tx;
                    this.ty = ty;
                    this.name = "Workflow" + id;
                    this.tabsIds = 1;
                    this.tabs = [new Tab(0, this)];
                    this.selectedTab = this.tabs[0];
                } else if(tempJson == "newWorkflowButton"){
                    this.ID = id;
                    this.fx = fx;
                    this.fy = fy;
                    this.tx = tx;
                    this.ty = ty;
                    this.tabs = [];
                    this.tabsIds = 1;
                    this.selectedTab = null;
                    this.name = "New Workflow";
                }else {
                    this.ID = tempJson.ID;
                    this.fx = tempJson.fx;
                    this.fy = tempJson.fy;
                    this.tx = tempJson.tx;
                    this.ty = tempJson.ty;
                    this.name = tempJson.name;
                    this.tabsIds = tempJson.tabsIds;
                    this.tabs = [];
                    for (var i = 0; i < tempJson.tabs.length; i++) {
                        var tempTab = new Tab(null, this, tempJson.tabs[i]);
                        this.tabs.push(tempTab);
                        if(tempJson.selectedTab.ID == tempJson.tabs[i].ID){
                            this.selectedTab = tempTab;
                        }
                    }

                }
            }else{
                throw "Id or parentWorkflow not specified!";
                return null;
            }
        }catch(e){
            $scope.Toast.show("Error!","There was an error in creating workflow", Toast.LONG, Toast.ERROR);
            console.error("Workflow: ", e);
         }        
    }

    Workflow.prototype = {

        objectType:"Workflow",
        /**
         * Update current object with new content
         * @param  {object} tempJson Workflow object generated by toJson method
         */
        updateAllParams:  function(tempJson){
            try{ 
                this.ID = tempJson.ID;
                this.fx = tempJson.fx;
                this.fy = tempJson.fy;
                this.tx = tempJson.tx;
                this.ty = tempJson.ty;
                this.name = tempJson.name;
                this.tabs = [];
                for (var i = 0; i < tempJson.tabs.length; i++) {
                    var tempTab = new Tab(null, this, tempJson.tabs[i]);
                    this.tabs.push(tempTab);
                    if(tempJson.selectedTab.ID == tempJson.tabs[i].ID){
                        this.selectedTab = tempTab;
                    }
                }
            }catch(e){
                $scope.Toast.show("Error!","There was an error in updating workflow parameters", Toast.LONG, Toast.ERROR);
                console.error("updateAllParams: ", e);
            }
        },

        /**
         * Override "==" operator to compare between object
         * @param  {object} obj Workflow object
         * @return {Boolean}     Return True if two objects are equals
         */
        equals: function(obj){
            try{
                return (this.ID == obj.ID);
            }catch(e){
                $scope.Toast.show("Error!","There was an error in compating two worflows", Toast.LONG, Toast.ERROR);
                console.error("equals: ", e);
            }        
        },

        /**
         * Initialize new Tab object and push it to workflow tabs array
         */
        addTab: function(){
            try{
                var newTabId = this.tabsIds;
                var newTab = new Tab(newTabId, this);
                this.tabs.push(newTab);
                this.tabsIds++;
                return newTab;
            }catch(e){
                $scope.Toast.show("Error!","There was an error in adding tab to workflow", Toast.LONG, Toast.ERROR);
                console.error("addTab: ", e);
            }
        },

        /**
         * Scrolls to a specific location on the screen.
         */
        scrollTo: function(){
            try{
                var wWidth = $(window).width();
                var blockPosL = Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).position().left;
                var blockWidth = Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).outerWidth(true);
                var sLeft = blockPosL - ((wWidth - blockWidth) / 2);

                var wHeight = $(window).height();
                var blockPosT = Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).position().top;
                var blockHeight = Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).outerHeight(true);
                var sTop = blockPosT - ((wHeight - blockHeight) / 2);
                $('#BodyRow').animate({ scrollTop: sTop, scrollLeft: sLeft }, 200);
            }catch(e){
                $scope.Toast.show("Error!","There was an error in scrolling to specific location", Toast.LONG, Toast.ERROR);
                console.error("scrollTo: ", e);
            }
        },

        /**
         * Gets the position of the Workflow
         * @return {Object} The position if the Workflow
         */
        getPosition: function(){
            try{
                return {
                    "left": Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).position().left,
                    "top": Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).position().top,
                    "width": Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).outerWidth(true),
                    "height": Number($('#WorkFlowMatrix').css('zoom')) * $('#Workflow' + this.ID).outerHeight(true)
                }
            }catch(e){
                $scope.Toast.show("Error!","There was an error in getting position of workflow", Toast.LONG, Toast.ERROR);
                console.error("getPosition: ", e);
            }
        },

        /**
         * Override toString default function to return json stringify
         * @return {String} Json stringify string
         */
        toString: function(){
            return JSON.stringify(this.toJson());
        },

        /**
         * Creates Json 
         * @return {Object} Json object
         */
        toJson:function(){
            var tempJson = {
                "ID": this.ID,
                "fx": this.fx,
                "fy": this.fy,
                "tx": this.tx,
                "ty": this.ty,
                "name": this.name,
                "tabsIds": this.tabsIds,
                "tabs": []
            }
            tempJson.selectedTab = {
                "ID": this.selectedTab.ID
            };
            for (var i = 0; i < this.tabs.length; i++) {
                tempJson.tabs.push(JSON.parse(this.tabs[i].toString()));
            }
            return tempJson;
        }
    };

    return Workflow;
}]);


function getDiffArrays (before,after) {
    
	return {
		"deleted":(before.filter(function(a) {
	    	var found = false;
	    	for(var i=0; i<after.length ;i++){
	    		if(after[i].ID == a.ID){
	    			found = true;
	    		}
	    	}
			return (!found);
		})),
		"inserted":(after.filter(function(a) {
	    	var found = false;
	    	for(var i=0; i<before.length ;i++){
	    		if(before[i].ID == a.ID){
	    			found = true;
	    		}
	    	}
			return (!found);
		}))
	}
}















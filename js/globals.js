(function(angular) {
    // 'use strict';
    angular.module('IntelLearner').value('Globals', {
        CashedObjects: {},
        CurrentUser: {},
        get: function(id, type) {
            return this.CashedObjects[type + id];
        },
        set: function(obj) {
            this.CashedObjects[obj.type + obj.id] = obj;
        },
        clear: function() {
            this.CashedObjects = {};
            this.CurrentUser = {};
        },
        allObjectsaved: function() {
            console.warn("allObjectsaved not implemented!");
            return true;
            // var isSaved = 1;
            // for(var i=0; i<this.CashedObjects.length; i++){
            // 	isSaved *= ((this.CashedObjects[i].inProgress)?0:1);
            // }
            // return isSaved;
        },
        pop: function(id, type) {
            var tempObj = this.CashedObjects[type + id];
            delete this.CashedObjects[type + id];
            return tempObj;
        },
        getMinimized: function(callback) {
            if (this.CurrentUser.id != undefined) {
                var dataToRetrun = [];
                var CashedObjectsKeys = Object.keys(this.CashedObjects);
                for (var i = 0; i < CashedObjectsKeys.length; i++) {
                    if (this.CashedObjects[CashedObjectsKeys[i]].inProgress == false && this.CashedObjects[CashedObjectsKeys[i]].locked &&  this.CashedObjects[CashedObjectsKeys[i]].lockedBy.id != this.CurrentUser.id) {
                        dataToRetrun.push({
                            "id": this.CashedObjects[CashedObjectsKeys[i]].id,
                            "type": this.CashedObjects[CashedObjectsKeys[i]].type,
                            "lastModified": this.CashedObjects[CashedObjectsKeys[i]].lastModified,
                        });
                    }
                }
                callback(dataToRetrun);
            } else {
                callback([]);
            }
        },
        getRecentObjects: function(type){
            console.warn("getRecentObjects: now returns arrays of objects!! which has data and version");
            if (this.CurrentUser.id != undefined) {
                var dataToRetrun = [];
                var CashedObjectsKeys = Object.keys(this.CashedObjects);
                for (var i = 0; i < CashedObjectsKeys.length; i++) {
                    if(this.CashedObjects[CashedObjectsKeys[i]].type == "Delivery" || this.CashedObjects[CashedObjectsKeys[i]].type == "Kbit"){
                        dataToRetrun.push({
                            data:this.CashedObjects[CashedObjectsKeys[i]],
                            version: this.CashedObjects[CashedObjectsKeys[i]].revision
                        });
                    }
                }
                return dataToRetrun;
            }else{
                return [];
            }
        },
        // for specific workflow
        noLockedItems:function(){
            if(this.CashedObjects){
                 for (var obj in this.CashedObjects){
                    if(this.CashedObjects.hasOwnProperty(obj)){
                        if(this.CashedObjects[obj].locked){
                            if(this.CashedObjects[obj].locked == true){
                                return false;
                            }
                        }
                    } 
                }
            }
            return true;
        },

        updateUsedObjects: function(workspace){
            // loop on cashed objects and check if its in workflow
            var found = false;

            var CashedObjectsKeys = Object.keys(this.CashedObjects);
            for (var i = 0; i < CashedObjectsKeys.length; i++) {
                found = false;
                //loop on workflows
                for(var j=0; j<workspace.workflows.length; j++){
                    //loop over tabs
                    for(var k=0; k<workspace.workflows[j].tabs.length; k++){
                        if(workspace.workflows[j].tabs[k].dataHolding.result){
                            for(var z=0; z< workspace.workflows[j].tabs[k].dataHolding.result.length; z++){
                                if(workspace.workflows[j].tabs[k].dataHolding.result[z].id == this.CashedObjects[CashedObjectsKeys].id){
                                    found = true;
                                    break;
                                }
                            }
                            if(found)
                                break;
                        }
                    }
                    if(found){
                        break;
                    }
                }
                if(found == false){
                    this.pop(this.CashedObjects[CashedObjectsKeys[i]].id, this.CashedObjects[CashedObjectsKeys[i]].type);
                }
            }
        // for(var obj in this.CashedObjects){
       //  debugger;
       //      if(this.CashedObjects.hasOwnProperty(obj)){
       //          found = false;
       //          //loop on workflows
       //          for(var j=0; j<workspace.workflows.length; j++){
       //              //loop over tabs
       //              for(var k=0; k<workspace.workflows[j].tabs.length; k++){
       //                  if(workspace.workflows[j].tabs[k].dataHolding.result){
       //                      for(var z=0; z< workspace.workflows[j].tabs[k].dataHolding.result.length; z++){
       //                          if(workspace.workflows[j].tabs[k].dataHolding.result[z].id == this.CashedObjects[obj].id){
       //                              found = true;
       //                              break;
       //                          }
       //                      }
       //                      if(found)
       //                          break;
       //                  }
       //              }
       //              if(found){
       //                  break;
       //              }
       //          }
       //          if(found == false){
       //              this.pop(this.CashedObjects[obj].id, this.CashedObjects[obj].type);
       //          }
       //      }
       // }
        },

        getAllObjectToJson: function(){
            var dataToRetrun = [];
            if (this.CurrentUser.id != undefined) {
                var CashedObjectsKeys = Object.keys(this.CashedObjects);
                for (var i = 0; i < CashedObjectsKeys.length; i++) {
                    dataToRetrun.push({
                        "id": this.CashedObjects[CashedObjectsKeys[i]].id,
                        "name": this.CashedObjects[CashedObjectsKeys[i]].name,
                        "kBitsNeeded": this.CashedObjects[CashedObjectsKeys[i]].kBitsNeeded,
                        "kBitsProvided": this.CashedObjects[CashedObjectsKeys[i]].kBitsProvided,
                        "terms": this.CashedObjects[CashedObjectsKeys[i]].terms,
                        "description": this.CashedObjects[CashedObjectsKeys[i]].description,
                        "url": this.CashedObjects[CashedObjectsKeys[i]].url,
                        "locked": this.CashedObjects[CashedObjectsKeys[i]].locked,
                        "lockedBy": this.CashedObjects[CashedObjectsKeys[i]].lockedBy,
                        "lastModified": this.CashedObjects[CashedObjectsKeys[i]].lastModified,
                        "inProgress": this.CashedObjects[CashedObjectsKeys[i]].inProgress,
                        "type": this.CashedObjects[CashedObjectsKeys[i]].type,
                        "termScope": this.CashedObjects[CashedObjectsKeys[i]].termScope,
                        "objectType": this.CashedObjects[CashedObjectsKeys[i]].objectType,
                        "progressWizard": this.CashedObjects[CashedObjectsKeys[i]].progressWizard,
                        "newData": this.CashedObjects[CashedObjectsKeys[i]].newData,
                        "revision": this.CashedObjects[CashedObjectsKeys[i]].revision
                    });
                }
            }
            return dataToRetrun;
        }
    })
    .value('TypeOf', {
        init: function() {
            Number.prototype.objectType = "number";
            Array.prototype.objectType = "array";
            String.prototype.objectType = "string";
            (function() {}).prototype.objectType = "function";
        },
        get: function(obj) {
            return obj.objectType;
        }
    })
    .value('ServerReq', "Not initialized")

    .value('Logs', {

        logs: {},
        set: function(params){
            console.warn("save ( set ) logs not finished !!!");
            if(params.length == 4){
                if(typeof(params[2]) == "string" && params[3]){
                    this.logs.push({
                        Class: params[0],
                        Func: params[1],
                        message: params[2],
                        obj: params[3]
                    });
                }else{

                }
            }else{
                if(params.length == 3){
                    if(typeof(params[2]) == "object"){
                        this.logs.push({
                            Class: params[0],
                            Func: params[1],
                            obj: params[2]
                        });
                    }else{
                        if(typeof(params[2]) == "string"){
                            this.logs.push({
                                Class: params[0],
                                Func: params[1],
                                message: params[2]
                            });  
                        }
                    }
                }
            }
        }
    })
    .value('$httpR', {

        protocol: "http",
        ip: "109.160.241.160",
        port: "8888",
        baseUrl: "/mopdqwompoaskdqomdiasjdiowqe/server/webservice.php/",

        // API function
        logIn: "USERlogIn",
        signUp: "USERsignUp",
        changePassword: "USERchangePassword",
        updateUser: "USERupdateUser",
        KBITremoveTerm: "KBITremoveTerm",
        KBITaddTermByUID: "KBITaddTermByUID",
        KVPsetKeyValuePair: "KVPsetKeyValuePair",
        KVPgetKeyValuePair: "KVPgetKeyValuePair",
        TERMsearchTerms: "TERMsearchTerms",
        DELIVERYsearchDelivery: "DELIVERYsearchDelivery",
        KBITsearchKbits: "KBITsearchKbits",
        TERMremoveTermToTermRelation: "TERMremoveTermToTermRelation",
        TERMgetAllTermsStrings: "TERMgetAllTermsStrings",
        TERMgetRelatedTerms: "TERMgetRelatedTerms",
        TERMaddTermToTermRelation: "TERMaddTermToTermRelation",
        KBITbeginEdit: "KBITbeginEdit",
        KBITcancelEdit: "KBITcancelEdit",
        KBITaddRelatedKbit: "KBITaddRelatedKbit",
        KBITremoveRelatedKbit: "KBITremoveRelatedKbit",
        DELIVERYbeginEdit: "DELIVERYbeginEdit",
        DELIVERYcancelEdit: "DELIVERYcancelEdit",
        DELIVERYpublish: "DELIVERYpublish",
        DELIVERYupdate: "DELIVERYupdate",
        DELIVERYaddRelatedDelivery: "DELIVERYaddRelatedDelivery",
        DELIVERYremoveRelatedDelivery: "DELIVERYremoveRelatedDelivery",
        DELIVERYaddTermByUID: "DELIVERYaddTermByUID",
        DELIVERYremoveTerm: "DELIVERYremoveTerm",
        DELIVERYaddRelatedKbit: "DELIVERYaddRelatedKbit",
        DELIVERYremoveRelatedKbit: "DELIVERYremoveRelatedKbit",
        USERlogout: "USERlogout",
        USERvalidateToken: "USERvalidateToken",
        DELIVERYaddNew: "DELIVERYaddNew",
        USERsaveProfilePicture: "USERsaveProfilePicture",
        DELIVERYupdateFullDelivery: "DELIVERYupdateFullDelivery",
        

        



        connectToServer: function(data, method, Globals, callback) {

            data.serverHash = "DAVIDAMEER";
            data.method = method;
            data.format = "json";
            if(Globals.CurrentUser && Globals.CurrentUser.id){
                data.Token = Globals.CurrentUser.token;
            }
            // http://109.160.241.160:8888/mopdqwompoaskdqomdiasjdiowqe/server/webservice.php/
            $.ajax({
                // url: "http://testserver-radjybaba.rhcloud.com/webservice.php/",
                url: this.protocol+"://"+this.ip+":"+this.port+this.baseUrl,
                data: data,
                method: "POST",
                header:{
                    "Access-Control-Allow-Origin": "http://"+this.ip+":8888"
                },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain : true,
                timeout: 10000,
                success: function(success) {
                    console.log(success);
                    if (success.status == 200)
                        callback(success.data, null);
                    else{
                    
                        if(success.status == 401){
                            ngScope.logout();
                            callback(null, error); 
                        }else{
                            console.error(success);
                            callback(null, success);
                        }
                    }
                },
                error: function(error) {
                
                    if(error.status == 401){
                        ngScope.logout();
                        callback(null, error); 
                    }else{
                        console.error(error);
                        callback(null, error); 
                    }
                }
            });
        }
    }).value('checkChangesInStepsAffectsOnlyNewData', function(content, after, before){

        /**********************************************************************************************************************/
        /* Get all changed values stored in object {changes:"status", value}, Modified by David to support this application. */
        /**********************************************************************************************************************/
        function diff(a, b) {
            if (a === b) {
                return {
                    changed: 'equal',
                    value: a
                }
            }
            var value = {};
            var equal = true;
            for (var key in a) {
                if (key in b) {
                    if (a[key] === b[key]) {} else {
                        var typeA = typeof a[key];
                        var typeB = typeof b[key];
                        if (a[key] && b[key] && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function')) {
                            var valueDiff = diff(a[key], b[key]);
                            if (valueDiff.changed == 'equal') {} else {
                                if(Object.keys(valueDiff.value) && Object.keys(valueDiff.value)[0] == "$$hashKey"){}
                                else
                                    if(key == "content"){
                                        var foundContent=false;
                                        for(var i=0; i<Object.keys(valueDiff.value).length; i++){
                                            if(Object.keys(valueDiff.value)[i]=="newData" || Object.keys(valueDiff.value)[i]=="progressWizard"){
                                                foundContent = true;
                                            }
                                        }
                                        if(foundContent){
                                            valueDiff.contentId = a.content.id;
                                            valueDiff.contentType = a.content.type;
                                            equal = false;
                                            value[key] = valueDiff;
                                        }else{
                                            equal = false;
                                            value[key] = valueDiff;    
                                        }
                                    }else if(key == "dataHolding"){
                                        if(valueDiff && valueDiff.value && valueDiff.value.results && valueDiff.value.results.value){
                                            if(Object.keys(valueDiff.value.results.value).length != undefined && Object.keys(valueDiff.value.results.value).length > 0){
                                                var mm = Object.keys(valueDiff.value.results.value);
                                                var mm1 = mm[0];
                                                var ss = a.dataHolding.results;
                                                var ss1 = ss[mm1];
                                                if(ss1 && ss1.id && ss1.type){
                                                    valueDiff.contentId = ss1.id;
                                                    valueDiff.contentType = ss1.type;
                                                }
                                            }
                                        }
                                        equal = false;
                                        value[key] = valueDiff;
                                    }else{
                                        equal = false;
                                        value[key] = valueDiff;
                                    }
                            }
                        } else {
                            equal = false;
                            value[key] = {
                                changed: 'primitive change',
                                removed: a[key],
                                added: b[key]
                            }
                        }
                    }
                } else {
                    equal = false;
                    value[key] = {
                        changed: 'removed',
                        value: a[key]
                    }
                }
            }
            for (key in b) {
                if (!(key in a)) {
                    equal = false;
                    value[key] = {
                        changed: 'added',
                        value: b[key]
                    }
                }
            }
            if (equal) {
                return {
                    changed: 'equal',
                    value: a
                }
            } else {
                return {
                    changed: 'object change',
                    value: value
                }
            }
        }
        
        /*************************************************************************/
        /* Get All changed pathes, Modified by David to support this application */
        /*************************************************************************/
        function objectToPaths(data) {
            var validId = /^[a-z_$][a-z0-9_$]*$/i;
            var result = [];
            doIt(data, "");
            return result;

            function doIt(data, s) {
                if (data && typeof data === "object") {
                    if (Array.isArray(data)) {
                        for (var i = 0; i < data.length; i++) {
                            doIt(data[i], s + "[" + i + "]");
                        }
                    } else {
                        for (var p in data) {
                            if (validId.test(p)) {
                                if(p != "$$hashKey"){
                                    if(p != "changed" && p != "removed" && p != "added" && p != "contentType" && p != "contentId"){
                                        if(data.contentId){
                                            doIt(data[p], s + "." + p+"(id="+data.contentId+"&type="+data.contentType+")");
                                        }
                                        else{
                                            doIt(data[p], s + "." + p);
                                        }
                                    }
                                    else {
                                        doIt(data[p], s);
                                    }
                                }
                            } else {
                                doIt(data[p], s + "[\"" + p + "\"]");
                            }
                        }
                    }
                } else {
                    if (data == "primitive change" || data == "added" || data == "removed"){
                        result.push(s);
                    }
                }
            }
        }

        /**************************************************************************/
        /* Get unique array values, Modified by David. Support only string values */
        /**************************************************************************/
        function getUniqueStringValues(array){var flags = {};var unique = [];for( i=0; i< array.length; i++) {if( flags[array[i]]) continue;flags[array[i]] = true;unique.push(array[i]);} return unique;}

        var diffData = diff(before, after);
        if(diffData.changed == "equal")
            return true;
        diffData = objectToPaths(diffData);
        diffData = getUniqueStringValues(diffData);
        for(var i=0; i<diffData.length; i++){
            var s = diffData[i];
            if(s.indexOf("(id=") != -1 && s.indexOf("&type=") != -1){
                var contentId = (s.substring(s.indexOf('(id=')+4)).substring(0,(s.substring(s.indexOf('(id=')+4)).indexOf('&'));
                var contentType = (s.substring(s.indexOf('&type=')+6)).substring(0,(s.substring(s.indexOf('&type=')+6)).indexOf(')'));
                if(content.id != contentId || content.type != contentType){
                    return false;
                }
            }else{
                return false;
            }
        }
        return true;

    }).value("getDiffSteps", function(before, after){
        function getDeletedInsertedByKey(e,t,n){var d={deleted:e.filter(function(e){for(var d=!1,r=0;r<t.length;r++)t[r][n]==e[n]&&(d=!0);return!d}),inserted:t.filter(function(t){for(var d=!1,r=0;r<e.length;r++)e[r][n]==t[n]&&(d=!0);return!d})};return 0==d.deleted.length&&0==d.inserted.length?null:0!=d.deleted.length&&0==d.inserted.length?{deleted:d.deleted}:0==d.deleted.length&&0!=d.inserted.length?{inserted:d.inserted}:d}
        function getSameObjectsByKey(t,e,n){return t.filter(function(t){return 0!=e.filter(function(e){return e[n]==t[n]}).length})}
        function makeIdsAsKeys(e,n){for(var r={},s=0;s<e.length;s++)r[e[s][n]]=e[s];return r}
        
        // var diffObject = {
        //  "affectsOnlyEditingData": true, // Check if steps save while editing content
        //  "contentId": 0,                 // Editing content id
        //  "workflows": {},                // Added or Removed workflows
        //  "workflowsKeys": [{             // Updated Workflows (selectedTab, tabs)
        //      "id": 0,                    // Updated Workflow ID
        //      "selectedTab": {            //  
        //          "before": 0,  
        //          "after": 1
        //      } 
        //      "tabs":[],                  // Added or Removed tabs
        //      "tabsKeys":[{               // Updated Tabs (title, Type, orderTab, color)
        //          "id": 0,                // Updated Workflow ID
        //          "name": {               //
        //              before:"",
        //              after:""
        //          },
        //          ...
        //          ...
        //          ...
        //          "content":{             // Added or Removed content 
        //              "inserted": {}
        //              "deleted": {}
        //          }
        //          "contentKeys":[{        // Updated Content (newData, progressWizard) Steps contains(id, type, newData, progressWizard)
        //              "id": 0,            // Updated Content ID
        //              
        //          }]
        //      }]
        //  }]

        // };
        

        // check workflows
        var diffObject = {};
        var affectsOnlyEditingData = true , contentId = -1, contentType = "";
        // check inserted deleted workflows
        var workflowsDiff = getDeletedInsertedByKey(before, after, "ID");
        if(workflowsDiff){
            diffObject.workflows = workflowsDiff;
            affectsOnlyEditingData = false;
        }


        // loop in same workflows
        var sameWorkflowsKeys = Object.keys(makeIdsAsKeys(getSameObjectsByKey(before, after, "ID"), "ID"));
        before = makeIdsAsKeys(before, "ID");
        after = makeIdsAsKeys(after, "ID");

        for(var i=0; i<sameWorkflowsKeys.length; i++){
            var changedWorkflow = {};
            // check selected tab
            if(before[sameWorkflowsKeys[i]].selectedTab.ID != after[sameWorkflowsKeys[i]].selectedTab.ID){
                changedWorkflow.selectedTab = {
                    "before": before[sameWorkflowsKeys[i]].selectedTab,
                    "after":after[sameWorkflowsKeys[i]].selectedTab
                };
                affectsOnlyEditingData = false;
            }

            // check inserted deleted tabs
            var beforeTabs = before[sameWorkflowsKeys[i]].tabs;
            var afterTabs = after[sameWorkflowsKeys[i]].tabs;
            var tabsDiff = getDeletedInsertedByKey(beforeTabs, afterTabs, "ID");
            if(tabsDiff){
                changedWorkflow.tabs = tabsDiff;
                affectsOnlyEditingData = false;
            }

            // loop in same tabs
            var sameTabsKeys = Object.keys(makeIdsAsKeys(getSameObjectsByKey(beforeTabs, afterTabs, "ID"), "ID"));
            beforeTabs = makeIdsAsKeys(beforeTabs, "ID");
            afterTabs = makeIdsAsKeys(afterTabs, "ID");

            for(var j=0; j<sameTabsKeys.length; j++){
                var changedTab = {};

                // check title
                if(beforeTabs[sameTabsKeys[j]].title != afterTabs[sameTabsKeys[j]].title){
                    changedTab.title = {
                        "before": beforeTabs[sameTabsKeys[j]].title,
                        "after":afterTabs[sameTabsKeys[j]].title
                    };
                    affectsOnlyEditingData = false;
                }

                // check Type
                if(beforeTabs[sameTabsKeys[j]].Type != afterTabs[sameTabsKeys[j]].Type){
                    changedTab.Type = {
                        "before": beforeTabs[sameTabsKeys[j]].Type,
                        "after":afterTabs[sameTabsKeys[j]].Type
                    };
                    affectsOnlyEditingData = false;
                }

                // check Type
                if(beforeTabs[sameTabsKeys[j]].orderTab != afterTabs[sameTabsKeys[j]].orderTab){
                    changedTab.orderTab = {
                        "before": beforeTabs[sameTabsKeys[j]].orderTab,
                        "after":afterTabs[sameTabsKeys[j]].orderTab
                    };
                    affectsOnlyEditingData = false;
                }

                // check Type
                if(beforeTabs[sameTabsKeys[j]].color != afterTabs[sameTabsKeys[j]].color){
                    changedTab.color = {
                        "before": beforeTabs[sameTabsKeys[j]].color,
                        "after":afterTabs[sameTabsKeys[j]].color
                    };
                    affectsOnlyEditingData = false;
                }


                // check content
                if(beforeTabs[sameTabsKeys[j]].content && afterTabs[sameTabsKeys[j]].content){
                    if(beforeTabs[sameTabsKeys[j]].content.id != afterTabs[sameTabsKeys[j]].content.id || beforeTabs[sameTabsKeys[j]].content.type != afterTabs[sameTabsKeys[j]].content.type ){
                        // content changed
                        changedTab.content = {
                            "deleted": beforeTabs[sameTabsKeys[j]].content,
                            "inserted": afterTabs[sameTabsKeys[j]].content
                        };
                        affectsOnlyEditingData = false;
                    }else if(beforeTabs[sameTabsKeys[j]].content.id == afterTabs[sameTabsKeys[j]].content.id && beforeTabs[sameTabsKeys[j]].content.type == afterTabs[sameTabsKeys[j]].content.type){
                        // check content keys
                        var contentChanged = {};
                        if(beforeTabs[sameTabsKeys[j]].content.type == "Delivery" || beforeTabs[sameTabsKeys[j]].content.type != "Kbit"){
                            
                            // check progressWizard if Delivery || Kbit
                            if(!angular.equals(beforeTabs[sameTabsKeys[j]].content.progressWizard, afterTabs[sameTabsKeys[j]].content.progressWizard)){
                                contentChanged.progressWizard = {
                                    "before": beforeTabs[sameTabsKeys[j]].content.progressWizard,
                                    "after": afterTabs[sameTabsKeys[j]].content.progressWizard
                                }
                            }
                            // check newData if Delivery || Kbit
                            if(!angular.equals(beforeTabs[sameTabsKeys[j]].content.newData, afterTabs[sameTabsKeys[j]].content.newData)){
                                contentChanged.newData = {
                                    "before": beforeTabs[sameTabsKeys[j]].content.newData,
                                    "after": afterTabs[sameTabsKeys[j]].content.newData
                                }
                            }
                        }

                        if(!$.isEmptyObject(contentChanged)){
                            contentId = beforeTabs[sameTabsKeys[j]].content.id;
                            contentType = beforeTabs[sameTabsKeys[j]].content.type;
                            contentChanged.contentId = sameTabsKeys[j];
                            changedTab.contentKeys = contentChanged;
                        }
                    }

                }else if(beforeTabs[sameTabsKeys[j]].content){
                    // content deleted
                    changedTab.content = {
                        "deleted": beforeTabs[sameTabsKeys[j]].content
                    };
                    affectsOnlyEditingData = false;
                }else if(afterTabs[sameTabsKeys[j]].content){
                    // content inserted
                    changedTab.content = {
                        "inserted": afterTabs[sameTabsKeys[j]].content
                    };
                    affectsOnlyEditingData = false;
                }


                // check dataHolding

                if(!angular.equals(beforeTabs[sameTabsKeys[j]].dataHolding, afterTabs[sameTabsKeys[j]].dataHolding)){
                    changedTab.dataHolding = {
                        "deleted": beforeTabs[sameTabsKeys[j]].dataHolding,
                        "inserted": afterTabs[sameTabsKeys[j]].dataHolding
                    }
                }

                if(!$.isEmptyObject(changedTab)){
                    changedTab.tabId = sameTabsKeys[j];
                    if(changedWorkflow.tabsKeys)
                        changedWorkflow.tabsKeys.push(changedTab);
                    else
                        changedWorkflow.tabsKeys = [changedTab];
                }
            }

            if(!$.isEmptyObject(changedWorkflow)){
                changedWorkflow.workflowId = sameWorkflowsKeys[i];
                if(diffObject.workflowsKeys)
                    diffObject.workflowsKeys.push(changedWorkflow);
                else
                    diffObject.workflowsKeys = [changedWorkflow];
            }
        }

        if(!$.isEmptyObject(diffObject)){
            if(affectsOnlyEditingData && contentId != -1){
                diffObject.affectsOnlyEditingData = affectsOnlyEditingData;
                diffObject.contentId = contentId;
                diffObject.contentType = contentType;
            }
        }

        return (!$.isEmptyObject(diffObject))?diffObject:null;
            
    });
})(window.angular);









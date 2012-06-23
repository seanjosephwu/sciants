
"use strict";

//Constants
var REQUEST_URL = "webservice.php";
var LOAD_ON_PAGE = "project.html";

if (location.pathname.search(LOAD_ON_PAGE) != -1) {
	window.onload = initializePage;
}

//Main Functions

function initializePage() {
	//Event handlers for add and remove
	$("add").onclick = addListItemFromTextBox;
	$("delete").onclick = deleteListItem;
	//Initialize the to do list
	//sendAjaxRequest("get", "todolist", createListFromAjax, sendAjaxFailure);
}

//Takes the value from the itemtext text box on
//todolist.php and adds it to the to do list
function addListItemFromTextBox() {
	if ($("itemtext").value) {
		var itemvalue = $("itemtext").value.escapeHTML();
		$("itemtext").value = "";
		addListItem(itemvalue);
	}	
}

//Adds a list item given an itemvalue
//and updates the save file on the server.
function addListItem(itemvalue) {
	var li = document.createElement("li");
	li.update(itemvalue);
	li.hide();
	li.id = "item_" + ($("todolist").children.length + 1);
	$("todolist").appendChild(li);
	li.appear();
	postUpdate();
}

//Deletes a list item and updates
//the save file on the server.
function deleteListItem() {
	var listitems = $$("#todolist li");
	if (listitems.length > 0) {
		listitems[0].fade({
			afterFinish: function() {
				$("todolist").removeChild(listitems[0]);
				postUpdate();
			}
		});
	}
}

//Sends a POST request with the todolist as a JSON string
//to save it on the server
function postUpdate() {
	Sortable.create($("todolist"), {onUpdate: postUpdate});
	var list = $$("#todolist li");
	var listlength = list.length;
	var listcontents = [];
	for ( var i = 0; i < listlength; i += 1) {
		listcontents[i] = list[i].textContent;
	}
	var jsonlist = { "items": listcontents };
	//sendAjaxRequest("post", JSON.stringify(jsonlist), sendAjaxSuccess, sendAjaxFailure);
}

//Ajax Functions

//Creates a to do list on the todolist.php page
//from the results of an Ajax request.
function createListFromAjax(ajax) {
	if (ajax.responseText != "") {
		var json = JSON.parse(ajax.responseText);
		var listitems = json["items"];
		var listitemslength = listitems.length;
		for (var i = 0; i < listitemslength; i += 1) {
			addListItem(listitems[i].escapeHTML());
		}
	}
}

//do nothing if success on sending the Ajax request
function sendAjaxSuccess(ajax) {
}

// provided Ajax failure code (displays a useful alert when something goes
// wrong with the Ajax request)
function sendAjaxFailure(ajax, exception){
	alert("Error making Ajax request:" + 
			"\n\nServer status:\n" + ajax.status + " " + ajax.statusText + 
			"\n\nServer response text:\n" + ajax.responseText);
	if (exception) {
		throw exception;
	}
}

//Sends an Ajax Request given a method, a value for todolist and
//success and failure functions
function sendAjaxRequest(requestmethod, value, successFunction, failureFunction) {
	new Ajax.Request(REQUEST_URL, {
		method: requestmethod,
		parameters: {todolist: value},
		onSuccess: successFunction,
		onFailure: failureFunction,
		onException: failureFunction
	});
}
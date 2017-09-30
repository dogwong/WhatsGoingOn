// ==UserScript==
// @name         WhatsGoingOn
// @namespace    https://github.com/dogwong/WhatsGoingOn
// @version      0.2.0
// @description  WhatsApp
// @author       dogwong
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://rawgit.com/dogwong/WhatsGoingOn/master/dateformat.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://web.whatsapp.com/
// @run-at       document-idle
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/dogwong/WhatsGoingOn/master/WhatsGoingOn.user.js
// @downloadURL  https://raw.githubusercontent.com/dogwong/WhatsGoingOn/master/WhatsGoingOn.user.js
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    // Your code here...
    GM_addStyle('.dwScript { font-family: "open sans",arial,sans-serif } .dwScript button { background-color: rgba(200, 200, 200, 1.0);padding-left: 5px;padding-right: 5px; border: 1px solid #000000;webkit-user-select: none;user-select: none;cursor: pointer; } #panelMain input { display: inline-block; } .dwScript .box { margin: 5px; padding: 5px; border-radius: 5px; border: 1px solid #000000; } .divHeader { font-size: 17px; font-weight: bold; padding-top: 3px; padding-bottom: 5px;} .inline { display: inline-block; } .flexRow {display: flex;flex-direction: row; } #divOpenPanel { position: absolute; top: 0px; left: 0px; height: 20px; width: 50px; background-color: rgba(26, 191, 29, 0.9);text-align: center;webkit-user-select: none;user-select: none;cursor: pointer; } #panelMain { position: absolute; top: 20px; left: 0px; height: calc(100% - 56px); width: calc(100% - 32px); background-color: rgba(255, 255, 255, 1.0);margin: 6px; padding: 8px; border-radius: 15px; border: 2px solid #1abf1d; font-size: 16px;overflow-y: scroll;webkit-user-select: text;user-select: text; } #panelMain div::selection, input::selection, textarea::selection {background-color: rgba(26, 191, 29, 0.5) !important; }#divTestArea { font-size: 14px; } #divTestArea div {padding-bottom: 3px;padding-right: 3px; }#divPresenceModels { } #divPresenceModels .item {border: 2px solid #999;margin-bottom: 2px; } #divPresenceModels .item.online {border: 2px solid rgb(89, 178, 57); } #divPresenceModels .item.offline {border: 2px solid rgb(252, 158, 0); } #divPresenceModels #sdivWSid, #sdivLastSeen, #sdivT {background-color: #DDD;width: 120px;overflow: hidden;text-align: left; }#divVersion {font-size: 12px; }');
    $("body").append('<div id="divOpenPanel"> WGO </div><div id="panelMain" class="dwScript"> <!-- Phone# <input id="txtPhoneNo" type="text" name="Phone No" placeholder="85298765432"><br> Get... <button type="button" id="btnGetProfile">ProfilePic</button> <button type="button" id="btnGetStatus">Status</button> <button type="button" id="btnGetPresence">Presence</button><br> --><div id="divTestArea" class="box"> <div class="divHeader">Test Area</div> <div><input id="txtTestPhoneNo" type="text" name="Phone No" placeholder="Phone# 85298765432" size="16"><button type="button" id="btnTestGet">Get</button></div> <div class="flexRow"> <div> <img id="imgTestProfilePic" src="" height="50" width="50"> </div> <div> <div id="lblTestPhoneNo"> Phone ###### </div> <div id="lblTestStatus"> Status </div> <div id="lblTestPresence"> Last Seen </div> </div> </div> </div> <div id="divPresenceModels" class="box"> <div class="divHeader">Presence.models</div> <div class="inline"><input id="cbAutoRefresh" class="ui_save_value" type="checkbox" checked="" disabled=""></div> <label for="cbAutoRefresh">Auto Update UI</label><div id="sdivItemTemplate"> <div id="sdivItem" class="item offline" wsid="(wsid)"> <img id="sdivProfilePic" src="" height="20" width="20"> <div id="sdivWSid" class="inline">85298765432</div> <div id="sdivLastSeen" class="inline">23/12 12:34:56</div> <div id="sdivT" class="inline">23/12 12:34:56</div> </div> </div> <div id="sdivTableModels"></div> </div> <hr> Raw: <button type="button" id="btnPrintToConsole">console.log</button><br> <textarea id="txtRawResult" name="message" rows="3" cols="30">Hello World </textarea> <button type="button" id="btnRawResultCopy">Copy</button><br> <div id="divVersion"> Script:&nbsp; <div id="lblScriptVersion" class="ui_cell inline"> 0.2.0 </div> ,UI:&nbsp; <div id="lblUIVersion" class="ui_cell inline">v1710010122</div> </div> </div>');

    $("#panelMain").hide(0);
    $("#divOpenPanel").hide(0);


// variables
var intervalPresenceModelsAutoRefresh;

// UI templates
var templatePresenceModelsItem = "";

function init () {
	// wait for WhatsApp app interface is shown
	if ($ && $("#pane-side") && typeof Store == "object") {
		$("#divOpenPanel").show(0);

		//intervalPresenceModelsAutoRefresh = setInterval(presenceModelsUpdateTick, )
		templatePresenceModelsItem = $("#sdivItemTemplate").html().trim();
		$("#sdivItemTemplate").html("");
		$("#lblScriptVersion").text(GM_info.script.version);
		presenceModelsUpdate();
	} else {
		setTimeout(init, 500);
	}
}

// Open the WGO panel
$("#divOpenPanel").on("click", () => {
	$("#panelMain").slideToggle();
});

// Test Area
function checkInput () {
	var input = "";
	if ($("#txtTestPhoneNo").val) input = $("#txtTestPhoneNo").val();
	else if ($("#txtTestPhoneNo").value) input = $("#txtTestPhoneNo").value;
	if (isNaN(input)) return false;
	return true;
}

$("#btnTestGet").on("click", () => {
	if (!checkInput()) return;
	var target = $("#txtTestPhoneNo").val() + "@c.us";
	// Update phone number
	$("#lblTestPhoneNo").text($("#txtTestPhoneNo").val());
	// Reset profile pic
	$("#imgTestProfilePic").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALsSURBVHhe7ZXNTQMxEEYphCPVcKKWHFILUkqJUgp0kAPKIYqEFNa7s/73xi9BIML3NBe8k7H9PDYPZ9GNZAEkCyBZAMkCSBZAsgCSBZAsgGQBJAsgWQDJAkgWQLIAkgWQLIBkASQLIFkAyQJIFkCyAJIFkCyAZAEkCyBZAMkCSBZAsgCSBZAsgGQBJAsgWQDJAkgWQLIAkgWQLEAp6/34/LR/fPp4fbeBmO16+LR/fDm+2cAVnFau/v5582kDf4ZC1tvmw+lwcdjamOfz9WX6VFfZxe5g9W8y/issySr3I1kpiaz8skhWSiZriNXOPtVl+c3PceExymTNf64201s5h/tqr5uPaCWO4lxPtrz1yTL8IxtyjlYzylncckyHrOjxymXVkl0s+UpltSo0IhxSZiGJuWdvyan5WpC1PoVCVjqVZf83fYL/OidUacqqHYCdf2gxO4alqefV9uSEazE3RDkSWJQV2ZlWmchKMw3vt9lcLVmhiFcTGfe/GtPCKdamniqTnORo/ZKK5rogKzmf1S6WlYgL+Pzp6EoasiK5tcqJrJ6pGznJ7PmbmEdkeeSirAE/QYhhBbXzH/gJWT1To5xGXCMr7l6LYQV+S2m7pi4qfIOsnql7crys8nmq0icrXt8YbhvLWumbRWSh96grJ3+ehgZMtj/RKytqYBfjNpKRLKJ9ZnyHrMWprXL4STXKnGKkOO9+WQOhkG0jJKfRbKsBX+QWWe2pXUzbjvuojDmnXac870KWP7TiH6fDpp9nGsmeyXZPGZZvdmy65Fe2gdos9QfIKpjl+KhSX4etb8mlLdQaxVHKum+KDiXcr6xwv2o3t3pvLnG/snoeLMhdX8O6r2su4MR/e7NuQrIAkgWQLIBkASQLIFkAyQJIFkCyAJIFkCyAZAEkCyBZAMkCSBZAsgCSBZAsgGQBJAsgWQDJAkgWQLIAkgWQLIBkASQLIFkAyQJIFkCyAJIFkCyAZAEkCyBZAMnq5nz+AqkcZGalaQpIAAAAAElFTkSuQmCC");
	// get profile picture
	Store.ProfilePicThumb.find(target).then(response => {
		$("#imgTestProfilePic").attr("src", response.img);
		// get status
		return Store.Wap.statusFind(target);
	}).then(response => {
		$("#lblTestStatus").text(response.status);
		// get online
		return Store.Presence.find(target);
	}).then(response => {
		var lastseen = response.isOnline?"Online":"Offline";
		lastseen += ", Lastseen ";
		if (response.all.chatstate.__x_t) { // last seen timestamp
			lastseen += new Date(response.all.chatstate.__x_t * 1000).toString();
		} else {
			lastseen += "Hidden";
		}
		$("#lblTestPresence").text(lastseen);
		$("#txtRawResult").val(JSON.stringify(response));
	});
});

// Presence.models
var presenceModelsLastUpdate_i = 0;
function presenceModelsUpdate () {
	function update () {
		if (typeof Store.Presence != "object") return 1000;
		if (typeof Store.Presence.models != "object") return 1000;


		var model = Store.Presence.models[presenceModelsLastUpdate_i];
		if (!model || !model.id) return 10;
		var wsid = model.id.split("@")[0];
		if (isNaN(wsid)) return 10;

		var target = $("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "']");
		// Check if this item exists in table
		if (!target.length) {
			// no, create it
			var newItem = templatePresenceModelsItem;
			newItem = newItem.replace("(wsid)", wsid);
			$("#divPresenceModels #sdivTableModels").append(newItem);
			target = $("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "']");
			$("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "'] #sdivWSid").text(wsid);
			// last online state changed
			$("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "'] #sdivT").text(new Date().format("dd/mm HH:MM:ss"));
		}

		if (target.hasClass("offline") && model.isOnline) {
			target.addClass("online");
			target.removeClass("offline");
			$("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "'] #sdivT").text(new Date().format("dd/mm HH:MM:ss"));
		} else if (target.hasClass("online") && !model.isOnline) {
			target.addClass("offline");
			target.removeClass("online");
			$("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "'] #sdivT").text(new Date().format("dd/mm HH:MM:ss"));
		}
		// last seen
		if (model.all.chatstate.__x_t) {
			$("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "'] #sdivLastSeen").text(new Date(model.all.chatstate.__x_t * 1000).format("dd/mm HH:MM:ss"));
		} else {
			$("#divPresenceModels #sdivTableModels #sdivItem[wsid='" + wsid + "'] #sdivLastSeen").text("Hidden");
		}

		presenceModelsLastUpdate_i++;
		if (presenceModelsLastUpdate_i >= Store.Presence.models.length) {
			presenceModelsLastUpdate_i = 0;
			return 1000;
		}

		return 5;

	}

	setTimeout(presenceModelsUpdate, update());
}



// Debug
$("#btnPrintToConsole").on("click", () => {
	console.log(JSON.parse($("#txtRawResult").val()));
});





init();

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */

// ==UserScript==
// @name         WhatsGoingOn
// @namespace    https://github.com/dogwong/WhatsGoingOn
// @version      0.1.0
// @description  WhatsApp
// @author       dogwong
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
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
    GM_addStyle('.dwScript { font-family: "open sans",arial,sans-serif } .dwScript button { background-color: rgba(200, 200, 200, 1.0);padding-left: 5px;padding-right: 5px; border: 1px solid #000000;webkit-user-select: none;user-select: none;cursor: pointer; } .dwScript .box { margin: 5px; padding: 5px; border-radius: 5px; border: 1px solid #000000; } .divHeader { font-size: 17px; font-weight: bold; padding-top: 3px; padding-bottom: 5px;} .inline { display: inline-block; } .flexRow {display: flex;flex-direction: row; } #panelMain { position: absolute; top: 20px; left: 0px; height: calc(100% - 56px); width: calc(100% - 32px); background-color: rgba(255, 255, 255, 1.0);margin: 6px; padding: 8px; border-radius: 15px; border: 2px solid #1abf1d; font-size: 16px;overflow-y: scroll;webkit-user-select: text;user-select: text; } #panelMain div::selection, input::selection, textarea::selection {background-color: rgba(26, 191, 29, 0.5) !important; } #divOpenPanel { position: absolute; top: 0px; left: 0px; height: 20px; width: 50px; background-color: rgba(26, 191, 29, 0.9);text-align: center;webkit-user-select: none;user-select: none;cursor: pointer; } #divTestArea { font-size: 14px; } #lblVersion {font-size: 12px; }');
    $("body").append('<div id="divOpenPanel"> WGO </div><div id="panelMain" class="dwScript"> <!-- Phone# <input id="txtPhoneNo" type="text" name="Phone No" placeholder="85298765432"><br> Get... <button type="button" id="btnGetProfile">ProfilePic</button> <button type="button" id="btnGetStatus">Status</button> <button type="button" id="btnGetPresence">Presence</button><br> --><div id="divTestArea" class="box"> <div class="divHeader">Test Area</div> <div><input id="txtTestPhoneNo" type="text" name="Phone No" placeholder="Phone# 85298765432" size="16"><button type="button" id="btnTestGet">Get</button></div> <div class="flexRow"> <div> <img id="imgTestProfilePic" src="" height="50" width="50"> </div> <div> <div id="lblTestPhoneNo"> Phone ###### </div> <div id="lblTestStatus"> Status </div> <div id="lblTestPresence"> Last Seen </div> </div> </div> </div> <!--ProfilePic Result:<br> <img id="imgProfile" src="" height="42" width="42"><br> Status Result:<br> <div id="lblStatus" class="inline"></div><br> Presence Result:<br> Online: <div id="lblPresenceOnline" class="inline"></div><br> LastSeen: <div id="lblPresenceLastSeen" class="inline"></div><br> --><hr> Raw: <button type="button" id="btnPrintToConsole">console.log</button><br> <textarea id="txtRawResult" name="message" rows="3" cols="30">Hello World </textarea> <button type="button" id="btnRawResultCopy">Copy</button> <div id="lblVersion" class="ui_cell">UI: v1709290152</div> </div>');


$("#panelMain").hide(0);

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

$("#btnPrintToConsole").on("click", () => {
	console.log(JSON.parse($("#txtRawResult").val()));
});



/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */

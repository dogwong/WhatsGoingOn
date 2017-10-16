// ==UserScript==
// @name         WhatsGoingOn
// @namespace    https://github.com/dogwong/WhatsGoingOn
// @version      0.6.1
// @description  WhatsApp
// @author       dogwong
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://rawgit.com/dogwong/WhatsGoingOn/master/dateformat.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.min.js
// @match        https://web.whatsapp.com/
// @run-at       document-idle
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/dogwong/WhatsGoingOn/master/WhatsGoingOn.user.js
// @downloadURL  https://raw.githubusercontent.com/dogwong/WhatsGoingOn/master/WhatsGoingOn.user.js
// ==/UserScript==


GM_addStyle(
'.dwScript {'+
'  font-family: "open sans",arial,sans-serif'+
'}'+
'.dwScript button {'+
'  background-color: rgba(200, 200, 200, 1.0);'+
'	padding-left: 5px;'+
'	padding-right: 5px;'+
'  border: 1px solid #000000;'+
'	webkit-user-select: none;'+
'	user-select: none;'+
'	cursor: pointer;'+
'}'+
'#panelMain input {'+
'  display: inline-block;'+
'}'+
'.dwScript .box {'+
'  margin: 5px;'+
'  padding: 5px;'+
'  border-radius: 5px;'+
'	'+
'  border: 1px solid #000000;'+
'}'+
'.divHeader {'+
'  font-size: 17px;'+
'  font-weight: bold;'+
'  padding-top: 3px;'+
'  padding-bottom: 5px; '+
'}'+
'.inline {'+
'  display: inline-block;'+
'}'+
'.flexRow {'+
'   display: flex;'+
'   flex-direction: row;'+
'}'+
'.debugUI {'+
'	 display: none;'+
'}'+
'.debugUIShown {'+
'	'+
'}'+
'#divOpenPanel {'+
'  position: absolute;'+
'  top: 0px;'+
'  left: 0px;'+
'  height: 20px;'+
'  padding-left: 5px;'+
'	padding-right: 5px;'+
'  background-color: rgba(26, 191, 29, 0.9);'+
'	text-align: center;'+
'	webkit-user-select: none;'+
'	user-select: none;'+
'	cursor: pointer;'+
'}'+
'#panelMain {'+
'  position: absolute;'+
'  top: 20px;'+
'  left: 0px;'+
'  height: calc(100% - 56px);'+
'  width: calc(100% - 32px);'+
'  background-color: rgba(255, 255, 255, 1.0);'+
'	margin: 6px;'+
'  padding: 8px;'+
'  border-radius: 15px;'+
'  border: 2px solid #1abf1d;'+
'  font-size: 16px;'+
'	overflow-y: scroll;'+
'	webkit-user-select: text;'+
'	user-select: text;'+
'}'+
'#panelMain div::selection, input::selection, textarea::selection {'+
'	background-color: rgba(26, 191, 29, 0.5) !important;'+
'}'+
'#divTestArea {'+
'  font-size: 14px;'+
'}'+
'#divTestArea div {'+
'	padding-bottom: 3px;'+
'	padding-right: 3px;'+
'}'+
'#divPresenceModels .list {'+
'	max-height: 280px;'+
'	overflow-y: scroll;'+
'}'+
'#divPresenceModels {'+
'	'+
'}'+
'#divPresenceModels .item {'+
'	border: 2px solid #999;'+
'	margin-bottom: 2px;'+
'}'+
'#divPresenceModels .item.online {'+
'	border: 2px solid rgb(89, 178, 57);'+
'}'+
'#divPresenceModels .item.offline {'+
'	border: 2px solid rgb(252, 158, 0);'+
'}'+
'#divPresenceModels button {'+
'	vertical-align: text-bottom;'+
'	margin-bottom: 0.2em;'+
'}'+
'#divPresenceModels #sdivWSid, #sdivLastSeen, #sdivT, .staletime {'+
'	background-color: #DDD;'+
'	width: 120px;'+
'	overflow: hidden;'+
'	text-align: left;'+
'}'+
'#divPresenceModels .stale {'+
'	background-color: #DDD;'+
'	width: 40px;'+
'	overflow: hidden;'+
'	text-align: left;'+
'}'+
'#divVersion {'+
'	font-size: 12px;'+
'}'
);

$("body").append(
'<div id="divOpenPanel" class="dwScript">'+
'WGO 0.6.0'+
'</div>'+
'<div id="panelMain" class="dwScript">'+
'  <!-- Phone# <input id="txtPhoneNo" type="text" name="Phone No" placeholder="85298765432"><br>'+
'  Get...'+
'  <button type="button" id="btnGetProfile">ProfilePic</button>'+
'  <button type="button" id="btnGetStatus">Status</button>'+
'  <button type="button" id="btnGetPresence">Presence</button><br> -->'+
'  <div id="divVersion">'+
'		Script:'+
'		<div id="lblScriptVersion" class="ui_cell inline">0.2.0</div>'+
'		, UI:'+
'		<div id="lblUIVersion" class="ui_cell inline">v1710170026</div>'+
'		<a href="https://github.com/dogwong/WhatsGoingOn" target="_blank">Github</a>'+
'	</div>'+
'	'+
'  <div id="divTestArea" class="box">'+
'    <div class="divHeader">Test Area</div>'+
'    <div><input id="txtTestPhoneNo" type="text" name="Phone No" placeholder="Phone# 85298765432" size="16"><button type="button" id="btnTestGet">Get</button></div>'+
'    <div class="flexRow">'+
'      <div>'+
'        <img id="imgTestProfilePic" src="" height="50" width="50">'+
'      </div>'+
'      <div>'+
'        <div id="lblTestPhoneNo">'+
'          Phone ######'+
'        </div>'+
'        <div id="lblTestStatus">'+
'          Status'+
'        </div>'+
'        <div id="lblTestPresence">'+
'          Last Seen'+
'        </div>'+
'      </div>'+
'    </div>'+
'  </div>'+
'  <div id="divPresenceModels" class="box">'+
'    <div class="divHeader">Presence.models</div>'+
'		<div class="inline"><input id="cbAutoRefresh" class="ui_save_value" type="checkbox" checked="" disabled=""></div>'+
'		<label for="cbAutoRefresh">Auto Update UI</label>'+
'		'+
'		<div id="sdivItemTemplate">'+
'			<div id="sdivItem" class="item offline" data-wsid="(wsid)">'+
'				<img id="sdivProfilePic" class="profilepic" src="" height="20" width="20">'+
'				<div id="sdivWSid" class="inline phoneno">85298765432</div>'+
'				<div id="sdivLastSeen" class="inline lastseen">23/12 12:34:56</div>'+
'				<div id="sdivT" class="inline lastupdate" data-raw_lastupdate="">23/12 12:34:56</div>'+
'				<div class="inline stale" data-raw_stale="">Yes</div>'+
'				<div class="inline staletime">23/12 12:34:56</div>'+
'				<button type="button" id="" class="get">Get</button>'+
'				<!-- <button type="button" id="" class="add">Add</button> -->'+
'				<button type="button" id="" class="inject debugUI">Inject</button>'+
'			</div>'+
'		</div>'+
'		'+
'		<div id="sdivTableModels">'+
'			Search <input class="search">'+
'			<button class="sort" data-sort="phoneno">Sort</button>'+
'			<div id="sdivItemHeader">'+
'				<div id="sdivItem" class="item" data-wsid="" data-i="">'+
'					Pic'+
'					<div id="sdivWSid" class="inline phoneno">Phone #</div>'+
'					<div id="sdivLastSeen" class="inline lastseen">Last Seen</div>'+
'					<div id="sdivT" class="inline lastupdate" data-raw_lastupdate="">Last On/Offline</div>'+
'					<div class="inline stale" data-raw_stale="">Stale</div>'+
'				<div class="inline staletime">Stale Time</div>'+
'				</div>'+
'			</div>'+
'			<div class="list"></div>'+
'		</div>'+
'	</div>'+
'	'+
'	<!-- <div id="" class="box">'+
'	    <div class="divHeader">Record</div>'+
'		'+
'		'+
'	</div> -->'+
'	<hr>'+
'	<div id="" class="box">'+
'    <div class="divHeader">Debug</div>'+
'		<button type="button" id="btnEnableDebugUI">Enable Debug</button><br>'+
'		<div class="inline debugUI">Raw:&nbsp;</div><button type="button" id="btnPrintToConsole" class="debugUI">console.log</button><br>'+
'		<textarea id="txtRawResult" name="message" rows="3" cols="30" class="debugUI"></textarea>'+
'		<button type="button" id="btnRawResultCopy" class="debugUI">Copy</button><br>'+
'		<button type="button" id="btnEventInject" class="debugUI">All models inject</button><br>'+
'		<button type="button" id="btnLogPresence" class="debugUI">Log Presence</button><br>'+
'	</div>'+
'	'+
'</div>'
);

$("#panelMain").hide(0);
$("#divOpenPanel").hide(0);

// variables
var presenceModelsUIList;
var presenceModelsUIList;

// UI templates
var templatePresenceModelsItem = "";
var templateRecordItem = "";

function init () {
	// wait for WhatsApp app interface is shown
	if ($ && $("#pane-side").length == 1 && typeof Store == "object") {
		$("#divOpenPanel").show(0);

		// Presence models list
		templatePresenceModelsItem = $("#sdivItemTemplate").html().trim();
		$("#sdivItemTemplate").html("");
		presenceModelsUIList = new List($("#divPresenceModels #sdivTableModels")[0], {
			item: templatePresenceModelsItem,
			valueNames: [
				{name: "item", data: ["i"]},
				{name: "item", data: ["wsid"]},
				"phoneno",
				"lastseen",
				{name: "lastupdate", data: ["raw_lastupdate"]},
				"lastupdate",
				{name: "stale", data: ["raw_stale"]},
				"stale",
				"staletime",
			]
		});

		$("#divOpenPanel").text("WGO " + GM_info.script.version);
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
var presenceModelsLastUpdate_i = -1;
function presenceModelsUpdate () {
	function update () {
		if (typeof Store.Presence != "object") return 1000;
		if (typeof Store.Presence.models != "object") return 1000;

		presenceModelsLastUpdate_i++;
		if (presenceModelsLastUpdate_i >= Store.Presence.models.length) {
			presenceModelsLastUpdate_i = -1;
			return 1000;
		}

		var model = Store.Presence.models[presenceModelsLastUpdate_i];
		if (!model || !model.id) return 10;
		var wsid = model.id.split("@")[0];
		if (isNaN(wsid)) return 10;

		var target = $("#divPresenceModels #sdivTableModels .item[data-wsid='" + wsid + "']");

		// check exists in list
		var listItem = presenceModelsUIList.get("wsid", wsid);
		if (listItem.length == 0) {
			// not exists, add
			listItem = presenceModelsUIList.add({
				i: presenceModelsLastUpdate_i,
				wsid: wsid,
				phoneno: wsid,
				lastseen: "-",
				raw_lastupdate: 0,
				lastupdate: "-",
				stale: "Yes",
				raw_stale: true,
				staletime: "-",
			});
			$("#divPresenceModels .get").on("click", (event) => {
				try {
					if (event.target.parentElement.dataset["wsid"]) {
						$("#txtTestPhoneNo").val(event.target.parentElement.dataset["wsid"]);
						$("#btnTestGet").trigger("click");
					} else {

					}
				} catch (e) {

				}
			});
			$("#divPresenceModels .add").on("click", (event) => {
				try {
					if (event.target.parentElement.dataset["wsid"]) {

					} else {

					}
				} catch (e) {

				}
			});
			$("#divPresenceModels .inject").on("click", (event) => {
				try {
					if (event.target.parentElement.dataset["i"]) {
						let i = event.target.parentElement.dataset["i"];
						let wsid = event.target.parentElement.dataset["wsid"];
						Store.Presence.models[i]._events.all.push({callback: (event) => {
							var eventAry = event.split(":");
							if (eventAry.length > 1) {
								var pathAry = eventAry[1].split(".");
								var result = Store.Presence.models[i];
								try {
									for (let j = 0; j < pathAry.length; j++) {
										result = result[pathAry[j]];
									}
									console.log(i, wsid, "all", event, result);
								} catch (e) {
									console.log(i, wsid, "all", event);
								}
							} else {
								console.log(i, wsid, "all", event);
							}
						}});
						Store.Presence.models[i]._events["change:isOnline"].push({callback: (event) => {
							console.log(i, wsid, "isOnline", event);
						}});
						Store.Presence.models[i]._events["change:chatActive"].push({callback: (event) => {
							console.log(i, wsid, "chatActive", event);
						}});
					} else {

					}
				} catch (e) {
					console.log("inject Error", event.target.parentElement.dataset["i"], event.target.parentElement.dataset["wsid"], e);
				}
			});
		}

		// online / offline
		if (target.hasClass("offline") && model.isOnline) {
			target.addClass("online");
			target.removeClass("offline");
			listItem[0].values({
				lastupdate: new Date().format("dd/mm HH:MM:ss")
			});
		} else if (target.hasClass("online") && !model.isOnline) {
			target.addClass("offline");
			target.removeClass("online");
			listItem[0].values({
				lastupdate: new Date().format("dd/mm HH:MM:ss")
			});
		}
		// last seen
		if (model.all.chatstate.__x_t && model.all.chatstate.__x_t != listItem[0].values().raw_lastupdate) {
			listItem[0].values({
				raw_lastupdate: model.all.chatstate.__x_t,
				lastseen: new Date(model.all.chatstate.__x_t * 1000).format("dd/mm HH:MM:ss")
			});
		} else if (!model.all.chatstate.__x_t && listItem[0].values().raw_lastupdate != -1) {
			listItem[0].values({
				raw_lastupdate: -1,
				lastseen: "Hidden"
			});
		}
		// Stale
		if (model.all.stale != listItem[0].values().raw_stale) {
			if (model.all.stale) {
				listItem[0].values({
					raw_stale: model.all.stale,
					stale: "Yes",
					staletime: new Date().format("dd/mm HH:MM:ss"),
				});
			} else {
				listItem[0].values({
					raw_stale: model.all.stale,
					stale: "No",
					staletime: new Date().format("dd/mm HH:MM:ss"),
				});
			}
		}
		return 5;
	}
	setTimeout(presenceModelsUpdate, update());
}





// Debug
$("#btnPrintToConsole").on("click", () => {
	console.log(JSON.parse($("#txtRawResult").val()));
});

$("#btnEnableDebugUI").on("click", () => {
	$(".dwScript .debugUI").addClass("debugUIShown");
	$(".dwScript .debugUI").removeClass("debugUI");
});

$("#btnEventInject").on("click", () => {
	for (let i = 0; i < Store.Presence.models.length; i++) {
		if (!Store.Presence.models[i].__x_id) continue;
		let wsid = Store.Presence.models[i].__x_id.split("@")[0];
		if (isNaN(wsid)) continue;
		try {
			Store.Presence.models[i]._events.all.push({callback: (event) => {
				var eventAry = event.split(":");
				if (eventAry.length > 1) {
					var pathAry = eventAry[1].split(".");
					var result = Store.Presence.models[i];
					try {
						for (let j = 0; j < pathAry.length; j++) {
							result = result[pathAry[j]];
						}
						console.log(i, wsid, "all", event, result);
					} catch (e) {
						console.log(i, wsid, "all", event);
					}
				} else {
					console.log(i, wsid, "all", event);
				}
			}});
			Store.Presence.models[i]._events["change:isOnline"].push({callback: (event) => {
				console.log(i, wsid, "isOnline", event);
			}});
			Store.Presence.models[i]._events["change:chatActive"].push({callback: (event) => {
				console.log(i, wsid, "chatActive", event);
			}});
		} catch (e) {
			console.log("inject Error", i, wsid, e);
		}
	}
});

$("#btnLogPresence").on("click", () => {
	console.log(Store.Presence.models);
});







init();

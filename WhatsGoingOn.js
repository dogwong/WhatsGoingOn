// ==UserScript==
// @name         WhatsGoingOn
// @namespace    https://github.com/dogwong/WhatsGoingOn
// @version      0.0.0
// @description  WhatsApp
// @author       dogwong
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://web.whatsapp.com/
// @run-at       document-idle
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/dogwong/WhatsGoingOn/master/WhatsGoingOn.js
// @downloadURL  https://raw.githubusercontent.com/dogwong/WhatsGoingOn/master/WhatsGoingOn.js
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    // Your code here...
    GM_addStyle('.dwScript { font-family: "open sans",arial,sans-serif } .dwScript button { background-color: rgba(200, 200, 200, 1.0); border: 1px solid #000000; } .inline { display: inline-block; } #panelMain { position: absolute; top: 20px; left: 0px; height: 310px; width: calc(100% - 20px); background-color: rgba(255, 255, 255, 1.0);margin: 6px; padding: 8px; border-radius: 15px; border: 2px solid #1abf1d; font-size: 16px; } #divOpenPanel { position: absolute; top: 0px; left: 0px; height: 20px; width: 50px; background-color: rgba(26, 191, 29, 0.9); }');
    $("body").append('<div id="divOpenPanel"> WGO </div><div id="panelMain" class="dwScript"> Phone# <input id="txtPhoneNo" type="text" name="Phone No" placeholder="85298765432"><br> Get... <button type="button" id="btnGetProfile">ProfilePic</button> <button type="button" id="btnGetStatus">Status</button> <button type="button" id="btnGetPresence">Presence</button><br> ProfilePic Result:<br> <img id="imgProfile" src="" height="42" width="42"><br> Status Result:<br> <div id="lblStatus" class="inline"></div><br> Presence Result:<br> Online: <div id="lblPresenceOnline" class="inline"></div><br> LastSeen: <div id="lblPresenceLastSeen" class="inline"></div><br><hr> Raw: <button type="button" id="btnPrintToConsole">console.log</button><br> <textarea id="txtRawResult" name="message" rows="3" cols="30">Hello World </textarea> <div id="lblVersion" class="ui_cell">v1709272320</div> </div>');


$("#panelMain").hide(0);

$("#divOpenPanel").on("click", () => {
	$("#panelMain").slideToggle();
});

function checkInput () {
	if (isNaN($("#txtPhoneNo").text())) return false;
  return true;
}

$("#btnGetProfile").on("click", () => {
	if (!checkInput()) return;
	Store.ProfilePicThumb.find($("#txtPhoneNo").val() + "@c.us").then(response => {
  $("#imgProfile").attr("src", response.img);
  $("#txtRawResult").val(JSON.stringify(response));
  });
});

$("#btnGetStatus").on("click", () => {
	if (!checkInput()) return;
	Store.Wap.statusFind($("#txtPhoneNo").val() + "@c.us").then(response => {
  $("#lblStatus").text(response.status);
  $("#txtRawResult").val(JSON.stringify(response));
  });
});

$("#btnGetPresence").on("click", () => {
	if (!checkInput()) return;
	Store.Presence.find($("#txtPhoneNo").val() + "@c.us").then(response => {
  $("#lblPresenceOnline").text(response.isOnline);
  var lastseen = "Hidden / Error";
  if (response.all.chatstate.__x_t) {
  	lastseen = response.all.chatstate.__x_t + " (";
    lastseen += new Date(response.all.chatstate.__x_t * 1000).toString();
    lastseen += ")";
  }
  $("#lblPresenceLastSeen").text(lastseen);
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

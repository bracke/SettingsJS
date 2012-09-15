/*

 SettingsJS
 Author: Bent Bracke, bracke.dk
 License: MIT license http://opensource.org/licenses/mit-license.php/

 Example          : var settingsobj = settings(JSON,settingscontainerid,settings);
 Example JSON     : { "sleep_time": { "enabled": true }, "trend_location":  { "name": "Worldwide", "woeid": 1, "country": "",
                      "url": "http://where.yahooapis.com/v1/place/1" }, "geo_enabled": true }

 Example settings : { "defaulttabname" : "Main", "formfield_nameprefix" : "Settingsformfield" }

 */

var settings = (function () {

    "use strict";

    var model; var unchangedModel; var settingsconfig;
    var default_config = { "defaulttabname" : "General", "formfield_nameprefix" : "SettingsFormField" }

    var constructor = function settings(jsonobject, settingscontainer, config) {

        /* Sanitize model argument */
        if (typeof jsonobject != "object")
        {
            if (jsonobject.length == 0 || typeof jsonobject != "string")
            {
                jsonobject = {};
            }
            else
            {
                jsonobject = eval('(' + jsonobject + ')');
            }
        }

        /* Sanitize config argument */
        settingsconfig = config ? config : default_config;


        model = jsonobject; unchangedModel = model;

        var new_content = generate_tabs(settingsconfig.defaulttabname);

        new_content += "<div id='tabcontent'>";
        new_content += generate_tabcontent(settingsconfig.defaulttabname);
        new_content += "</div>";

        /* Insert generated content */
        var settings_container = document.getElementById(settingscontainer);
        settings_container.innerHTML = new_content;
    }
    constructor.switch_tab = function (activetabname) {

        update_model();

        var new_content = generate_tabcontent(activetabname);

        /* Insert generated content */
        var tabcontent = document.getElementById("tabcontent");
        tabcontent.innerHTML = new_content;

        /* Switch selected tab */
        var current_tabs = document.getElementsByClassName("active");
        if (current_tabs.length > 0) {
            var current_tab = current_tabs[0];
            if (current_tab != null) {
                current_tab.classList.remove('active');
            }
        }
        var new_tab = document.getElementById("tab_" + activetabname);
        new_tab.classList.add('active');
    }
    constructor.getSettings = function () {

        update_model();
        return model;
    }
    constructor.getJSONSettings = function () {

        update_model();
        return JSON.stringify(model);
    }
    constructor.resetModel = function(){

        model = unchangedModel;
        update_model();
    }
    var update_model = function () {
        var current_tabs = document.getElementsByClassName("active");
        if (current_tabs.length > 0) {
            var current_tab = current_tabs[0]; var current_tabid = current_tab.id;

            var tabname = current_tabid.substring("tab_".length,current_tabid.length);
            var tabmodel = tabname == settingsconfig.defaulttabname ? model : model[tabname];
            var first = true;

            /* Convention: Second level objects are tabs */
            for (var key in tabmodel) {

                if (tabmodel.hasOwnProperty(key)) /* Ignore inherited properties */ {

                    switch (typeof tabmodel[key]) {

                        case "object"  :

                            break;

                        case "number"  :

                            var numbertextbox = document.getElementById(settingsconfig.formfield_nameprefix + key);
                            if (numbertextbox != null)
                            {
                                tabmodel[key] = parseInt(numbertextbox.value,10);
                            }
                            break;

                        case "string"  :

                            var textbox = document.getElementById(settingsconfig.formfield_nameprefix + key);
                            if (textbox != null)
                            {
                                tabmodel[key] = textbox.value;
                            }
                            break;

                        case "boolean" :

                            var checkbox = document.getElementById(settingsconfig.formfield_nameprefix + key);
                            if (checkbox != null)
                            {
                                tabmodel[key] = checkbox.checked;
                            }
                            break;

                        default : break;
                    }
                }
            }
        }
    }
    var generate_tab = function (tab, activetabname) {

        var new_content = "<li id='tab_" + tab + "'";
        new_content += activetabname == tab ? " class='active' " : "";
        new_content += "><a href=\"javascript:settings.switch_tab('" + tab + "');\">" + prettify_Label(tab) + "</a></li>";

        return new_content;
    }
    var generate_tabs = function (activetabname) {

        var new_content = "<ul class='nav nav-tabs'>";
        new_content += generate_tab(settingsconfig.defaulttabname, activetabname);

        /* Convention: First level objects are tabs */
        for (var key in model) {

            if (model.hasOwnProperty(key)) /* Ignore inherited properties */ {

                if (typeof model[key] == "object") {
                    new_content += generate_tab(key, activetabname);
                }
            }
        }
        new_content += "</ul>";

        return new_content;
    }
    var prettify_Label = function(label){
        var name = label;

        name = name.replace(/_/g, " ");
        name = (name.substr(0,1)).toUpperCase() + name.substr(1,name.length);

        return name;
    }
    var guess_inputTypeText = function (key) {
        var inputtype = "text";

        if (key != null && key.length > 0) {

            switch (key.toLowerCase()) {

                case "find"     :
                case "search"   : inputtype = "search"; break;

                case "datetime" : inputtype = "datetime"; break;
                case "date"     : inputtype = "date"; break;
                case "time"     : inputtype = "time"; break;
                case "week"     : inputtype = "week"; break;
                case "month"    : inputtype = "month"; break;

                case "color"    :
                case "colour"   : inputtype = "color"; break;

                case "passcode" :
                case "code"     :
                case "password" : inputtype = "password"; break;

                case "mailto"   :
                case "mail"     :
                case "email"    : inputtype = "email"; break;

                case "link"     :
                case "href"     :
                case "www"      :
                case "url"      : inputtype = "url"; break;

                case "phone"       :
                case "telephone"   :
                case "tel"         : inputtype = "tel"; break;

                default : inputtype = "text"; break;
            }
        }
        return inputtype;
    }
    var guess_inputTypeNumber = function (key) {
        var inputtype = "number";

        if (key != null && key.length > 0) {

            switch (key.toLowerCase()) {

                case "week"         : inputtype = "week"; break;
                case "month"        : inputtype = "month"; break;

                case "passcode"     :
                case "code"         :
                case "password"     : inputtype = "password"; break;

                case "phone"        :
                case "telephone"    :
                case "tel"          : inputtype = "tel"; break;

                default : inputtype = "number"; break;
            }
        }
        return inputtype;
    }
    var generate_tabcontent = function (tabname) {

        var new_content = "<form class='form-horizontal'>";
        var tabmodel = tabname == settingsconfig.defaulttabname ? model : model[tabname];
        var first = true;

        /* Convention: Second level objects are tabs */
        for (var key in tabmodel) {

            if (tabmodel.hasOwnProperty(key)) /* Ignore inherited properties */ {

                switch (typeof tabmodel[key]) {

                    case "object"  :

                        break;

                    case "number"  :

                        new_content += "<div class='control-group'>"+
                            "<label class='control-label' for='" + settingsconfig.formfield_nameprefix + key + "'>" + prettify_Label(key) + "</label>" +
                            "<div class='controls'>" +
                            "<input type='"+guess_inputTypeNumber(key)+"' id='" + settingsconfig.formfield_nameprefix + key + "' placeholder='" + key + "'";
                        if (first) {
                            new_content += " autofocus=autofocus ";
                            first = false;
                        }
                        new_content += " value='" + tabmodel[key] + "'></div></div>";
                        break;

                    case "string"  :

                        new_content += "<div class='control-group'>"+
                                       "<label class='control-label' for='" + settingsconfig.formfield_nameprefix + key + "'>" + prettify_Label(key) + "</label>" +
                                       "<div class='controls'>" +
                                       "<input type='"+guess_inputTypeText(key)+"' id='" + settingsconfig.formfield_nameprefix + key + "' placeholder='" + key + "'";
                        if (first) {
                            new_content += " autofocus=autofocus ";
                            first = false;
                        }
                        new_content += " value='" + tabmodel[key] + "'></div></div>";
                        break;

                    case "boolean" :

                        new_content += "<div class='control-group'><div class='controls'>" +
                                       "<label class='checkbox'><input id='" + settingsconfig.formfield_nameprefix  + key + "' type='checkbox'";

                        if (tabmodel[key]) { new_content += " checked "; }
                        new_content += ">" + prettify_Label(key) + "</label></div></div>";
                        break;

                    default : break;
                }
            }
        }
        new_content += "</form>";

        return new_content;
    }

    /* The public parts */
    return constructor;
})();
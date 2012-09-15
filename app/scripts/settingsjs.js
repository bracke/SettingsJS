/*

 SettingsJS v1.0.0
 Author: Bent Bracke, bracke.dk
 License: MIT license http://opensource.org/licenses/mit-license.php/

 Example          : var settingsobj = settings(JSON,settingscontainerid,settings);
 Example JSON     : {"ircEvent":"PRIVMSG", "method":"newURI", "regex":"^http://.*", "subobject":{  "whatever1" :true, "whatever2" :""  }}
 Example settings : { "defaulttabname" : "Main", "formfield_nameprefix" : "Settingsformfield" }

 */


var settings = (function () {

    "use strict";

    var model; var settingsconfig;
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


        model = jsonobject;

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
    var update_model = function ()
    {
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
        new_content += "><a href=\"javascript:settings.switch_tab('" + tab + "');\">" + tab + "</a></li>";

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

                    case "string"  :

                        new_content += "<div class='control-group'>"+
                                       "<label class='control-label' for='" + settingsconfig.formfield_nameprefix + key + "'>" + key + "</label>" +
                                       "<div class='controls'>" +
                                       "<input type='text' id='" + settingsconfig.formfield_nameprefix + key + "' placeholder='" + key + "'";
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
                        new_content += ">" + key + "</label></div></div>";
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
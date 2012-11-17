/**
 * Settings.js
 *
 * License: MIT license http://opensource.org/licenses/mit-license.php/
 *
 * Example          : var settingsobj = settings(JSON,settingscontainerid,settings);
 * Example JSON     : { "sleep_time": { "enabled": true }, "trend_location":  { "name": "Worldwide", "woeid": 1, "country": "",
 *                      "url": "http://where.yahooapis.com/v1/place/1" }, "geo_enabled": true }
 *
 * Example settings : { "defaulttabname" : "Main", "formfield_nameprefix" : "Settingsformfield" }
 *
 * @name Settings
 * @author Bent Bracke, bracke.dk, @bentbracke
 * @version 1.0.0
 *
 */



;(function (Settings, undefined) {

    Settings.NAME = 'Settingsjs';
    Settings.VERSION = '1.0.0';

    var _model, _unchangedModel, _settingsconfig, _settingscontainer;
    var _default_config = { "defaulttabname" : "General", "formfield_nameprefix" : "SettingsFormField" }

    function clone(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = obj.constructor(); // changed

        for(var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }

    /**
     * Initializes Settingsjs and creates the Settings GUI.
     *
     * @method initialize
     * @param {Object} jsonobject The datastructure of this object is used as a template for generating the Settings GUI
     * @param {String} settingscontainer The id of the HTML element into which the generated GUI will be inserted
     * @param {Object} config An object containing settings for settingsjs!
     * @api public
     */
    Settings.initialize = function (jsonobject, settingscontainer, config) {

        /* Sanitize arguments */
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
        if (typeof config != "object")
        {
            if ('undefined' === typeof config || config.length == 0 || typeof config != "string")
            {
                config = _default_config;
            }
            else
            {
                config = eval('(' + config + ')');
            }
        }

        if ('undefined' === typeof config.defaulttabname)       { config.defaulttabname         =  _default_config.defaulttabname; }
        if ('undefined' === typeof config.formfield_nameprefix) { config.formfield_nameprefix   =  _default_config.formfield_nameprefix; }

        _settingsconfig = config;

        if ('undefined' === typeof settingscontainer || settingscontainer.length == 0 || typeof settingscontainer != "string")
        {
            settingscontainer = "";
        }
        _settingscontainer = settingscontainer;

        _model = jsonobject;
        _unchangedModel = clone(jsonobject);

        /* Tab row */
        var new_content = generate_tabs(_settingsconfig.defaulttabname);

        /* Content of active tab */
        new_content += "<div id='tabcontent'>";
        new_content += generate_tabcontent(config.defaulttabname);
        new_content += "</div>";

        /* Insert generated content */
        var settings_container = settingscontainer !=null && settingscontainer.length > 0 ? document.getElementById(settingscontainer) : null;

        if (settings_container != null)
        {
            settings_container.innerHTML = new_content;
        }
        return _model;
    }

    /**
     * Switches active tab.
     *
     * @method switch_tab
     * @param {String} activetabname Name of the tab to be switched to
     * @api public
     */
    Settings.switch_tab = function(activetabname) {

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
    /**
     * Returns current settings from the generated GUI.
     *
     * @function getSettings
     * @return {Object} Current settings from the generated GUI.
     * @api public
     */
    Settings.getSettings = function() {

        update_model();
        return _model;
    }
    /**
     * Returns current settings from the generated GUI as a JSON string.
     *
     * @function getJSONSettings
     * @return {String} Current settings from the generated GUI as a JSON string.
     * @api public
     */
    Settings.getJSONSettings = function () {

        update_model();
        return JSON.stringify(_model);
    }
    /**
     * Resets settings GUI back to start values.
     *
     * @method resetModel
     * @api public
     *
     */
    Settings.resetModel = function(){

        this.initialize(_unchangedModel, _settingscontainer, _settingsconfig);
    }
    /**
     * Returns the current configuration of SettingsJS.
     *
     * @function getSettingsConfig
     * @return {Object} The current configuration of SettingsJS.
     * @api public
     */
    Settings.getSettingsConfig = function() {
        return _settingsconfig;
    }
    /**
     *
     * @function prettify_Label
     * @param {String} label Ugly label
     * @return {String} Pretty label
     * @api public
     *
     */
    Settings.prettify_Label = function (label){

        var name = ('undefined' === typeof label) ? "" : label;

        name = name.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
        name = name.replace(/_/g, " ");
        name = (name.substr(0,1)).toUpperCase() + name.substr(1,name.length);

        return name.trim();
    }

    function update_model() {
        var current_tabs = document.getElementsByClassName("active");
        if (current_tabs.length > 0) {
            var current_tab = current_tabs[0]; var current_tabid = current_tab.id;

            var tabname = current_tabid.substring("tab_".length,current_tabid.length);
            var tabmodel = tabname == _settingsconfig.defaulttabname ? _model : _model[tabname];
            var first = true;

            /* Convention: Second level objects are tabs */
            for (var key in tabmodel) {

                if (tabmodel.hasOwnProperty(key)) /* Ignore inherited properties */ {

                    switch (typeof tabmodel[key]) {

                        case "object"  :

                            break;

                        case "number"  :

                            var numbertextbox = document.getElementById(_settingsconfig.formfield_nameprefix + key);
                            if (numbertextbox != null)
                            {
                                tabmodel[key] = parseInt(numbertextbox.value,10);
                            }
                            break;

                        case "string"  :

                            var textbox = document.getElementById(_settingsconfig.formfield_nameprefix + key);
                            if (textbox != null)
                            {
                                tabmodel[key] = textbox.value;
                            }
                            break;

                        case "boolean" :

                            var checkbox = document.getElementById(_settingsconfig.formfield_nameprefix + key);
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
    function generate_tab(tab, activetabname) {

        var new_content = "<li id='tab_" + tab + "'";
        new_content += activetabname == tab ? " class='active' " : "";
        new_content += "><a id='link_" + tab + "' href='#' OnClick=\"Settings.switch_tab('" + tab + "');\">" + Settings.prettify_Label(tab) + "</a></li>";

        return new_content;
    }
    function generate_tabs(activetabname) {

        var new_content = "<ul class='nav nav-tabs'>"; var isvalid = false;
        new_content += generate_tab(_settingsconfig.defaulttabname, activetabname);


        /* Convention: First level objects are tabs */
        for (var key in _model) {

            isvalid = key.substr(0,1) != "_";
            isvalid = isvalid &&  _model.hasOwnProperty(key);

            if (isvalid) /* Ignore inherited properties */ {

                if (typeof _model[key] == "object") {
                    new_content += generate_tab(key, activetabname);
                }
            }
        }
        new_content += "</ul>";

        return new_content;
    }
    function guess_inputTypeText(key) {
        var inputtype = "text";

        if (key != null && key.length > 0) {

            switch (key.toLowerCase()) {

                case "find"     :
                case "lookup"   :
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
                case "cellphone"   :
                case "mobile"      :
                case "tel"         : inputtype = "tel"; break;

                default : inputtype = "text"; break;
            }
        }
        return inputtype;
    }
    function guess_inputTypeNumber(key) {
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
                case "cellphone"    :
                case "mobile"       :
                case "tel"          : inputtype = "tel"; break;

                default : inputtype = "number"; break;
            }
        }
        return inputtype;
    }
    function generate_tabcontent(tabname) {

        var new_content = "<form class='form-horizontal'>";
        var tabmodel = tabname == _settingsconfig.defaulttabname ? _model : _model[tabname];
        var first = true, isvalid = false;

        /* Convention: Second level objects are tabs */
        for (var key in tabmodel) {

            isvalid = key.substr(0,1) != "_";
            isvalid = tabmodel.hasOwnProperty(key);

            if (isvalid) /* Ignore inherited properties and properties starting with '_' */ {

                switch (typeof tabmodel[key]) {

                    case "object"  :

                        break;

                    case "number"  :

                        new_content += "<div class='control-group'>"+
                            "<label class='control-label' for='" + _settingsconfig.formfield_nameprefix + key + "'>" + Settings.prettify_Label(key) + "</label>" +
                            "<div class='controls'>" +
                            "<input type='"+guess_inputTypeNumber(key)+"' id='" + _settingsconfig.formfield_nameprefix + key + "' placeholder='" + key + "'";
                        if (first) {
                            new_content += " autofocus=autofocus ";
                            first = false;
                        }
                        new_content += " value='" + tabmodel[key] + "'></div></div>";
                        break;

                    case "string"  :

                        new_content += "<div class='control-group'>"+
                                       "<label class='control-label' for='" + _settingsconfig.formfield_nameprefix + key + "'>" + Settings.prettify_Label(key) + "</label>" +
                                       "<div class='controls'>" +
                                       "<input type='"+guess_inputTypeText(key)+"' id='" + _settingsconfig.formfield_nameprefix + key + "' placeholder='" + key + "'";
                        if (first) {
                            new_content += " autofocus=autofocus ";
                            first = false;
                        }
                        new_content += " value='" + tabmodel[key] + "'></div></div>";
                        break;

                    case "boolean" :

                        new_content += "<div class='control-group'><div class='controls'>" +
                                       "<label class='checkbox'><input id='" + _settingsconfig.formfield_nameprefix  + key + "' type='checkbox'";

                        if (tabmodel[key]) { new_content += " checked "; }
                        new_content += ">" + Settings.prettify_Label(key) + "</label></div></div>";
                        break;

                    default : break;
                }
            }
        }
        new_content += "</form>";

        return new_content;
    }
})(window.Settings = window.Settings || {});
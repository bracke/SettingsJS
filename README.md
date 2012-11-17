# SettingsJS

SettingsJS is a JavaScript library which creates a GUI for changing the settings of your app or site.

SettingsJS takes your settings data in JSON as input and creates a GUI for viewing and changing every setting. The changed settings can be read back in JSON format.

       JSON as input:
        
       { "Textfield":  "message", 
         "subobject": { "whatever1" :true, "whatever2" :""  }
       }
          

--

![Simple GUI created by SettingsJS](http://dl.dropbox.com/u/2655896/simplegui_small.png).

--

## Usage

Include `settingsjs.js` in your HTML file:

    <script src="settingsjs.js"></script>


Initialize SettingsJS with your settings:

	Settings.initialize("{ 'Textfield':  'message',  'subobject': {'whatever1' :true, 'whatever2' :''  }}", "settingscontainer", "");


SettingsJS creates a GUI for changing these settings and inserts the generated HTML into the element with the id "settingscontainer".
The generated GUI is fully functional and uses HTML 5 form improvements.

After the settings have been changed, get the updated settings from SettingsJS:

	var updatedSettings = Settings.getJSONSettings();

or even better, turn it into an eventhandler and call it from a save icon:


	document.getElementById("myFancySaveIcon").onclick = function () {
	
  		var updatedSettings = Settings.getJSONSettings();
  		
  		/* insert code to save data here */
  		
  		return false; 	
	};

and add an AJAX call (using jQuery) to save the changed settings (in this example using MongoLab):

	$.ajax( { url  : "https://api.mongolab.com/api/1/databases/my-db/collections/my-coll/MySettingsDocumentID/?apiKey=myAPIKey",
          	  data : updatedSettings,
          	  type : "PUT",
              contentType: "application/json" } ); 
          

## Generated GUI

The generated HTML GUI consists of a list of all sections and a div containing the active and visible section.

There is always at least one section (normally named "General") and each object in the JSON settings is represented as another section.

* Boolean values are represented using checkbox input fields.
* Number values are represented using number input fields.
* String values are represented using text input fields.

SettingsJS attempts to recognize other kinds of data based on the attribute name:

| Name         | Input type        |
|--------------|-------------------|
| find,lookup,search | search            |
| datetime 	   | datetime          |
| date         | date              |
| time         | time              |
| week         | week              |
| month        | month             |
| color,colour | color             | 
| passcode,code,password | password|
| mailto, mail, email    | email   |
| link,href,www,url      | url     |
| phone,telephone,cellphone,mobile,tel    | tel     |


The label associated with any field is also generated based on the attribute name but is run through a "prettifier" which attempts to ensure the labels are readable:


* Any '_' is replaced with a space.
* The case of all characters is set to lowercase except the first character which is set to uppercase.


## Styling

The look of the generated GUI is easily changed, by styling the classes of the generated elements.

The class names follow the Twitter Bootstrap definitions and simply applying the Twitter Bootstrap will give you a nice layout to start from.


## Settings for SettingsJS

The initialize method takes a configuration object containing the following settings:

* defaulttabname (default is "General")
* formfield_nameprefix (default is "SettingsFormField")

Example:

	{ "defaulttabname" : "General", "formfield_nameprefix" : "SettingsFormField" }

## License

Copyright &copy; 2012 Bent Bracke

MIT License.

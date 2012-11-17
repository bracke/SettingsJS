var GenericInitializationTest = function () {
    it('Settings.NAME', function () {

        var name = Settings.NAME;

        expect(name).to.be.a('string');
        expect(name.length).to.be.greaterThan(0);
        expect(name).to.equal('Settingsjs');
    });

    it('Settings.VERSION', function () {

        var version = Settings.VERSION;

        expect(version).to.be.a('string');
        expect(version.length).to.be.greaterThan(0);
    });

    it('Settings.getJSONSettings()', function () {

        var jsonsettings = Settings.getJSONSettings();

        expect(jsonsettings).to.be.a('string');
        expect(jsonsettings.length).to.be.greaterThan(0);
    });

    it('Settings.getSettings()', function () {

        var settings = Settings.getSettings();

        expect(settings).to.be.a('object');
    });
}
var GenericConfigTest = function () {
    var config = Settings.getSettingsConfig();
    it('Settings.getSettingsConfig()', function () {

        expect(config).not.to.be.null;
        expect(config).to.be.a('object');

    });

    var defaulttabname = config.defaulttabname;
    it('config.defaulttabname', function () {
        expect(defaulttabname).to.be.a('string');
        expect(defaulttabname.length).to.be.greaterThan(0);
    });

    var formfield_nameprefix = config.formfield_nameprefix;
    it('config.formfield_nameprefix', function () {
        expect(formfield_nameprefix).to.be.a('string');
        expect(formfield_nameprefix.length).to.be.greaterThan(0);
    });
}
describe('Test initialization', function () {
    describe('Settings.initialize("","","")', function () {

        Settings.initialize("", "", "");

        GenericInitializationTest();
    });

    describe('Settings.initialize("{\'teststring\':\'stringvalue\', \'testnumber\': 0, \'testbool\': false }","")', function () {

        Settings.initialize("{'teststring':'stringvalue', 'testnumber':0, 'testbool': false }", "", "");

        GenericInitializationTest();
    });

    describe('Settings.initialize("{\'firstlevel\': {\'secondlevel\': \'nothing\' }}","")', function () {

        Settings.initialize("{'firstlevel': {'secondlevel': 'nothing' }}", "", "");

        GenericInitializationTest();
    });

    describe('Settings.initialize("{\'firstlevel\': {\'secondlevel\': {\'thirdlevel\': \'nothing\' }}}","")', function () {

        Settings.initialize("{'firstlevel': {'secondlevel':  {'thirdlevel': 'nothing' }}}", "");

        GenericInitializationTest();
    });

    describe('Settings.initialize("{\"ircEvent\":\"PRIVMSG\", \"method\":\"newURI\", \"regex\":\"^http://.*\", \"subobject\":{  \"whatever1\" :true, \"whatever2\" :\"\"  }}","")', function () {

        Settings.initialize('{"ircEvent":"PRIVMSG", "method":"newURI", "regex":"^http://.*", "subobject":{  "whatever1" :true, "whatever2" :""  }}', "", "");

        GenericInitializationTest();
    });

    describe('Config: Settings.initialize("{}","","{}")', function () {

        Settings.initialize("{}", "", "");

        GenericInitializationTest();
        GenericConfigTest();

    });

    describe('Config: Settings.initialize("{}","{ \"defaulttabname\" : \"Main\", \"formfield_nameprefix\" : \"Settingsformfield\" }")', function () {

        Settings.initialize("{}", "{}", "{ 'defaulttabname' : 'Main', 'formfield_nameprefix' : 'Settingsformfield' }");

        GenericInitializationTest();
        GenericConfigTest();

        var config = Settings.getSettingsConfig();
        it('defaulttabname = Main', function () {

            var defaulttabname = config.defaulttabname;
            expect(defaulttabname).not.to.be.null;
            expect(defaulttabname).to.be.a('string');
            expect(defaulttabname).to.equal("Main");

        });

        it('formfield_nameprefix = Settingsformfield', function () {

            var formfield_nameprefix = config.formfield_nameprefix;
            expect(formfield_nameprefix).not.to.be.null;
            expect(formfield_nameprefix).to.be.a('string');
            expect(formfield_nameprefix).to.equal("Settingsformfield");

        });
    });
});
describe('Test of generated UI', function () {

    // Prepare container for ui
    var newdiv = document.createElement("div");
    newdiv.id = "settingscontainer";
    document.body.appendChild(newdiv);
    var checkbox, numberfield, textfield;

    Settings.initialize("{'Firstlevel':'teststring','secondtab':{'secondlevelnumber':0,'secondlevelbool':true,'secondleveltext':''}}", "settingscontainer", "");

    describe("Initialize with: { 'Firstlevel' : 'teststring', 'secondtab' : { 'secondlevelnumer' : 0, 'secondlevelbool':true } }", function () {

        GenericInitializationTest();
        GenericConfigTest();

    });

    describe("Test tabs", function () {

        it('Main tab', function () {

            var maintab = $('#tab_General');

            expect(maintab).not.to.be.null;
            expect(maintab).not.to.be.undefined;
            expect(maintab).to.have.class("active");
            expect(maintab).to.be.visible;

            var maintab = $('#link_General');

            expect(maintab).not.to.be.null;
            expect(maintab).not.to.be.undefined;
            expect(maintab).to.have.html("General");

        });

        it('Second tab', function () {

            var secondtab = $('#tab_secondtab');

            expect(secondtab).not.to.be.null;
            expect(secondtab).not.to.be.undefined;
            expect(secondtab).to.be.visible;
            expect(secondtab).to.have.text("Secondtab");

            expect(secondtab).not.to.have.class("active");

        });
    });

    describe("Switch tabs", function () {

        var linksecondtab = $('#link_secondtab');

        before(function () {
            linksecondtab.click();
        });

        var secondtab = $('#tab_secondtab');
        var maintab = $('#tab_General');

        it('Main tab', function () {

            expect(maintab).not.to.be.null;
            expect(maintab).not.to.be.undefined;
            expect(maintab).to.be.visible;
            expect(maintab).to.have.text("General");
            expect(maintab).not.to.have.class("active");

        });

        it('Second tab', function () {

            var secondtab = $('#tab_secondtab');

            expect(secondtab).not.to.be.null;
            expect(secondtab).not.to.be.undefined;
            expect(secondtab).to.be.visible;
            expect(secondtab).to.have.text("Secondtab");
            expect(secondtab).to.have.class("active");

        });

    });

    describe("Update settings", function () {

        checkbox = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelbool');

        describe("Start value", function () {
            it('Current setting: Checkbox is not checked', function () {
                expect(checkbox).not.to.be.null;
                expect(checkbox).not.to.be.undefined;
                expect(checkbox).not.to.be.checked;
            });
        });

        describe("After change", function () {
            before(function () {
                $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelbool').attr('checked', true);
                checkbox = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelbool');
            });

            it('Current setting: Checkbox is now checked', function () {
                expect(checkbox).to.be.checked;
            });
        });

        numberfield = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelnumber');

        describe("Start value", function () {
            before(function () {
                numberfield = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelnumber');
            });
            it('Current setting: number is 0', function () {
                expect(numberfield).not.to.be.null;
                expect(numberfield).not.to.be.undefined;
                expect(numberfield.val()).to.equal("0");
            });
        });

        describe("After change", function () {
            before(function () {
                $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelnumber').val("1");
            });

            it('Current setting: number is now 1', function () {
                expect(numberfield.val()).to.equal("1");
            });
        });

        describe("Start value", function () {
            before(function () {
                textfield = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondleveltext');
            });

            it('Current setting: text is empty', function () {
                expect(textfield).not.to.be.null;
                expect(textfield).not.to.be.undefined;
                expect(textfield.val()).to.equal("");
            });

        });

        describe("After change", function () {
            before(function () {

                $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondleveltext').val("text");
            });

            it('Current setting: text is now text', function () {
                expect(textfield.val()).to.equal("text");
            });
        });

        describe("Switch tabs", function () {

            var secondtab, maintab, linksecondtab;

            before(function () {
                maintab = $('#link_General');
                maintab.click();

                secondtab = $('#tab_secondtab');
                maintab = $('#tab_General');
            });

            it('Main tab', function () {
                expect(maintab).to.have.class("active");
            });

            it('Second tab', function () {

                var secondtab = $('#tab_secondtab');
                expect(secondtab).not.to.have.class("active");

            });

        });

        var maintab;

        describe("Test General tab", function () {
            before(function () {
                maintab = $('#tab_General');
                textfield = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'Firstlevel');
            });

            it("Test whether switch was successfull", function () {
                expect(maintab).not.to.be.null;
                expect(maintab).not.to.be.undefined;
                expect(maintab).to.have.class("active");
                expect(maintab).to.be.visible;

                expect(textfield).not.to.be.null;
                expect(textfield).not.to.be.undefined;


            });
        });


    });


    describe("Switch to second tab", function () {

        var linksecondtab = $('#link_secondtab');

        before(function () {
            linksecondtab.click();
            checkbox = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelbool');
            numberfield = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondlevelnumber');
            textfield = $('#' + Settings.getSettingsConfig().formfield_nameprefix + 'secondleveltext');
        });

        var maintab = $('#tab_secondtab');

        it("Test whether switch was successfull", function () {

            expect(maintab).not.to.be.null;
            expect(maintab).not.to.be.undefined;
            expect(maintab).to.have.class("active");
            expect(maintab).to.be.visible;

        });
        it('Test choices on second tab', function () {
            expect(checkbox).not.to.be.null;
            expect(checkbox).not.to.be.undefined;
            expect(checkbox).to.be.checked;

            expect(numberfield).not.to.be.null;
            expect(numberfield).not.to.be.undefined;
            expect(numberfield.val()).to.equal("1");

            expect(textfield).not.to.be.null;
            expect(textfield).not.to.be.undefined;
            expect(textfield.val()).to.equal("text");
        });

    });

    describe("Fetch updated settings", function () {

        var updatedsettings;

        before(function () {
            updatedsettings = eval('(' + Settings.getJSONSettings() + ')');
        });

        it('Test values', function () {
            expect(updatedsettings.secondtab.secondlevelnumber).to.equal(1);
            expect(updatedsettings.secondtab.secondlevelbool).to.equal(true);
            expect(updatedsettings.secondtab.secondleveltext).to.equal("text");
        });
    });
});








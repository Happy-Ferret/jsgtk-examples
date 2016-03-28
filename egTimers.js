#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
emulating setTimeout, clearTimeout, setInterval and clearInterval
functions.

Run it with:
    jsgtk egTimers.js
*/

const Gtk = require('Gtk');

// actually not necessary since in jsgtk both
// setTimeout and setInterval are global by default
// same as it is in Node.JS
const timers    = require('timers');

const App = function () { 

    this.title = 'Example Timers';
    require('GLib').setPrgname(this.title);

    this.idTimeout;
    this.idInterval;
    this.counter = 0;
};

App.prototype.run = function (ARGV) {

    this.application = new Gtk.Application();
    this.application.connect('activate', this.onActivate.bind(this));
    this.application.connect('startup', this.onStartup.bind(this));
    this.application.run([]);
};

App.prototype.onActivate = function () {
    this.window.showAll();
};

App.prototype.onStartup = function() {
    this.buildUI();
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              defaultHeight: 200,
                                              defaultWidth: 200,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.window.setIconFromFile(__dirname + '/assets/appIcon.png');
    } catch (err) {
        this.window.setIconName('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let grid, buttonST, buttonCT, buttonSI, buttonCI;

    grid = new Gtk.Grid({ columnSpacing: 6, rowSpacing: 6 });
    grid.setBorderWidth(8);

    buttonST = new Gtk.Button({ label: "setTimeout" });
    buttonST.connect ('clicked', this.actionSetTimeout.bind(this));

    this.buttonCT = new Gtk.Button({ label: "clearTimeout" });
    this.buttonCT.connect ('clicked', this.actionClearTimeout.bind(this));
    this.buttonCT.setSensitive(false);

    this.labelS = new Gtk.Label({ label: "-" });
    this.labelS.setSizeRequest(200, -1);

    buttonSI = new Gtk.Button({ label: "setInterval" });
    buttonSI.connect ('clicked', this.actionSetInterval.bind(this));

    this.buttonCI = new Gtk.Button({ label: "clearInterval" });
    this.buttonCI.connect ('clicked', this.actionClearInterval.bind(this));
    this.buttonCI.setSensitive(false);

    this.labelC = new Gtk.Label({ label: "-" });
    this.labelC.setSizeRequest(200, -1);

    grid.attach(buttonST, 0, 0, 1, 1);
    grid.attach(this.buttonCT, 1, 0, 1, 1);
    grid.attach(this.labelS, 2, 0, 1, 1);
    grid.attach(buttonSI, 0, 1, 1, 1);
    grid.attach(this.buttonCI, 1, 1, 1, 1);
    grid.attach(this.labelC, 2, 1, 1, 1);

    return grid;
};

App.prototype.actionSetTimeout = function () {

    this.buttonCT.setSensitive(true);
    this.labelS.setText('Wait 2s');
    this.idTimeout = timers.setTimeout(() => {

        this.buttonCT.setSensitive(false);
        this.labelS.setText('Now');

    }, 2000);
};

App.prototype.actionClearTimeout = function () {

    this.buttonCT.setSensitive(false);
    this.labelS.setText('-');
    timers.clearTimeout(this.idTimeout);
};

App.prototype.actionSetInterval = function () {

    this.buttonCI.setSensitive(true);
    this.labelC.setText('Wait');
    this.counter = 0;
    this.idInterval = setInterval(() => {
        this.counter = this.counter + 1;
        this.labelC.setText(this.counter.toString());
    }, 500);
};

App.prototype.actionClearInterval = function () {

    this.buttonCI.setSensitive(false);
    this.labelC.setText('-');
    clearInterval(this.idInterval);
};

//Run the application
let app = new App();
app.run(ARGV);

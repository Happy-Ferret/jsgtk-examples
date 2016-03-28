#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
setting the application icon from the 'assets' folder and if
not available from the 'stock icons'

Run it with:
    jsgtk egIcon.js
*/

const
    Gtk = require('Gtk'),
    GLib = require('GLib')
;

const App = function () { 
    this.title = 'Example Icon';
    GLib.setPrgname(this.title);
};

App.prototype.run = function () {

    this.application = new Gtk.Application();
    this.application.on('activate', this.onActivate.bind(this));
    this.application.on('startup', this.onStartup.bind(this));
    this.application.run([]);
};

App.prototype.onActivate = function () {

    this.window.showAll();
};

App.prototype.onStartup = function() {

    this.buildUI();
};

App.prototype.buildUI = function() {

    let result = false;

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

    this.label = new Gtk.Label({ label: "Hello icon" });
    this.window.add(this.label);
};

//Run the application
let app = new App();
app.run();

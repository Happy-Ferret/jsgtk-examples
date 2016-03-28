#!/usr/bin/env jsgtk

/*
JSGtk example showing how to build Gtk javascript applications
using Gtk.Image

Run it with:
    jsgtk egAsset.js
*/

const
    Gio = require('Gio'),
    GLib = require('GLib'),
    Gtk = require('Gtk')
;

const App = function () { 
    this.title = 'Example Asset';
    GLib.setPrgname(this.title);
};

App.prototype.run = function (ARGV) {
    this.application = new Gtk.Application();
    this.application.on('activate', this.onActivate.bind(this));
    this.application.on('startup', this.onStartup.bind(this));
    this.application.run([]);
};

App.prototype.onActivate = function () {
    this.window.show_all();
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
    this.image = new Gtk.Image ({ file: __dirname + '/assets/egAsset.png' });
    this.window.add(this.image);
};

//Run the application
let app = new App();
app.run();

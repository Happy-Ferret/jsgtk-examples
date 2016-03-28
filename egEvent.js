#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk.EventBox to catch events for widgets which do not 
have their own window

Run it with:
    gjs egJustify.js
*/

const
    GLib    = require('GLib'),
    Gtk     = require('Gtk'),
    Pango   = require('Pango')
;

const App = function () { 
    this.title = 'Example Event';
    GLib.setPrgname(this.title);

    this.text = 'Click here ... ';
    this.counter = 0;
};

App.prototype.run = function (ARGV) {

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

    let event;

    this.label = new Gtk.Label({ halign: Gtk.Align.CENTER, label: this.text, valign: Gtk.Align.CENTER });

    event = new Gtk.EventBox();
    event.add(this.label);
    event.on('button-press-event',  () => { 
        this.counter = this.counter + 1;
        this.label.setText(this.text + this.counter);
    });

    return event;
};

//Run the application
let app = new App();
app.run(ARGV);

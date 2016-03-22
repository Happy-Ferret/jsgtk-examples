#!/usr/bin/env jsgtk

/*
JSGtk example showing how to build Gtk javascript applications
using Gtk.CssProvider from source code or from loaded .css files

Run it with:
    jsgtk egCss.js
*/

const
    GLib = require('GLib'),
    Gtk = require('Gtk')
;

const App = function () { 
    this.title = 'Example Css';
    GLib.setPrgname(this.title);
};

App.prototype.run = function () {
    
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

    let content, css1, label1, css2, label2;

    // CSS from source code
    css1 = new Gtk.CssProvider();
    css1.loadFromData(' * { color: #0a0; font-size: 12px; background-color: rgba(0, 0, 0, 0.5); border-radius: 5px; }');

    label1 = new Gtk.Label({ halign: Gtk.Align.CENTER, label: 'Source code CSS', valign: Gtk.Align.CENTER });
    label1.getStyleContext().addProvider(css1, 0);
    label1.setSizeRequest(150, 35);

    // CSS from .css file class
    css2 = new Gtk.CssProvider();
    css2.loadFromPath(__dirname + '/assets/egCss.css');

    label2 = new Gtk.Label({ halign: Gtk.Align.CENTER, label: 'CSS from file', valign: Gtk.Align.CENTER });
    label2.getStyleContext().addProvider(css2, 0);
    label2.setSizeRequest(150, 35);
    
    content = new Gtk.Grid({ halign: Gtk.Align.CENTER, columnSpacing: 10, margin: 15, rowSpacing: 10 });
    content.attach(label1, 0, 0, 1, 1);
    content.attach(label2, 0, 1, 1, 1);

    return content;
};

//Run the application
let app = new App();
app.run();

// More information: https://thegnomejournal.wordpress.com/2011/03/15/styling-gtk-with-css/

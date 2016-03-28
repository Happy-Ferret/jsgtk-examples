#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
executing a non blocking command line call.

Run it with:
    jsgtk egSpawn.js
*/

const
    GLib  = require('GLib'),
    Gtk   = require('Gtk'),
    spawn = require('child_process').spawn
;

const App = function App() { 
    this.title = 'Example Spawn';
    GLib.setPrgname(this.title);
};


App.prototype.run = function () {

    this.application = new Gtk.Application()
        .on('activate', () => {
            this.window.showAll();
        })
        .once('startup', () => {
            this.buildUI();
            this.spawn();
        });

    this.application.run([]);
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

    this.buffer = new Gtk.TextBuffer();
    this.buffer.insertAtCursor('Result:\n', -1);
    this.view = new Gtk.TextView();
    this.view.setBuffer(this.buffer);

    let scroll = new Gtk.ScrolledWindow({ vexpand: true });
    scroll.add(this.view);
    this.window.add(scroll);
};

App.prototype.spawn = function() {

    spawn('ls', ['-ltr', '.']).stdout.on('data', line => {
        this.buffer.insertAtCursor(line.toString(), -1);
    });

}; 

//Run the application
let app = new App();
app.run();

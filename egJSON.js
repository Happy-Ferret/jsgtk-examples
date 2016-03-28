#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
reading and writting JSON files

Run it with:
    jsgtk egJSON.js
*/

const
    fs    = require('fs'),
    GLib  = require('GLib'),
    Gtk   = require('Gtk')
;

const App = function () { 

    this.title = 'Example JSON';
    GLib.setPrgname(this.title);

    this.info = null;
};

App.prototype.run = function (ARGV) {

    this.application = new Gtk.Application();
    this.application.on('activate', this.onActivate.bind(this));
    this.application.on('startup', this.onStartup.bind(this));
    this.application.on('shutdown', this.writeInfo.bind(this));
    this.application.run([]);
};

App.prototype.onActivate = function () {
    this.window.showAll();
};

App.prototype.onStartup = function() {
    this.buildUI();
};

App.prototype.writeInfo = function () {
    fs.writeFile(__dirname + '/assets/egJSON.json', JSON.stringify(this.info), () => {
        this.label.setText(JSON.stringify(this.info));
    });
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              defaultHeight: 200,
                                              defaultWidth: 400,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.window.setIconFromFile(__dirname + '/assets/appIcon.png');
    } catch (err) {
        this.window.setIconName('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {
    
    let buttonR, buttonW, grid;

    buttonR = new Gtk.Button({ hexpand: true, halign: Gtk.Align.CENTER, label: 'Read JSON' });
    buttonR.on('clicked', this.read.bind(this));

    buttonW = new Gtk.Button({ hexpand: true, halign: Gtk.Align.CENTER, label: 'Write JSON' });
    buttonW.on('clicked', this.write.bind(this));

    this.label = new Gtk.Label({ label: '' });

    grid = new Gtk.Grid({ columnSpacing: 6, margin: 15, rowSpacing: 6 });
    grid.attach(buttonR, 0, 0, 1, 1);
    grid.attach(buttonW, 1, 0, 1, 1);
    grid.attach(this.label, 0, 1, 2, 1);

    return grid;
};

App.prototype.read = function() {
    fs.readFile(__dirname + '/assets/egJSON.json', (err, data) => {
        if (!this.info) this.info = JSON.parse(data.toString());
        ++this.info['counter-read'];
        this.label.setText(JSON.stringify(this.info));
    });

};

App.prototype.write = function() {
    if (this.info) {
        ++this.info['counter-write'];
        this.writeInfo();
    } else {
        this.label.setText('Read the file first');
    }
};

//Run the application
let app = new App();
app.run(ARGV);


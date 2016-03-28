#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Gtk.Label and its justification options

Run it with:
    gjs egJustify.js
*/

const
    Gtk   = require('Gtk'),
    Pango = require('Pango')
;

const App = function () { 
    this.title = 'Example Justify';
    require('GLib').setPrgname(this.title);
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

    let left, center, right, justify, grid;

    left = this.getLabel(Gtk.Justification.LEFT);
    center = this.getLabel(Gtk.Justification.CENTER);
    right = this.getLabel(Gtk.Justification.RIGHT);
    justify  = this.getLabel(Gtk.Justification.FILL);

    grid = new Gtk.Grid({ columnSpacing: 25 });
    grid.setBorderWidth(15);
    grid.attach(left, 0, 0, 1, 1);
    grid.attach(center, 1, 0, 1, 1);
    grid.attach(right, 2, 0, 1, 1);
    grid.attach(justify, 3, 0, 1, 1);

    return grid;
};

App.prototype.getLabel = function(justification) {

    let text, label;

    text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt';

    label = new Gtk.Label({ halign: Gtk.Align.CENTER, label: text, valign: Gtk.Align.START });
    label.setSizeRequest(100, -1);
    label.setEllipsize(Pango.EllipsizeMode.END);
    label.setMaxWidthChars(10);
    label.setLineWrap(true);
    label.setJustify(justification);
    label.setLines(6);

    return label;
};

//Run the application
let app = new App();
app.run(ARGV);

#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
using Gtk TreeView and ListStore

Run it with:
    jsgtk egList.js
*/

const
    GObj  = require('GObject'),
    Gtk = require('Gtk')
;

const App = function () { 

    this.title = 'Example List';
    require('GLib').setPrgname(this.title);
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
                                              defaultHeight: 300,
                                              defaultWidth: 720,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.window.setIconFromFile(__dirname + '/assets/appIcon.png');
    } catch (err) {
        this.window.setIconName('application-x-executable');
    }

    this.window.setTitlebar(this.getHeader());
    this.window.add(this.getBody());
};

App.prototype.getHeader = function () {

    this.headerBar = new Gtk.HeaderBar();
    this.headerBar.setShowCloseButton(true);
    return this.headerBar;
};

App.prototype.getBody = function () {

    let scroll, store, tree, col;

    scroll = new Gtk.ScrolledWindow({ vexpand: true });

    store = new Gtk.ListStore();
    store.setColumnTypes([GObj.TYPE_INT, GObj.TYPE_STRING, GObj.TYPE_STRING, GObj.TYPE_BOOLEAN]);
    store.set(store.append(), [0, 1, 2, 3], [0, '0A', 'Name 0', false]);
    store.set(store.append(), [0, 1, 2, 3], [1, '1B', 'Name 1', false]);
    store.set(store.append(), [0, 1, 2, 3], [2, '2C', 'Name 2', false]);
    store.set(store.append(), [0, 1, 2, 3], [3, '3D', 'Name 3', false]);

    tree = new Gtk.TreeView({ headersVisible: false, vexpand: true, hexpand: true });
    tree.setModel(store);
    scroll.add(tree);

    col = new Gtk.TreeViewColumn();
    tree.appendColumn(col);

    let text1 = new Gtk.CellRendererText();
    col.packStart(text1, true);
    col.setCellDataFunc(text1, this.cellFuncText1.bind(this));

    let text2 = new Gtk.CellRendererText();
    col.packStart(text2, true);
    col.setCellDataFunc(text2, this.cellFuncText2.bind(this));

    return scroll;
};

App.prototype.cellFuncText1 = function (col, cell, model, iter) {
    cell.editable = false;
    cell.text = model.getValue(iter, 1);
};

App.prototype.cellFuncText2 = function (col, cell, model, iter) {
    cell.editable = false;
    cell.text = model.getValue(iter, 2);
};

//Run the application
let app = new App();
app.run(ARGV);

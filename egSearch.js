#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar and a filtered FlowBox

Run it with:
    jsgtk egSearchjs
*/

const
    Gdk = require('Gdk'),
    GLib = require('GLib'),
    Gtk = require('Gtk')
;

const App = function () { 

    this.title = 'Example Search';
    GLib.setPrgname(this.title);

    this.filterText = '';
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
                                              defaultHeight: 325,
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

    let imageSearch = new Gtk.Image ({ iconName: 'edit-find-symbolic', iconSize: Gtk.IconSize.SMALL_TOOLBAR });
    this.buttonSearch = new Gtk.ToggleButton({ image: imageSearch });
    this.buttonSearch.on('clicked', () => { 
        if (this.buttonSearch.getActive()) {
            this.searchBar.setSearchMode(true);
        } else {
            this.searchBar.setSearchMode(false);
        }
    });

    this.headerBar.packEnd(this.buttonSearch);

    return this.headerBar;
};

App.prototype.getBody = function () {

    this.content = new Gtk.Grid();
    this.content.attach(this.getSearch(), 0, 0, 1, 1);
    this.content.attach(this.getFlow(), 0, 1, 1, 1);

    return this.content;
};

App.prototype.getSearch = function () {

    this.searchBar = new Gtk.SearchBar();
    this.searchBar.show();

    let searchEntry = new Gtk.SearchEntry();
    searchEntry.show();
    searchEntry.on('search-changed', () => {
        this.filterText = searchEntry.getText();
        this.flow.invalidateFilter();
    });

    this.window.on('key-press-event', (widget, event) => {
        // TODO: events don't have camelCase methods
        print(event);
        let key = event.get_keyval()[1];
        if (key !== Gdk.KEY_Escape
            && key !== Gdk.KEY_Up
            && key !== Gdk.KEY_Down
            && key !== Gdk.KEY_Left
            && key !== Gdk.KEY_Right) {
            if (!this.buttonSearch.getActive()) {
                this.buttonSearch.setActive(true);
            }
        } else {
            this.buttonSearch.setActive(false);
        }
    });

    this.searchBar.connectEntry(searchEntry);
    this.searchBar.add(searchEntry);

    return this.searchBar;
};

App.prototype.getFlow = function () {

    let scroll = new Gtk.ScrolledWindow({ vexpand: true });
    this.flow = new Gtk.FlowBox({ vexpand: true });
    this.flow.setFilterFunc(this.filter.bind(this));

    this.flow.insert(this.newFlowLabel('1a lorem'), -1);
    this.flow.insert(this.newFlowLabel('2b ipsum'), -1);
    this.flow.insert(this.newFlowLabel('3c dolor'), -1);
    this.flow.insert(this.newFlowLabel('4d sit set'), -1);
    this.flow.insert(this.newFlowLabel('5e amet'), -1);
    this.flow.insert(this.newFlowLabel('6f consectetur'), -1);
    this.flow.insert(this.newFlowLabel('7g adipiscing'), -1);
    this.flow.insert(this.newFlowLabel('8h elit'), -1);
    this.flow.insert(this.newFlowLabel('9i set'), -1);

    scroll.add(this.flow);
    return scroll;
};

App.prototype.newFlowLabel = function (text) {
    let label = new Gtk.Label({ label: text });
    label.setSizeRequest(125, 125);
    return label;
};

App.prototype.filter = function (item) {
    let label = item.getChild().getLabel();
    if (this.filterText !== '') {
        if (label.indexOf(this.filterText) !== -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
};

App.prototype.printText = function (text) {
    print(text);
};

//Run the application
let app = new App();
app.run(ARGV);

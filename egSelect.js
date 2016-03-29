#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
using Gtk HeaderBar, SearchBar, ActionBar, a filtered FlowBox,
an application library and custom widgets to create a selection
mode

Run it with:
    jsgtk egSearchjs
*/

const
    Gdk = require('Gdk'),
    Gtk = require('Gtk'),
    Select = require('./assets/select')
;

const App = function () { 
    this.title = 'Example Select';
    require('GLib').setPrgname(this.title);
    this.selectionMode = false;
};

App.prototype.run = function () {
    this.application = new Gtk.Application();
    this.application.on('activate', this.onActivate.bind(this));
    this.application.on('startup', this.onStartup.bind(this));
    this.application.run([]);
};

App.prototype.onActivate = function () {
    this.window.showAll();
    this.buttonCancel.hide();
    this.actionBar.hide();
    this.flow.setSelectingMode(false);
};

App.prototype.onStartup = function() {
    this.buildUI();
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              defaultHeight: 400,
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

    let headerEnd, imageSearch, imageSelect;

    this.headerBar = new Gtk.HeaderBar();
    this.headerBar.setShowCloseButton(true);

    headerEnd = new Gtk.Grid({ columnSpacing: this.headerBar.spacing });

    imageSearch = new Gtk.Image ({ iconName: 'edit-find-symbolic', iconSize: Gtk.IconSize.SMALL_TOOLBAR });
    this.buttonSearch = new Gtk.ToggleButton({ image: imageSearch });
    this.buttonSearch.on('clicked', () => { 
        if (this.buttonSearch.getActive()) {
            this.searchBar.setSearchMode(true);
        } else {
            this.searchBar.setSearchMode(false);
        }
    });

    imageSelect = new Gtk.Image ({ iconName: 'emblem-ok-symbolic', iconSize: Gtk.IconSize.SMALL_TOOLBAR });
    this.buttonSelect = new Gtk.Button({ image: imageSelect });
    this.buttonSelect.on('clicked', () => { this.selectionShow(true); });

    this.buttonCancel = new Gtk.Button({ label: "Cancel" });
    this.buttonCancel.on('clicked', () => { this.selectionShow(false); });

    headerEnd.attach(this.buttonSearch, 0, 0, 1, 1);
    headerEnd.attach(this.buttonSelect, 1, 0, 1, 1);
    headerEnd.attach(this.buttonCancel, 2, 0, 1, 1);
    this.headerBar.packEnd(headerEnd);

    return this.headerBar;
};

App.prototype.getBody = function () {

    this.content = new Gtk.Grid();
    this.content.attach(this.getSearch(), 0, 0, 1, 1);
    this.content.attach(this.getFlow(), 0, 1, 1, 1);
    this.content.attach(this.getActionBar(), 0, 2, 1, 1);

    return this.content;
};

App.prototype.getSearch = function () {
    
    let searchEntry;

    this.searchBar = new Gtk.SearchBar();
    this.searchBar.show();
    searchEntry = new Gtk.SearchEntry();
    searchEntry.show();

    searchEntry.on('search-changed', () => {
        this.flow.filterText = searchEntry.getText();
        this.flow.widget.invalidateFilter();
    });

    this.window.on('key-press-event', (widget, event) => {
        let key = event.getKeyval()[1];
        if (key !== Gdk.KEY_Escape
            && key !== Gdk.KEY_Up
            && key !== Gdk.KEY_Down
            && key !== Gdk.KEY_Left
            && key !== Gdk.KEY_Right) {
            if (!this.buttonSearch.getActive()) {
                this.buttonSearch.setActive(true);
            }
        } else {
            if (this.buttonSearch.getActive()) {
                this.buttonSearch.setActive(false);
            } else if (this.selectionMode) {
                this.selectionShow(false);
            }
        }
    });

    this.searchBar.connectEntry(searchEntry);
    this.searchBar.add(searchEntry);

    return this.searchBar;
};

App.prototype.getFlow = function () {

    let scroll, id;

    scroll = new Gtk.ScrolledWindow({ vexpand: true });

    this.flow = new Select.SelectFlow();
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 1 lorem'); 
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 2 ipsum');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 3 dolor');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 4 sit');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 5 amet');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 6 consectetur set amet');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 7 adipiscing');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 8 elit');
    id = this.flow.insert(__dirname + '/assets/egSelect.png', 'Label 9 set');
    this.flow.on('selection-changed', () => {
        if (this.flow.selected.length > 0) {
            this.buttonDelete.setSensitive(true);
        } else {
            this.buttonDelete.setSensitive(false);
        }
    });
    this.flow.on('action', id => {
        this.printText('Do something for: ' + id);
    });

    scroll.add(this.flow.widget);

    return scroll;
};

App.prototype.getActionBar = function () {

    this.actionBar = new Gtk.ActionBar();

    this.buttonDelete = new Gtk.Button({ label: "Delete", sensitive: false });
    this.buttonDelete.on('clicked', () => {
        this.printText('Will delete: ' + JSON.stringify(this.flow.selected));
        this.flow.deleteSelected();
    });
    this.actionBar.packEnd(this.buttonDelete);

    return this.actionBar;
};

App.prototype.selectionShow = function (show) {

    this.selectionMode = show;

    if (show) {
        this.buttonSelect.hide();
        this.buttonCancel.show();
        
        this.headerBar.getStyleContext().addClass('selection-mode');
        this.actionBar.show();
    } else {
        this.buttonSelect.show();
        this.buttonCancel.hide();
        this.headerBar.getStyleContext().removeClass('selection-mode');
        this.actionBar.hide();
    }

    this.headerBar.setShowCloseButton(!show);
    this.flow.setSelectingMode(show);

};

App.prototype.printText = function (text) {
    print(text);
};

//Run the application
let app = new App();
app.run();

#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
using Gtk HeaderBar, and Popover buttons with Gtk Widget or Gio GMenu.

GMenu includes examples of sections, submenus, checkboxes and selections

Run it with:
    jsgtk egHeader.js
*/

const
    Gio     = require('Gio'),
    GLib    = require('GLib'),
    Gtk     = require('Gtk')
;

const PopWidget = function (properties) {

    let label = new Gtk.Label({ label: properties.label });
    let image = new Gtk.Image ({ iconName: 'pan-down-symbolic', iconSize: Gtk.IconSize.SMALL_TOOLBAR });
    let widget = new Gtk.Grid();
    widget.attach(label, 0, 0, 1, 1);
    widget.attach(image, 1, 0, 1, 1);

    this.pop = new Gtk.Popover();
    this.button = new Gtk.ToggleButton();
    this.button.add(widget);
    this.button.on('clicked', () => { 
        if (this.button.getActive())
            this.pop.showAll();
    });
    this.pop.on('closed', () => { 
        if (this.button.getActive())
            this.button.setActive(false);
    });
    this.pop.setRelativeTo(this.button);
    this.pop.setSizeRequest(-1, -1);
    this.pop.setBorderWidth(8);
    this.pop.add(properties.widget);
};

const App = function () { 
    this.title = 'Example Header';
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

    this.label = new Gtk.Label({ label: "..." });
    this.window.add(this.label);
};

App.prototype.getHeader = function () {

    let headerBar, headerStart, imageNew, buttonNew, popMenu, imageMenu, buttonMenu;

    headerBar = new Gtk.HeaderBar();
    headerBar.setTitle(this.title);
    headerBar.setSubtitle("Some subtitle text here");
    headerBar.setShowCloseButton(true);

    headerStart = new Gtk.Grid({ columnSpacing: headerBar.spacing });

    this.widgetOpen = new PopWidget({ label: "Open", widget: this.getPopOpen() });

    imageNew = new Gtk.Image ({ iconName: 'tab-new-symbolic', iconSize: Gtk.IconSize.SMALL_TOOLBAR });
    buttonNew = new Gtk.Button({ image: imageNew });
    buttonNew.on('clicked', () => {
        this.printText('Button new');
    });

    headerStart.attach(this.widgetOpen.button, 0, 0, 1, 1);
    headerStart.attach(buttonNew, 1, 0, 1, 1);
    headerBar.packStart(headerStart);

    popMenu = new Gtk.Popover();
    imageMenu = new Gtk.Image ({ iconName: 'open-menu-symbolic', iconSize: Gtk.IconSize.SMALL_TOOLBAR });
    buttonMenu = new Gtk.MenuButton({ image: imageMenu });
    buttonMenu.setPopover(popMenu);
    popMenu.setSizeRequest(-1, -1);
    buttonMenu.setMenuModel(this.getMenu());

    headerBar.packEnd(buttonMenu);

    return headerBar;
};

App.prototype.getPopOpen = function () { /* Widget popover */

    let widget = new Gtk.Grid(),
        label = new Gtk.Label({ label: "Label 1" }),
        button = new Gtk.Button({ label: "Other Documents ..." });

    button.on('clicked', () => { 
        this.widgetOpen.pop.hide();
        this.printText('Open other documents');
    });
    button.setSizeRequest(200, -1);

    widget.attach(label, 0, 0, 1, 1);
    widget.attach(button, 0, 1, 1, 1);
    widget.setHalign(Gtk.Align.CENTER);

    return widget;
};

App.prototype.getMenu = function () { /* GMenu popover */

    let menu, section, submenu;

    menu = new Gio.Menu();

    section = new Gio.Menu();
    section.append("Save As...", 'app.saveAs');
    section.append("Save All", 'app.saveAll');
    menu.appendSection(null, section);

    section = new Gio.Menu();
    submenu = new Gio.Menu();
    section.appendSubmenu('View', submenu);
    submenu.append("View something", 'app.toggle');
    submenu = new Gio.Menu();
    section.appendSubmenu('Select', submenu);
    submenu.append("Selection 1", 'app.select::one');
    submenu.append("Selection 2", 'app.select::two');
    submenu.append("Selection 3", 'app.select::thr');
    menu.appendSection(null, section);

    section = new Gio.Menu();
    section.append("Close All", 'app.close1');
    section.append("Close", 'app.close2');
    menu.appendSection(null, section);

    // Set menu actions
    let actionSaveAs = new Gio.SimpleAction ({ name: 'saveAs' });
    actionSaveAs.on('activate', () => {
        this.printText('Action save as');
    });
    this.application.addAction(actionSaveAs);

    let actionSaveAll = new Gio.SimpleAction ({ name: 'saveAll' });
    actionSaveAll.on('activate', () => {
        this.printText('Action save all');
    });
    this.application.addAction(actionSaveAll);

    let actionClose1 = new Gio.SimpleAction ({ name: 'close1' });
    actionClose1.on('activate', () => {
        this.printText('Action close all');
    });
    this.application.addAction(actionClose1);

    let actionClose2 = new Gio.SimpleAction ({ name: 'close2' });
    actionClose2.on('activate', () => {
        this.printText('Action close');
    });
    this.application.addAction(actionClose2);

    let actionToggle = new Gio.SimpleAction ({ name: 'toggle', state: new GLib.Variant('b', true) });
    actionToggle.on('activate', (action) => {
        let state = action.getState().getBoolean();
        if (state) {
            action.setState(new GLib.Variant('b', false));
        } else {
            action.setState(new GLib.Variant('b', true));
        }
        this.printText('View ' + !state);
    });
    this.application.addAction(actionToggle);

    let variant = new GLib.Variant('s', 'one');
    let actionSelect = new Gio.SimpleAction ({ name: 'select', state: variant, parameterType: variant.getType() });
    actionSelect.on('activate', (action, parameter) => {
        let str = parameter.getString()[0];
        if (str === 'one') {
            action.setState(new GLib.Variant('s', 'one'));
        }
        if (str === 'two') {
            action.setState(new GLib.Variant('s', 'two'));
        }
        if (str === 'thr') {
            action.setState(new GLib.Variant('s', 'thr'));
        }
        this.printText('Selection ' + str);
    });
    this.application.addAction(actionSelect);

    return menu;
};

App.prototype.printText = function (text) {

    print(text);
};

//Run the application
let app = new App();
app.run();

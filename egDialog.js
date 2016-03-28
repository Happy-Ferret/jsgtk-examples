#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
adding an option to the application's Gio.Menu and opening 
dialog and modal windows using Gtk.Dialog

Run it with:
    jsgtk egDialog.js
*/

const
    Gio     = require('Gio'),
    GLib    = require('GLib'),
    Gtk     = require('Gtk')
;

const App = function () { 
    this.title = 'Example Dialog';
    GLib.setPrgname(this.title);
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
    this.initMenu();
    this.buildUI();
};

App.prototype.initMenu = function() {

    let menu, section, dialogAction, modalAction, quitAction;

    menu = new Gio.Menu();

    section = new Gio.Menu();
    section.append("Dialog", 'app.dialog');
    menu.appendSection(null, section);

    section = new Gio.Menu();
    section.append("Modal", 'app.modal');
    menu.appendSection(null, section);

    section = new Gio.Menu();
    section.append("Quit",'app.quit');
    menu.appendSection(null, section);

    dialogAction = new Gio.SimpleAction ({ name: 'dialog' });
    dialogAction.connect('activate', this.showDialog.bind(this));
    this.application.addAction(dialogAction);

    modalAction = new Gio.SimpleAction ({ name: 'modal' });
    modalAction.connect('activate', this.showModal.bind(this));
    this.application.addAction(modalAction);

    quitAction = new Gio.SimpleAction ({ name: 'quit' });
    quitAction.connect('activate', () => {
        this.window.destroy();
    });
    this.application.addAction(quitAction);

    this.application.setAppMenu(menu);
};

App.prototype.buildUI = function() {

    let result = false;

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              defaultHeight: 300,
                                              defaultWidth: 500,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.window.setIconFromFile(__dirname + '/assets/appIcon.png');
    } catch (err) {
        this.window.setIconName('application-x-executable');
    }

    this.window.add(this.getBody());
};

App.prototype.getBody = function() {

    let label;

    label = new Gtk.Label({ label: "Open the '" + this.title + "' application menu and click on 'Dialog' or 'Modal'" });
    label.setLineWrap(true);
    label.setLines(5);

    return label;
};

App.prototype.showDialog = function() {

    let label, dialog, contentArea;

    label = new Gtk.Label({
        label: "Hello 'Dialog'!",
        vexpand: true
    });

    dialog = new Gtk.Dialog({ 
        defaultHeight: 200,
        defaultWidth: 200,
        modal: false,
        transientFor: this.window,
        title: 'Dialog',
        useHeaderBar: true
    });

    dialog.connect('response', function() {
        dialog.destroy();
    });

    contentArea = dialog.getContentArea();
    contentArea.add(label);

    dialog.showAll();
};

App.prototype.showModal = function() {

    let label, modal, contentArea, button, actionArea;

    label = new Gtk.Label({
        label: "Hello 'Modal'!",
        vexpand: true
    });

    modal = new Gtk.Dialog({ 
        defaultHeight: 200,
        defaultWidth: 200,
        modal: true,
        transientFor: this.window,
        title: 'Modal',
        useHeaderBar: false
    });

    modal.connect('response', function() {
        modal.destroy();
    });

    contentArea = modal.getContentArea();
    contentArea.add(label);

    button = Gtk.Button.newWithLabel ('OK');
    button.connect ("clicked", () => {
        print('OK pressed');
        modal.destroy();
    });

    actionArea = modal.getActionArea();
    actionArea.add(button);

    modal.showAll();
};

//Run the application
let app = new App();
app.run(ARGV);

#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
with FileChooserDialog with FileFilter, setExtraWidget (ComboBox)

Run it with:
    jsgtk egOpen.js
*/

const
    GObj    = require('GObject'),
    Gtk     = require('Gtk'),
    fs      = require('fs')
;

function App() {
    this.title = 'Example Open';
    require('GLib').setPrgname(this.title);
}

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
                                              title: this.title,
                                              defaultHeight: 400,
                                              defaultWidth: 500,
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

    let headerBar, button;

    headerBar = new Gtk.HeaderBar();
    headerBar.setShowCloseButton(true);

    button = new Gtk.Button({ label: 'Open' });
    button.on('clicked', this.openDialog.bind(this));

    headerBar.packStart(button);
    return headerBar;
};

App.prototype.getBody = function () {

    let content, scroll, view, label;

    content = new Gtk.Grid();
    scroll = new Gtk.ScrolledWindow({ hexpand: true, vexpand: true });
    this.buffer = new Gtk.TextBuffer();
    view = new Gtk.TextView();
    view.setBuffer(this.buffer);

    scroll.add(view);

    this.label = new Gtk.Label({ halign: Gtk.Align.START, label: 'Open a file...' });

    content.attach(scroll, 0, 0, 1, 1);
    content.attach(this.label, 0, 1, 1, 1);

    return content;
};

App.prototype.openDialog = function() {

    let filter, chooser, store, combo, renderer, result, name, file, exit = false;

    filter = new Gtk.FileFilter();
    filter.addMimeType('text/plain');

    chooser = new Gtk.FileChooserDialog({ 
        action: Gtk.FileChooserAction.OPEN,
        filter: filter,
        selectMultiple: false,
        transientFor: this.window,
        title: 'Open'
    });

    // Without setting a current folder, folders won't show its contents
    //
    // Example set home folder by default: 
    // chooser.setCurrentFolder(GLib.getHomeDir());
    chooser.setCurrentFolder(__dirname);

    // Add the buttons and its return values
    chooser.addButton('Cancel', Gtk.ResponseType.CANCEL);
    chooser.addButton('OK', Gtk.ResponseType.OK);

    // This is to add the 'combo' filtering options
    store = new Gtk.ListStore();
    store.setColumnTypes([GObj.TYPE_STRING, GObj.TYPE_STRING]);
    store.set(store.append(), [0, 1], ['text', 'text/plain']);
    store.set(store.append(), [0, 1], ['js', '*.js']);
    store.set(store.append(), [0, 1], ['md', '*.md']);

    combo = new Gtk.ComboBox({ model: store });
    renderer = new Gtk.CellRendererText();
    combo.packStart(renderer, false);
    combo.addAttribute(renderer, "text", 1);
    combo.setActive(0);
    combo.on('changed', widget => {

        let model, active, type, text, filter; 

        model = widget.getModel();
        active = widget.getActiveIter()[1];

        type = model.getValue(active, 0);
        text = model.getValue(active, 1);

        filter = new Gtk.FileFilter();
        if (type === 'text') {
            filter.addMimeType(text);
        } else {
            filter.addPattern(text);
        }

        chooser.setFilter(filter);
    });
    chooser.setExtraWidget(combo);

    // Run the dialog
    result = chooser.run();
    name = chooser.getFilename();

    if (result === Gtk.ResponseType.OK) {
        this.openFile(name);
    }
    chooser.destroy();
};

App.prototype.openFile = function(name) {

    fs.readFile(name, (err, data) => {
        this.buffer.delete(
            this.buffer.getIterAtOffset(0),
            this.buffer.getIterAtOffset(
                this.buffer.getCharCount()
            )
        );
        this.buffer.insertAtCursor(data.toString(), -1);
    });

    fs.stat(name, (err, info) => {
        let text = 'File info type: ' + info.nlink + ', size: ' + info.size;
        this.label.setText(text);
    });

};

//Run the application
let app = new App();
app.run();


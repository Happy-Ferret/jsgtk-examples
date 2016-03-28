#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
using Webkit.WebView, also showing how to send messages from GTK
to Webkit and vice versa

Run it with:
    gjs egWebmsg.js
*/

const
    GLib  = require('GLib'),
    Gtk = require('Gtk'),
    Webkit = require('WebKit2')
;

const App = function () { 

    this.title = 'Example Webmsg';
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

    let defaultUri = __dirname + '/assets/egWebmsg.html';
    let grid = new Gtk.Grid({ columnHomogeneous: true });

    let webView = new Webkit.WebView({ vexpand: true });
    webView.loadUri(GLib.filenameToUri(defaultUri, null));
    webView.connect('load-changed', (webView, evt) => {
        switch (evt) {
            case Webkit.LoadEvent.STARTED:
                let uri = webView.getUri();
                if (uri.indexOf('jsgtk:') === 0) {
                    label.label = decodeURIComponent(uri.slice(6));
                    // TODO: prevent loading this uri
                    // webView.loadUri(defaultUri);
                }
                break;
        }
    });
    grid.attach(webView, 0, 0, 2, 1);

    let button = new Gtk.Button({ label: 'GTK to Webkit message' }).on('clicked', () => {
        // Execute one Webkit function to send a message from GTK to Webkit
        webView.runJavascript('messageFromGTK("Message from GTK!");', null, (webView, result) => {
            webView.runJavascriptFinish(result);
        });
    });
    grid.attach(button, 0, 1, 1, 1);

    let label = new Gtk.Label({ label: '' });
    grid.attach(label, 1, 1, 1, 1);

    return grid;
}; 

//Run the application
let app = new App();
app.run();

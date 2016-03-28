#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
getting information from GLib and command line

Run it with:
    jsgtk egInfo.js
*/

const
    GLib  = require('GLib'),
    Gtk   = require('Gtk'),
    spawn = require('child_process').spawn
;

const App = function () { 

    this.title = 'Example Info';
    GLib.setPrgname(this.title);

    this.info = {
        desktop: '',
        host: '',
        user: '',
        lang: '',
        home: '',
        installed: '',
        program: '',
        script: '',
        folder: '',
        current: '',
        icon: '',
        dstr: '',
        kernel: ''
    };
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
    this.getInfo();
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              defaultHeight: 400,
                                              defaultWidth: 400,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.info.icon = '/assets/appIcon.png';
        this.window.setIconFromFile(__dirname + this.info.icon);
    } catch (err) {
        this.info.icon = 'application-x-executable';
        this.window.setIconName(this.info.icon);
    }

    this.label = new Gtk.Label({ label: '', margin: 15 });
    this.window.add(this.label);
};

App.prototype.getInfo = function() {

    this.info.desktop = GLib.getenv('XDG_CURRENT_DESKTOP');
    this.info.host = GLib.getHostName();
    this.info.user = GLib.getUserName();
    this.info.lang = GLib.getenv('LANG');
    this.info.home = GLib.getHomeDir();
    this.info.installed = (__dirname.indexOf('bin/') !== -1);
    this.info.program = GLib.getPrgname();
    this.info.script = __filename;
    this.info.folder = __dirname;
    this.info.current = process.cwd();

    spawn('uname', ['-r']).stdout.on('data', (line) => {
        this.info.kernel = line.toString().trim();
        this.setLabel();
    });

    spawn('lsb_release', ['-d']).stdout.on('data', (line) => {
        this.info.dstr = line.toString().trim();
        this.setLabel();
    });
};


App.prototype.setLabel = function() {
    
    let text;

    text = '';
    if (this.info.desktop !== '')   text = text + '\nDesktop: ' + this.info.desktop;
    if (this.info.host !== '')      text = text + '\nHost: ' + this.info.host;
    if (this.info.user !== '')      text = text + '\nUser: ' + this.info.user;
    if (this.info.lang !== '')      text = text + '\nLanguage: ' + this.info.lang;
    if (this.info.home !== '')      text = text + '\nHome: ' + this.info.home;
    text = text + '\n';
    if (this.info.installed !== '') text = text + '\nInstalled: ' + this.info.installed;
    if (this.info.program !== '')   text = text + '\nProgram: ' + this.info.program;
    if (this.info.script !== '')    text = text + '\nScript: ' + this.info.script;
    if (this.info.folder !== '')    text = text + '\nFolder: ' + this.info.folder;
    if (this.info.current !== '')   text = text + '\nCurrent: ' + this.info.current;
    if (this.info.icon !== '')      text = text + '\nIcon: ' + this.info.icon;
    text = text + '\n';
    if (this.info.dstr !== '')      text = text + '\nDistro: ' + this.info.dstr;
    if (this.info.kernel !== '')    text = text + '\nKernel: ' + this.info.kernel;

    this.label.setText(text);
};

//Run the application
let app = new App();
app.run();

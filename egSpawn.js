#!/usr/bin/gjs

/*
GJS example showing how to build Gtk javascript applications
executing a non blocking command line call, it uses
TextBuffer, TextView, GLib.spawn_async_with_pipes,
Gio.UnixInputStream, Gio.DataInputStream and read_line_async

Run it with:
    gjs egSpawn.js
*/

const Gio   = imports.gi.Gio;
const GLib  = imports.gi.GLib;
const Gtk   = imports.gi.Gtk;
const Lang  = imports.lang;

// Get application folder and add it into the imports path
function getAppFileInfo() {
    let stack = (new Error()).stack,
        stackLine = stack.split('\n')[1],
        coincidence, path, file;

    if (!stackLine) throw new Error('Could not find current file (1)');

    coincidence = new RegExp('@(.+):\\d+').exec(stackLine);
    if (!coincidence) throw new Error('Could not find current file (2)');

    path = coincidence[1];
    file = Gio.File.new_for_path(path);
    return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}
const path = getAppFileInfo()[1];
imports.searchPath.push(path);

const App = function () { };

App.prototype.run = function (ARGV) {

    this.application = new Gtk.Application();
    this.application.connect('activate', Lang.bind(this, this.onActivate));
    this.application.connect('startup', Lang.bind(this, this.onStartup));
    this.application.run([]);
};

App.prototype.onActivate = function () {

    this.window.show_all();
};

App.prototype.onStartup = function() {

    this.buildUI();
    this.spawn();
};

App.prototype.buildUI = function() {

    let scroll;

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: "Example Spawn",
                                              default_height: 200,
                                              default_width: 200,
                                              window_position: Gtk.WindowPosition.CENTER });
    try {
        this.window.set_icon_from_file(path + '/assets/app-icon.png');
    } catch (err) {
        this.window.set_icon_name('application-x-executable');
    }

    scroll = new Gtk.ScrolledWindow({ vexpand: true });
    this.buffer = new Gtk.TextBuffer();
    this.buffer.insert_at_cursor('Result:\n', -1);
    this.view = new Gtk.TextView();
    this.view.set_buffer(this.buffer);

    scroll.add(this.view);
    this.window.add(scroll);
};

App.prototype.spawn = function() {
   
    let pid, stdin, stdout, stderr, stream;

    [res, pid, stdin, stdout, stderr] = GLib.spawn_async_with_pipes(
        './', ['ls', '-ltr', '.'], null, GLib.SpawnFlags.SEARCH_PATH, null);
        //'./', ['tail', '-f', 'a.txt'], null, GLib.SpawnFlags.SEARCH_PATH, null);

    stream = new Gio.DataInputStream({ base_stream : new Gio.UnixInputStream({ fd : stdout }) });
    this.read(stream);
}; 

App.prototype.read = function (stream) {

    stream.read_line_async(GLib.PRIORITY_LOW, null, Lang.bind (this, function (source, res) {

        let out, length;

        [out, length] = source.read_line_finish(res);
        if (out !== null) {
            this.buffer.insert_at_cursor(String(out) + '\n', -1);
            this.read(source);
        }
    }));
};

//Run the application
let app = new App();
app.run(ARGV);

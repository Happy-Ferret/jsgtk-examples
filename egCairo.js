#!/usr/bin/env jsgtk

/*
JSGtk example showing how to build Gtk javascript applications
using Gtk and Cairo, the left example adds one Cairo actor to
Clutter, the example on the right adds one Cairo widget to GTK
using GtkClutter.Embed, Gtk.DrawingArea, Cairo.Context,
Clutter.Canvas

Run it with:
    jsgtk egCairo.js
*/

const
    Clutter       = require('Clutter'),
    GtkClutter    = require('GtkClutter'),
    GLib          = require('GLib'),
    Gtk           = require('Gtk')
;

const App = function () { 
    this.title = 'Example Cairo';
    GLib.setPrgname(this.title);
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
    this.initClutter();
    this.buildUI();
};

App.prototype.initClutter = function() {

    GtkClutter.init(null, 0);
    Clutter.init(null, 0);
};

App.prototype.buildUI = function() {

    this.window = new Gtk.ApplicationWindow({ application: this.application,
                                              title: this.title,
                                              defaultHeight: 300,
                                              defaultWidth: 500,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.window.setIconFromFile(path + '/assets/appIcon.png');
    } catch (err) {
        this.window.setIconName('application-x-executable');
    }

    this.window.add(this.buildBody());
};

App.prototype.buildBody = function() {

    let grid, embed, area, actor, widget, stage;

    embed = new GtkClutter.Embed();
    embed.setSizeRequest(250, 300);

    area = new Gtk.DrawingArea();
    area.setSizeRequest(250, 300);
    area.on('draw', this.drawRed.bind(this));
    
    grid = new Gtk.Grid({ columnSpacing: 6, margin: 15, rowSpacing: 6 });
    grid.attach(embed, 0, 0, 1, 1);
    grid.attach(area, 1, 0, 1, 1);

    stage = embed.getStage();
    stage.setColor(new Clutter.Color({ red: 255, green: 255, blue: 255, alpha: 255 }));
    stage.addChild(this.getClutterActor());

    return grid;
};

App.prototype.getClutterActor = function() {

    let canvas, actor;

    canvas = new Clutter.Canvas({
        height: 100,
        width: 100
    });
    canvas.setSize(100,100);
    canvas.on('draw', this.drawGreen.bind(this));
    canvas.invalidate();

    actor = new Clutter.Actor({
        x: 75, y: 100,
        height: 100, width: 100
    });
    actor.setContent(canvas);

    return actor;
};

App.prototype.drawRed = function(area, ctx) {

    // area is Gtk.DrawingArea
    // ctx is Cairo.Context

    let height, width;

    height = area.getAllocatedHeight();
    width = area.getAllocatedWidth();

    this.draw(ctx, height, width, 'red');
};

App.prototype.drawGreen = function(canvas, ctx) {

    // canvas is Clutter.Canvas
    // ctx is Cairo.Context

    let height, width;

    height = canvas.height;
    width = canvas.width;

    this.draw(ctx, height, width, 'green');
};

App.prototype.draw = function(ctx, height, width, color) {

    let xc, yc;

    xc = width / 2;
    yc = height / 2;

    ctx.save();
    if (color === 'red') {
        // Set black background for 'red'
        ctx.setSourceRGBA(0, 0, 0, 1);
    } else {
        // Set grey background
        ctx.setSourceRGBA(0.75, 0.75, 0.75, 1);
    }
    ctx.paint();
    ctx.restore();

    if (color === 'red') {
        ctx.setSourceRGBA(1, 0, 0, 1);
    } else {
        ctx.setSourceRGBA(0, 0.5, 0, 1);
    }

    ctx.moveTo(0, 0);
    ctx.lineTo(xc, yc);
    ctx.lineTo(0, height);
    ctx.moveTo(xc, yc);
    ctx.lineTo(width, yc);
    ctx.stroke();

    return false;
};

//Run the application
let app = new App();
app.run();


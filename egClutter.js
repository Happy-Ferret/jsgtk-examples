#!/usr/bin/env jsgtk

/*
JSGtk+ example showing how to build Gtk javascript applications
using Gtk and Clutter, showing how to drag actors with
Clutter.DragAction, perform animations with PropertyTransition,
TransitionGroup and control the actor from Gtk.Scale

Run it with:
    jsgtk egClutter.js
*/

const
    Clutter         = require('Clutter'),
    GtkClutter      = require('GtkClutter'),
    GLib            = require('GLib'),
    Gtk             = require('Gtk')
;

const App = function () { 
    this.title = 'Example Clutter';
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
                                              defaultHeight: 500,
                                              defaultWidth: 700,
                                              windowPosition: Gtk.WindowPosition.CENTER });
    try {
        this.window.setIconFromFile(__dirname + '/assets/appIcon.png');
    } catch (err) {
        this.window.setIconName('application-x-executable');
    }

    this.window.add(this.buildBody());
};

App.prototype.buildBody = function() {

    let embed, grid, titleRotate, scale, buttonStart, buttonStop;

    embed = new GtkClutter.Embed();
    embed.setSizeRequest(400, 240);

    this.position = new Gtk.Label({ label: 'Drag the square' });
    this.position.setSizeRequest(300, -1);

    titleRotate = new Gtk.Label({ label: 'Rotation: ' });
    titleRotate.setSizeRequest(150, -1);

    scale = new Gtk.Scale({
        digits: 1,
        drawValue: true,
        valuePos: Gtk.PositionType.LEFT
    });
    scale.setRange(-35, 35);
    scale.setSizeRequest(150, -1);
    scale.on('change-value', widget => {
        this.actor.setRotation(Clutter.RotateAxis.Y_AXIS, widget.getValue(), 50, 0, 0);
    });

    buttonStart = new Gtk.Button({ label: 'Play' });
    buttonStart.on('clicked', () => {

        let tg, pt;

        pt = new Clutter.PropertyTransition({ propertyName: 'rotation-angle-z' });
        pt.setFrom(0);
        pt.setTo(360);
        pt.setDuration(2000);
        pt.setProgressMode(Clutter.AnimationMode.LINEAR);

        tg = new Clutter.TransitionGroup();
        tg.setDuration(2000);
        tg.setRepeatCount(-1); // Infinite
        tg.addTransition(pt);
        // Add more property transitions ...
        
        this.actor.addTransition('rotateTransition', tg);

        scale.setSensitive(false);
        buttonStart.setSensitive(false);
        buttonStop.setSensitive(true);
    });

    buttonStop = new Gtk.Button({ label: 'Stop', sensitive: false });
    buttonStop.on('clicked', () => {

        this.actor.removeTransition('rotateTransition');
        this.actor.setRotationAngle(Clutter.RotateAxis.Z_AXIS, 0);

        scale.setSensitive(true);
        buttonStart.setSensitive(true);
        buttonStop.setSensitive(false);
    });

    grid = new Gtk.Grid({ columnSpacing: 6, margin: 15, rowSpacing: 6 });
    grid.attach(embed, 0, 0, 1, 3);
    grid.attach(this.position, 1, 0, 2, 1);
    grid.attach(titleRotate, 1, 1, 1, 1);
    grid.attach(scale, 2, 1, 1, 1);
    grid.attach(buttonStart, 1, 2, 1, 1);
    grid.attach(buttonStop, 2, 2, 1, 1);
    
    this.stage = embed.getStage();
    this.stage.setColor(new Clutter.Color({ red: 255, green: 255, blue: 255, alpha: 255 }));
    this.stage.addChild(this.getActor());

    return grid;
};

App.prototype.getActor = function() {

    let colorDark, colorLight, action;

    colorDark = new Clutter.Color({ red: 100, green: 125, blue: 100, alpha: 255 });
    colorLight = new Clutter.Color({ red: 150, green: 175, blue: 150, alpha: 255 });

    action = new Clutter.DragAction({
        dragAxis: Clutter.DragAxis.AXIS_NONE,
        xDragThreshold: 0,
        yDragThreshold: 0
    });
    action.on('drag-begin', (action, actor, x, y, modifiers) => {
        this.position.setText('X: ' + x.toFixed(2) + ', Y: ' + y.toFixed(2) + ' - S');
    });
    action.on('drag-end', (action, actor, x, y, modifiers) => {
        this.position.setText('X: ' + x.toFixed(2) + ', Y: ' + y.toFixed(2) + ' - E');
    });
    action.on('drag-motion', (action, actor, x, y, modifiers) => {
        this.position.setText('X: ' + x.toFixed(2) + ', Y: ' + y.toFixed(2) + ' - D');
    });
    /* 
    // Simple actor example:
    this.actor = new Clutter.Actor({
        background_color: colorDark,
        x: 150, y: 150,
        height: 100, width: 100
    });
    */
    // Textured actor example
    this.actor = new Clutter.Texture({
        backgroundColor: colorDark,
        filename: __dirname + '/assets/egClutter.png',
        height: 100,
        reactive: true,
        x: 150,
        y: 150,
        width: 100
    });
    this.actor.on('enter-event', (actor, event) => {
        actor.setBackgroundColor(colorLight);

    });
    this.actor.on('leave-event', (actor, event) => {
        actor.setBackground_color(colorDark);
    });
    this.actor.addAction(action);

    return this.actor;
};

//Run the application
let app = new App();
app.run();

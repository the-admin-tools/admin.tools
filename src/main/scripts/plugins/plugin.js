// SOURCE FILE: admin.tools/src/main/scripts/plugins/plugin.js
// Copyright (c) 2019 "Aditya Naga Sanjeevi, Yellapu". All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const gridToolbar = require('../window-grid/toolbar-content');
const gridMenubar = require('../window-grid/menu-bar');
const GridObjectLib = require('../window-grid/grid-object');
const tabObject = require('../window-grid/tab-content');

const GridObject = GridObjectLib.GridObject;
const gridOnTabs = GridObjectLib.gridOnTabs;

// let gridManager = require('../window-grid/main-content');

let PluginRegister = function (pluginName) {
    this.name = pluginName;
    this.menu = true;
};

PluginRegister.prototype.setTool = function (tool) {
    gridToolbar.setTool(tool);
};

PluginRegister.prototype.setMenuItem = function (menuItem) {
    gridMenubar.setMenuItem(menuItem);
};

PluginRegister.prototype.setMenuIcon = function (menuIcon) {
    gridMenubar.setupIcon(menuIcon);
};

PluginRegister.prototype.split = function (isVertical) {
    gridOnTabs.activeGrid.doSplit(isVertical);
};

PluginRegister.prototype.deleteActiveCell = function () {
    gridOnTabs.activeGrid.deleteActiveCell();
};

PluginRegister.prototype.getActiveElement = function () {
    return gridOnTabs.activeGrid.element;
};

PluginRegister.prototype.createNewTab = function() {
    tabObject.createNewTab("Editor", "fa fa-file");
};

PluginRegister.prototype.setActiveTabName = function(name) {
    tabObject.setActiveTabName(name);
};

PluginRegister.prototype.Start = function () {
    console.error("This method shall be overridden by the plugin, which is not the case!");
    console.error("Please report to respective Plugin author", this.name);
};

module.exports = PluginRegister;
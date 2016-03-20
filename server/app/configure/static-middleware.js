"use strict";
const path = require('path'),
  express = require('express'),
  favicon = require('serve-favicon');

module.exports = function (app) {

  const root = app.getValue('projectRoot'),
    npmPath = path.join(root, './node_modules'),
    publicPath = path.join(root, './public'),
    browserPath = path.join(root, './browser');

  app.use(favicon(app.getValue('faviconPath')));
  app.use(express.static(npmPath));
  app.use(express.static(publicPath));
  app.use(express.static(browserPath));

};

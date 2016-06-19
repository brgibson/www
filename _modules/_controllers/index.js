var albums = require('../_models/albums.js');

exports.controller = function(req, res) {
    res.render('index', {
        title: 'page title',
        albumSection: albums.albums
    });
};
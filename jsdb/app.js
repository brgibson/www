var db = new PouchDB('music-library');
var remoteCouch = false;

function addAlbum(_artist, _title) {
    var album = {
	_id: _artist + _title,
	artist: _artist,
	title: _title
    };
    db.put(album, function callback(err, result) {
	if (!err) {
	    console.log('Successfully added an album!');
        }
    });
}
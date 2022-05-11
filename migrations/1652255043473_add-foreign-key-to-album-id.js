/* eslint-disable camelcase */
exports.up = (pgm) => {
  // memberikan constraint foreign key pada album_id di table songs
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id')
}

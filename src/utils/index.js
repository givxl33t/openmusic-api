/* eslint-disable camelcase */
const mapAlbumsToModel = ({
  id,
  name,
  year,
  cover,
  created_at,
  updated_at
}) => ({
  id,
  name,
  year,
  coverUrl: cover,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapSongsToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapPlaylistsToModel = ({
  id,
  name,
  username
}) => ({
  id,
  name,
  username
})

const mapPlaylistSongsToModel = ({
  id,
  title,
  performer
}) => ({
  id,
  title,
  performer
})

module.exports = {
  mapAlbumsToModel,
  mapSongsToModel,
  mapPlaylistsToModel,
  mapPlaylistSongsToModel
}

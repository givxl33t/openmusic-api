const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor (playlistsService, songsService, validator) {
    this._playlistsService = playlistsService
    this._validator = validator
    this._songsService = songsService

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this)
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this)
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this)
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this)
  }

  async postPlaylistHandler (req, res) {
    try {
      this._validator.validatePostPlaylistPayload(req.payload)
      const { id: credentialId } = req.auth.credentials
      const { name } = req.payload

      const playlistId = await this._playlistsService.addPlaylist({
        name, owner: credentialId
      })

      const response = res.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistsHandler (req) {
    const { id: credentialId } = req.auth.credentials
    const playlists = await this._playlistsService.getPlaylists(credentialId)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async getPlaylistByIdHandler (req, res) {
    try {
      const { id } = req.params
      const { id: credentialId } = req.auth.credentials

      await this._playlistsService.verifyPlaylistAccess(id, credentialId)
      const playlist = await this._playlistsService.getPlaylistById(id)

      return {
        status: 'success',
        data: {
          playlist
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // case server error!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deletePlaylistByIdHandler (req, res) {
    try {
      const { id } = req.params
      const { id: credentialId } = req.auth.credentials

      await this._playlistsService.verifyPlaylistOwner(id, credentialId)
      await this._playlistsService.deletePlaylistById(id)

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // case server error!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async postSongToPlaylistHandler (req, res) {
    try {
      this._validator.validatePostSongToPlaylistPayload(req.payload)
      const { id } = req.params
      const { id: credentialId } = req.auth.credentials
      const { songId } = req.payload

      await this._playlistsService.verifyPlaylistAccess(id, credentialId)
      // verify song existence
      await this._songsService.getSongById(songId)
      await this._playlistsService.addSongToPlaylist(id, songId)
      await this._playlistsService.addPlaylistActivity(id, songId, credentialId, 'add')

      const response = res.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist'
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // case server error!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistSongsHandler (req, res) {
    try {
      const { id } = req.params
      const { id: credentialId } = req.auth.credentials

      await this._playlistsService.verifyPlaylistAccess(id, credentialId)
      const playlist = await this._playlistsService.getPlaylistSongs(id)

      return {
        status: 'success',
        data: {
          playlist
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // case server error!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deleteSongFromPlaylistHandler (req, res) {
    try {
      const { id } = req.params
      const { id: credentialId } = req.auth.credentials
      const { songId } = req.payload

      await this._playlistsService.verifyPlaylistAccess(id, credentialId)
      await this._playlistsService.deleteSongFromPlaylist(id, songId)
      await this._playlistsService.addPlaylistActivity(id, songId, credentialId, 'delete')

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // case server error!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistActivitiesHandler (req, res) {
    try {
      const { id } = req.params
      const { id: credentialId } = req.auth.credentials

      await this._playlistsService.verifyPlaylistAccess(id, credentialId)
      const activities = await this._playlistsService.getPlaylistActivity(id)

      return {
        status: 'success',
        data: {
          playlistId: id,
          activities
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // case server error!
      const response = res.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = PlaylistsHandler

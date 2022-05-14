const ClientError = require('../../exceptions/ClientError')

class ExportsHandler {
  constructor (producerService, playlistsService, validator) {
    this._producerService = producerService
    this._playlistsService = playlistsService
    this._validator = validator

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this)
  }

  async postExportPlaylistsHandler (req, res) {
    try {
      this._validator.validateExportPlaylistsPayload(req.payload)
      const { playlistId } = req.params
      const { id: credentialId } = req.auth.credentials

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
      const message = {
        playlistId,
        targetEmail: req.payload.targetEmail
      }

      await this._producerService.sendMessage('export:playlists', JSON.stringify(message))

      const response = res.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses'
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

module.exports = ExportsHandler

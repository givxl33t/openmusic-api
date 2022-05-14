const ClientError = require('../../exceptions/ClientError')

class UploadsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler (req, res) {
    try {
      const data = req.payload
      const { albumId } = req.params

      this._validator.validateImageHeaders(data.cover.hapi.headers)

      const filename = await this._service.writeFile(data.cover, data.cover.hapi)
      await this._service.editAlbumCover(albumId, `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/covers/${filename}`)

      const response = res.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
        data: {
          coverUrl: `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/covers/${filename}`
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

module.exports = UploadsHandler

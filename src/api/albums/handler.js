const ClientError = require('../../exceptions/ClientError')

class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postAlbumHandler = this.postAlbumHandler.bind(this)
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this)
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this)
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this)
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this)
  }

  async postAlbumHandler (req, res) {
    try {
      this._validator.validateAlbumPayload(req.payload)
      const albumId = await this._service.addAlbum(req.payload)
      const response = res.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId
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

  async getAlbumsHandler () {
    const albums = await this._service.getAlbums()
    return {
      status: 'success',
      data: {
        albums
      }
    }
  }

  async getAlbumByIdHandler (req, res) {
    try {
      const { id } = req.params
      const album = await this._service.getAlbumById(id)
      return {
        status: 'success',
        data: {
          album
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

  async putAlbumByIdHandler (req, res) {
    try {
      this._validator.validateAlbumPayload(req.payload)
      const { id } = req.params

      await this._service.editAlbumById(id, req.payload)

      return {
        status: 'success',
        message: 'Album berhasil diperbarui'
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

  async deleteAlbumByIdHandler (req, res) {
    try {
      const { id } = req.params
      await this._service.deleteAlbumById(id)
      return {
        status: 'success',
        message: 'Album berhasil dihapus'
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

module.exports = AlbumsHandler

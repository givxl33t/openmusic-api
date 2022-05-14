const ClientError = require('../../exceptions/ClientError')

class LikesHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this)
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this)
  }

  async postAlbumLikesHandler (req, res) {
    try {
      const { albumId } = req.params
      const { id: credentialId } = req.auth.credentials

      await this._service.verifyAlbumId(albumId)

      const liked = await this._service.verifyAlbumLike(albumId, credentialId)
      let message
      if (!liked) {
        await this._service.addAlbumLike(albumId, credentialId)
        message = 'Like Album ditambahkan'
      } else {
        await this._service.deleteAlbumLike(albumId, credentialId)
        message = 'Like Album dibatalkan'
      }

      const response = res.response({
        status: 'success',
        message
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

  async getAlbumLikesHandler (req, res) {
    try {
      const { albumId } = req.params
      const { likes, cache } = await this._service.getAlbumLikes(albumId)

      const response = res.response({
        status: 'success',
        data: {
          likes
        }
      })
      response.code(200)
      if (cache) {
        response.header('X-Data-Source', 'cache')
      }
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

module.exports = LikesHandler

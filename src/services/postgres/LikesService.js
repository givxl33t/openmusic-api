const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class LikesService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async verifyAlbumId (albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId]
    }
    const { rows } = await this._pool.query(query)
    if (!rows.length) {
      throw new NotFoundError('Album Id tidak ditemukan')
    }
  }

  async verifyAlbumLike (albumId, userId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      return false
    }
    return true
  }

  async addAlbumLike (albumId, userId) {
    const id = `like-${nanoid(12)}`
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }
    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan')
    }
    await this._cacheService.delete(`album_like:${albumId}`)
    return result.rows[0].id
  }

  async getAlbumLikes (albumId) {
    try {
      const result = await this._cacheService.get(`album_like:${albumId}`)
      return {
        likes: +result,
        cache: true
      }
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId]
      }
      const result = await this._pool.query(query)
      const likes = +result.rows[0].count

      await this._cacheService.set(`album_like:${albumId}`, likes)
      return {
        likes,
        cache: false
      }
    }
  }

  async deleteAlbumLike (albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Like gagal dihapus.')
    }
    await this._cacheService.delete(`album_like:${albumId}`)
  }
}

module.exports = LikesService

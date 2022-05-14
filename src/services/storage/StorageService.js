const fs = require('fs')
const { Pool } = require('pg')
const NotFoundError = require('../../exceptions/NotFoundError')

class StorageService {
  constructor (folder) {
    this._folder = folder
    this._pool = new Pool()

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }
  }

  writeFile (file, meta) {
    const filename = +new Date() + meta.filename
    const path = `${this._folder}/${filename}`

    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error))
      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }

  async editAlbumCover (albumId, cover) {
    const updatedAt = new Date().toISOString
    const query = {
      text: 'UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [cover, updatedAt, albumId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui cover album. Id tidak ditemukan')
    }
  }
}

module.exports = StorageService

const path = require('path')
const glob = require('glob')

function mp3Files (dirname) {
  return new Promise((resolve, reject) => {
    const pattern = path.join(dirname, '**/*.mp3')
    glob(pattern, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files)
    })
  })
}

module.exports = mp3Files

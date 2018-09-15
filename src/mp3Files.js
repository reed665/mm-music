const glob = require('glob')

function mp3Files (dirname) {
  return new Promise((resolve, reject) => {
    glob(dirname + '**/*.mp3', (err, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files)
    })
  })
}

module.exports = mp3Files

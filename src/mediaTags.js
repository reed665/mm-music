const jsmediatags = require('jsmediatags')

function mediaTags (filename) {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(filename)
      .read({
        onSuccess: ({ tags }) => {
          const { artist, year, album } = tags
          resolve({
            filename,
            tags: { artist, year, album }
          })
        },
        onError: err => {
          console.error(`Error reading "${filename}" media tags`)
          reject(err)
        }
      })
  })
}

module.exports = mediaTags

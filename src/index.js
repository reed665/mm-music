// const jsmediatags = require('jsmediatags')
// const fs = require('fs')
const mp3Files = require('./mp3Files')

const mmMusicInput = 'E:/mm-music-input/'
// const mmMusicOutput = 'E:/mm-music-output/'

mp3Files(mmMusicInput)
  .then(files => {
    console.log(files)
  })
  .catch(err => {
    console.error(err)
  })

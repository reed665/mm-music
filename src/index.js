const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mp3Files = require('./mp3Files')
const mediaTags = require('./mediaTags')

const mmMusicInput = 'E:/mm-music-input/'
const mmMusicOutput = 'E:/mm-music-output/'

const clearFolder = folder => {
  return new Promise((resolve, reject) => {
    rimraf(folder, err => {
      if (err) {
        reject(err)
        return
      }
      fs.mkdirSync(folder)
      resolve()
    })
  })
}

const tagsPromises = files => {
  if (!files || !files.length) {
    console.log('mp3 files not found')
    return
  }
  return Promise.all(files.map(mediaTags))
}

const simplifyMusicFileData = musicFilesData => {
  return musicFilesData.map(({ filename, tags }) => {
    const { artist, year, album } = tags
    const albumFolder = [artist, year, album].join(' - ')
    return { filename, folder: albumFolder }
  })
}

const getAlbumFolders = simpleData => {
  const albumFolders = []
  for (const item of simpleData) {
    const { folder } = item
    if (albumFolders.includes(folder)) continue
    albumFolders.push(folder)
  }
  return albumFolders
}

const createAlbumFoldersSync = (simpleData, mmMusicOutput) => {
  const albumFolders = getAlbumFolders(simpleData)
  albumFolders.forEach(folder => fs.mkdirSync(mmMusicOutput + folder))
}

const copyFiles = (simpleData, destination) => {
  simpleData.forEach(({ filename, folder }) => {
    fs.createReadStream(filename).pipe(fs.createWriteStream(path.join(destination, folder, path.basename(filename))))
  })
}

Promise.resolve()
  .then(() => clearFolder(mmMusicOutput))
  .then(() => mp3Files(mmMusicInput))
  .then(tagsPromises)
  .then(simplifyMusicFileData)
  .then(simpleData => {
    createAlbumFoldersSync(simpleData, mmMusicOutput)
    copyFiles(simpleData, mmMusicOutput)
  })
  .catch(err => {
    console.error(err)
  })

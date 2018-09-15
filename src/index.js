const fs = require('fs')
const path = require('path')
const sanitize = require('sanitize-filename')
const mp3Files = require('./mp3Files')
const mediaTags = require('./mediaTags')

const mmMusicInput = 'E:/mm-music-input/'
const mmMusicOutput = 'E:/mm-music-output/'

const getTagsPromises = files => {
  if (!files || !files.length) {
    throw new Error('mp3 files not found')
  }
  console.log('>> music files found:', files.length)
  console.log('>> getting tags promises')
  return Promise.all(files.map((file, idx) => {
    const promise = mediaTags(file)
    // console.log('>> getting tag promise', '#'+idx, file)
    return promise
  }))
}

const simplifyMusicFileData = musicFilesData => {
  console.log('>> mapping music files metadata')
  return musicFilesData.map(({ filename, tags }) => {
    const { artist, year, album } = tags
    const albumFolder = [artist, year, album].join(' - ')
    return { filename, folder: sanitize(albumFolder) }
  })
}

const getAlbumFolders = simpleData => {
  console.log('>> creating album folders')
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
  albumFolders.forEach(folder => {
    const destFolderFull = path.join(mmMusicOutput, folder).trim()
    if (!fs.existsSync(destFolderFull)) {
      try {
        fs.mkdirSync(destFolderFull)
      } catch (err) {
        console.error(err)
      }
    }
  })
}

const copyFiles = (simpleData, destination) => {
  console.log('>> copying music files')
  simpleData.forEach(({ filename, folder }) => {
    const newFilename = path.join(destination, folder, path.basename(filename))
    if (!fs.existsSync(newFilename)) {
      fs.createReadStream(filename).pipe(fs.createWriteStream(newFilename))
    }
  })
}

Promise.resolve()
  .then(() => mp3Files(mmMusicInput))
  .then(getTagsPromises)
  .then(simplifyMusicFileData)
  .then(simpleData => {
    createAlbumFoldersSync(simpleData, mmMusicOutput)
    copyFiles(simpleData, mmMusicOutput)
  })
  .catch(err => {
    console.error(err)
  })

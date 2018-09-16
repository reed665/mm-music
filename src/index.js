#!/usr/bin/env node

const mp3Files = require('./mp3Files')
const { getTagsPromises, simplifyMusicFileData, createAlbumFoldersSync, copyFiles } = require('./methods')

const [,,mmMusicInput, mmMusicOutput] = process.argv
if (!mmMusicInput || !mmMusicOutput) {
  console.error('mm-music: arguments missing')
  console.info('usage example: npm start <src_folder> <dest_folder>')
  return
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

const express = require('express')
const mongoose = require('mongoose')
const Note = require('../models/note')
const Folder = require('../models/folder')

// Endpoint `/api/notes`

function validateFolderId(folderId, userId) {
  if (folderId === undefined) {
    return Promise.resolve()
  }

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid')
    err.status = 400
    return Promise.reject(err)
  }

  return Folder.countDocuments({ _id: folderId, userId })
    .then(count => {
      if (count === 0) {
        const err = new Error('The `folderId` is not valid')
        err.status = 400
        return Promise.reject(err)
      }
    })
}

const router = express.Router()

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query
  const userId = req.user.id

  let filter = { userId }

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i')
    filter.$or = [{ 'title': re }, { 'content': re }]
  }

  if (folderId) {
    filter.folderId = folderId
  }

  Note.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results)
    })
    .catch(err => {
      next(err)
    })
})

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid')
    err.status = 400
    return next(err)
  }

  Note.findOne({ _id: id, userId })
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        next()
      }
    })
    .catch(err => {
      next(err)
    })
})

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId } = req.body
  const userId = req.user.id

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body')
    err.status = 400
    return next(err)
  }

  const newNote = { title, content, folderId, userId }
  if (newNote.folderId === '') {
    delete newNote.folderId
  }

  Promise.all([
    validateFolderId(newNote.folderId, userId)
  ])
    .then(() => Note.create(newNote))
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result)
    })
    .catch(err => {
      next(err)
    })
})

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  const toUpdate = {}
  const updateableFields = ['title', 'content', 'folderId']

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field]
    }
  })

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid')
    err.status = 400
    return next(err)
  }

  if (toUpdate.title === '') {
    const err = new Error('Missing `title` in request body')
    err.status = 400
    return next(err)
  }

  if (toUpdate.folderId === '') {
    delete toUpdate.folderId
    toUpdate.$unset = { folderId: 1 }
  }

  Promise.all([
    validateFolderId(toUpdate.folderId, userId)
  ])
    .then(() => {
      return Note.findOneAndUpdate({ _id: id, userId }, toUpdate, { new: true })
    })
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        next()
      }
    })
    .catch(err => {
      next(err)
    })
})

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid')
    err.status = 400
    return next(err)
  }

  Note.findOneAndRemove({ _id: id, userId })
    .then(() => {
      res.sendStatus(204)
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router

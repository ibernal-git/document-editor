const documentRouter = require('express').Router()
const Document = require('../models/document')
const User = require('../models/user')
const { autenticate } = require('../utils/middleware')

/**
 * GET /api/documents
 * Gets all the documents from the database
 */
documentRouter.get('/', autenticate, async (_, response) => {
  const documents = await Document.find({}).populate('user', { username: 1, name: 1 })
  response.json(documents)
})

/**
 * Post /api/documents
 * Posts a new document to the database
 */
documentRouter.post('/', autenticate, async (request, response) => {
  const user = await User.findById(request.token.id)

  const document = new Document({ ...request.body, user: user._id })
  const savedDocument = await document.save().then(b => b.populate('user', { username: 1, name: 1 }).execPopulate())
  user.documents = user.documents.concat(savedDocument._id)
  await user.save()

  response.status(201).json(savedDocument)
})

/**
 * DELETE /api/docuemnts
 * Deletes a document from the database
 */
documentRouter.delete('/:id', autenticate, async (request, response, next) => {
  const id = request.params.id
  const userId = request.token.id
  const document = await Document.findById(id)

  if (!document) return next()

  if (document.user.toString() === userId.toString()) {
    document.delete()
    const user = await User.findById(document.user)

    user.documents = user.documents.filter(b => b !== document._id)
    await user.save()
    response.status(204).end()
  } else {
    response.status(401).send({ error: 'unauthorized' })
  }
})

/**
 * Put /api/documents
 * Updates a document
 */
documentRouter.put('/:id', autenticate, async (request, response) => {
  const id = request.params.id
  const result = await Document.findByIdAndUpdate(id, request.body, { new: true })
  response.status(200).json(result)
})

module.exports = documentRouter

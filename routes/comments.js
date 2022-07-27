const express = require('express')
const Comment = require('../models/comment')
const router = express.Router()

router.get('/new_comment', (req, res) => {
  res.render('comments/new_comment', { comment: new Comment() })
})

router.get('/edit_comment/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  res.render('comments/edit_comment', { comment: comment })
})

router.get('/:slug', async (req, res) => {
  const comment = await Comment.findOne({ slug: req?.params?.slug })
  if (comment == null) res.redirect('/')
  res.render('comments/show_comment', { comment: comment })
})

router.post('/', async (req, res, next) => {
  req.comment = new Comment()
  next()
}, saveCommentAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.comment = await Comment.findById(req.params.id)
  next()
}, saveCommentAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveCommentAndRedirect(path) {
  return async (req, res) => {
    let Comment = req.comment
    console.log(Comment);
    Comment.username = req.body.username
    Comment.description = req.body.description
    Comment.postId = req.body.postId
   
    try {
        Comment = await Comment.save()
      res.redirect(`/Comments/${ Comment.slug}`)
    } catch (e) {
      res.render(`comments/${path}`, { comment: Comment })
    }
  }
}

module.exports = router
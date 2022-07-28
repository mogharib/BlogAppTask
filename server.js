const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const Comment = require('./models/comment')
const articleRouter = require('./routes/articles')
const commentRouter = require('./routes/comments')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})
app.get('/comments', async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: 'desc' })
  res.render('comments/index', { comments: comments })
})

app.use('/articles', articleRouter)
app.use('/comments', commentRouter)

app.listen(process.env.PORT || 5000, (err) => {
  if (err) {
   return console.error('server could not start')
  }
  console.log('server is running')
 })

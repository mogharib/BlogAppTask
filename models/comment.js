const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

commentSchema.pre('validate', function(next) {
  if (this.username) {
    this.slug = slugify(this.username, { lower: true, strict: true })
  }

  if (this.description) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.description))
  }

  next()
})

module.exports = mongoose.model('Comment', commentSchema)
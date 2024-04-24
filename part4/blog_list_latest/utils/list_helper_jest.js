const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const blogWithMostLike = blogs.sort((b1, b2) => b2.likes - b1.likes)[0]
  const result = {
    title: blogWithMostLike?.title,
    author: blogWithMostLike?.author,
    likes: blogWithMostLike?.likes
  }
  return result ?? {}
}

const mostBlogs = (blogs) => {
  const result = _(blogs)
    .countBy('author')
    .map((value, key) => ({ author: key, blogs: value }))
    .maxBy('blogs')
  return result ?? {}
}

const mostLikes = (blogs) => {
  const result = _(_(blogs)
    .groupBy('author')
    .get(_(
      _(blogs).maxBy('likes')).get('author')
    ))
    .flatMap(blog => _.pick(blog, ['author', 'likes']))
    .reduce((acc, obj) => ({
      ...obj, likes: obj.likes + (acc.likes || 0)
    }), {})

  return result ?? {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
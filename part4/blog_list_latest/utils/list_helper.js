const _ = require('lodash')

const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((total, { likes }) => total + likes, 0)

const favoriteBlog = blogs => blogs.length ? blogs.sort((b1, b2) => b2.likes - b1.likes)[0] : null

const mostBlogs = blogs => blogs.length ? _(blogs)
  .map(blog => _(blog)
    .pick(blog, 'author')
    .value()
  )
  .sortBy('author')
  .countBy('author')
  .transform((result, blogs, author) => {
    result.push({ author, blogs })
  }, [])
  .maxBy('blogs') : null

const mostLikes = blogs => blogs.length ? _(blogs)
  .map(blog => _(blog)
    .pick('author', 'likes')
    .value()
  )
  .groupBy('author')
  .transform((result, values, key) => {
    result.push({ author: key, likes: _.sumBy(values, 'likes') })
  }, [])
  .orderBy(['likes', 'author'], ['desc', 'asc'])
  .first() : null

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
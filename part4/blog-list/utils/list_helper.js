const _ = require('lodash')

const dummy = (blogs) => {
    return 1 ?? blogs.length
}

const totalLikes = (blogs) => {
    const reducer = (total, blog) => total + blog.likes

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs, prop) => {
    const sortByProp = (a, b) => b[prop] - a[prop]

    return !blogs.length 
        ? {} 
        : blogs
            .sort(sortByProp)
            .map(blog => ({
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }))[0]
        
}

const mostBlogs = (blogs) => {
    if (!blogs.length) return {}

    const [author, authorBlogs] = _(blogs)
        .map(blog => _(blog)
            .pick('author')
            .set('blogs', 1).value()
        )
        .countBy('author')
        .entries()
        .maxBy(_.last)

    return { author, blogs: authorBlogs }
}

const mostLikes = (blogs) => {
    if (!blogs.length) return {}

    const { author } = _(blogs).maxBy('likes')
    const likes = _(blogs)
        .filter(['author', author])
        .sumBy('likes')

    return { author, likes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
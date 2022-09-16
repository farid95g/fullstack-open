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

const findAuthorWithMostBlogs = (blogs) => {
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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    findAuthorWithMostBlogs
}
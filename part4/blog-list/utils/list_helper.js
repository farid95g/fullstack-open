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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
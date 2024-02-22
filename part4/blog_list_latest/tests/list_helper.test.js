const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const singleBlog = {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }

  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that blog', () => {
    assert.strictEqual(
      listHelper.totalLikes([singleBlog]), singleBlog.likes
    )
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(
      listHelper.totalLikes(Array(4).fill(singleBlog)),
      4 * singleBlog.likes
    )
  })
})

describe('blog with most likes', () => {
  const singleBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5
  }

  test('for empty array is null', () => {
    assert.strictEqual(
      listHelper.favoriteBlog([]),
      null
    )
  })

  test('for list with one element is element itself', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog([singleBlog]),
      singleBlog
    )
  })

  test('for list with multiple elements is found correctly', () => {
    const multipleBlogs = Array(5)
      .fill(singleBlog)
      .map((blog, i) => ({ ...blog, likes: blog.likes * ++i }))

    assert.deepStrictEqual(
      listHelper.favoriteBlog([...multipleBlogs]),
      multipleBlogs[multipleBlogs.length - 1]
    )
  })
})

describe('author with most blogs', () => {
  const blogs = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
    },
    {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
    },
    {
      title: 'Type wars',
      author: 'Robert C. Martin',
    },
    {
      title: 'Blog For Testing 1',
      author: 'Edsger W. Dijkstra',
    },
    {
      title: 'Blogs for nodejs tests 1',
      author: 'Alexander Belyayev',
    },
    {
      title: 'Blogs for nodejs tests 2',
      author: 'Alexander Belyayev',
    },
    {
      title: 'Blogs for nodejs tests 3',
      author: 'Alexander Belyayev',
    },
  ]

  test('of an empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('of a list with single blog is the author of that blog', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs([blogs[0]]),
      { author: blogs[0].author, blogs: 1 }
    )
  })

  test('of a list with multiple blogs is the one with most blogs', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(blogs),
      { author: 'Alexander Belyayev', blogs: 3 }
    )
  })
})

describe('author with most likes', () => {
  const blogs = [
    {
      author: 'Robert C. Martin',
      likes: 3,
    },
    {
      author: 'Michael Chan',
      likes: 7,
    },
    {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    },
    {
      author: 'Edsger W. Dijkstra',
      likes: 12,
    },
    {
      author: 'Robert C. Martin',
      likes: 12,
    },
    {
      author: 'Robert C. Martin',
      likes: 0,
    },
    {
      author: 'Robert C. Martin',
      likes: 2,
    },
    {
      author: 'Alexander Belyayev',
      likes: 12,
    },
    {
      author: 'Alexander Belyayev',
      likes: 2,
    },
  ]

  test('of an empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('of a list with single element is that author', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes([blogs[0]]), blogs[0]
    )
  })

  test('of a list with multiple elements is the one with most likes', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(blogs),
      { author: 'Edsger W. Dijkstra', likes: 17 }
    )
  })
})
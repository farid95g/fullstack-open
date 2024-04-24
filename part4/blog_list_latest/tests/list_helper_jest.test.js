const listHelper = require('../utils/list_helper_jest')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful 1',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Go To Statement Considered Harmful 2',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 8,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]])
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(13)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful 1',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Go To Statement Considered Harmful 2',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 8,
      __v: 0
    }
  ]

  test('of an empty list is an empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('of a list with single element is the element itself', () => {
    const result = listHelper.favoriteBlog([blogs[0]])
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful 1',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('of a list with multiple items is evaluated correctly', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful 2',
      author: 'Edsger W. Dijkstra',
      likes: 8
    })
  })
})

describe('author with most blogs', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]

  test('of an empty list is an empty object', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('of a list with single element is that author with 1 blog', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    expect(result).toEqual({
      author: blogs[0].author,
      blogs: 1
    })
  })

  test('of a list with multiple items is evaluated correctly', () => {
    const result = listHelper.mostBlogs(blogs)
    const [authorWithMostBlogs] = blogs
      .reduce((acc, blog) => {
        if (acc.find(b => b.author === blog.author)) {
          return acc.map(b => b.author !== blog.author ? b : ({
            ...b, blogs: b.blogs + 1
          }))
        }

        return [ ...acc, { author: blog.author, blogs: 1 }]
      }, [])
      .sort((b1, b2) => b2.blogs - b1.blogs)

    expect(result).toEqual(authorWithMostBlogs)
  })
})

describe('blog with most likes', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]

  test('of an empty list is an empty object', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test('of a list with single element is that element', () => {
    const result = listHelper.mostLikes([blogs[0]])
    expect(result).toEqual({
      author: blogs[0].author,
      likes: blogs[0].likes
    })
  })

  test('of a list with multiple items is evaluated correctly', () => {
    const result = listHelper.mostLikes(blogs)

    const authorOfBlogWithMostLikes = blogs
      .sort((b1, b2) => b2.likes - b1.likes)[0].author
    const authorWithMostLikes = blogs
      .reduce((acc, blog) => {
        if (acc[blog.author]) {
          return {
            ...acc,
            [blog.author]: {
              ...acc[blog.author], likes: acc[blog.author].likes + blog.likes
            }
          }
        }

        return { ...acc, [blog.author]: { author: blog.author, likes: blog.likes } }
      }, {})[authorOfBlogWithMostLikes]

    expect(result).toEqual(authorWithMostLikes)
  })
})
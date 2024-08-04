import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'blog by Farid Guluzade',
    author: 'Farid Guluzade',
    url: 'https://github.com',
    likes: 26,
    user: {
      username: 'farid95g',
      name: 'Farid Guluzade',
      id: '65f345367bc0922cace565d5'
    },
    createdAt: '2024-05-31T03:48:38.116Z',
    updatedAt: '2024-05-31T03:48:38.116Z',
    id: '665948961b0ca84d2e0f2c78'
  }
  const user = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY2MWQ1YjE1N2JmNGQ1YmM4NDEzMmFhNyIsImlhdCI6MTcyMTI0MDc4NiwiZXhwIjoxNzIxMjQ0Mzg2fQ.eCQPOyv1y8yZh3OfQak8mp4JHjI2d4dhuT3l7DwP9zY',username: 'root',
    name: 'Super Root'
  }

  test('renders title, but author, url, and likes are hidden', () => {
    const { container } = render(<Blog blog={blog} user={user} updateBlog={() => {}} removeBlog={() => {}} />)

    const blogTitle = container.querySelector('.title')
    const hiddenBlogContent = screen.getByTestId('hiddenContent')

    expect(blogTitle).toHaveTextContent(blog.title)
    expect(hiddenBlogContent).toHaveStyle('display: none')
  })

  test('show hidden author, url, and likes when show button is clicked', async () => {
    render(<Blog blog={blog} user={user} updateBlog={() => {}} removeBlog={() => {}} />)

    const hiddenBlogContent = screen.getByTestId('hiddenContent')
    const togglerBtn = screen.getByText('view')

    const loggedInUser = userEvent.setup()
    await loggedInUser.click(togglerBtn)

    expect(hiddenBlogContent).toHaveStyle('display: block')
  })

  test('clicking like button twice will invoke event handler twice', async () => {
    const mockUpdateFunction = vi.fn()

    render(<Blog blog={blog} user={user} updateBlog={mockUpdateFunction} removeBlog={() => {}} />)
    const togglerBtn = screen.getByText('view')

    const loggedInUser = userEvent.setup()
    await loggedInUser.click(togglerBtn)

    const likeBtn = screen.getByText('like')
    await loggedInUser.click(likeBtn)
    await loggedInUser.click(likeBtn)

    expect(mockUpdateFunction.mock.calls).toHaveLength(2)
  })
})

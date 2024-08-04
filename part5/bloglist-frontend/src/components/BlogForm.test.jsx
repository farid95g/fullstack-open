import { render, screen } from '@testing-library/react'
import { BlogForm } from './BlogForm'
import { userEvent } from '@testing-library/user-event'

describe('<BlogForm />', () => {
  const mockBlogData = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'https://www.test-blog.com'
  }

  test('Blog form submit handler is invoked with correct data', async () => {
    const mockSubmitHandler = vi.fn()

    render(<BlogForm handleCreateNewBlog={mockSubmitHandler} />)

    const titleInput = screen.getByPlaceholderText('Enter a title')
    const authorInput = screen.getByPlaceholderText('Enter an author')
    const urlInput = screen.getByPlaceholderText('Enter an url')

    const user = userEvent.setup()

    await user.type(titleInput, mockBlogData.title)
    await user.type(authorInput, mockBlogData.author)
    await user.type(urlInput, mockBlogData.url)

    const submitBtn = screen.getByText('Create')
    await user.click(submitBtn)

    expect(mockSubmitHandler.mock.calls).toHaveLength(1)
    expect(mockSubmitHandler.mock.calls[0][0].title).toBe(mockBlogData.title)
    expect(mockSubmitHandler.mock.calls[0][0].author).toBe(mockBlogData.author)
    expect(mockSubmitHandler.mock.calls[0][0].url).toBe(mockBlogData.url)
  })
})
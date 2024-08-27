const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logout } = require('./helper')

describe('Blog app', () => {
	const mockUsers = [
		{
			name: 'Farid Guluzade',
			username: 'farid',
			password: 'salainen'
		},
		{
			name: 'Super Root',
			username: 'root',
			password: '123'
		}
	]

	const newBlog = {
		title: 'A new blog from playwright',
		author: mockUsers[0].name,
		url: 'https://www.google.com'
	}

	beforeEach(async ({ page, request }) => {
		const apiResponse = await request.post('/api/login', {
			data: {
				username: mockUsers[0].username,
				password: mockUsers[0].password
			}
		})
		const { token } = await apiResponse.json()

		await request.post('/api/testing/reset', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		await request.post('/api/users', { data: mockUsers[0] })

		await page.goto('/')
	})

	test('Login form is visible by default', async ({ page }) => {
		await expect(page.getByTestId('loginForm')).toBeVisible()
		await expect(page.getByText('Login to application')).toBeVisible()
	})

	describe('Login', () => {
		test('succeeds with correct credentials', async ({ page }) => {
			await loginWith(page, mockUsers[0].username, mockUsers[0].password)

			await expect(page.getByText(`${mockUsers[0].name} logged in`)).toBeVisible()
		})

		test('fails with wrong credentials', async ({ page }) => {
			await loginWith(page, mockUsers[0].username, 'wrong_password')

			const notification = await page.locator('.notification')
			await expect(notification).toHaveCSS('border-color', 'rgb(255, 0, 0)')
			await expect(notification).toHaveCSS('border-radius', '5px')
			await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')

			await expect(page.getByText(`${mockUsers[0].name} logged in`)).not.toBeVisible()
		})
	})

	describe('When logged in', () => {
		beforeEach(async ({ page }) => {
			await loginWith(page, mockUsers[0].username, mockUsers[0].password)
		})

		test('a new blog can be created', async ({ page }) => {
			await createBlog(page, newBlog)

			await expect(page.getByText(newBlog.title, { exact: true })).toBeVisible()
		})

		describe('and notes already exist', () => {
			beforeEach(async ({ page }) => {
				await createBlog(page, newBlog)
			})

			test('blog can be liked', async ({ page }) => {
				await page.getByRole('button', { name: 'view' }).click()
				await page.getByRole('button', { name: 'like' }).click()
				await expect(page.getByTestId('likes')).toHaveText('1')
			})

			test('blog creator can delete blog', async ({ page }) => {
				page.on('dialog', dialog => dialog.accept())
				await page.getByRole('button', { name: 'view' }).click()
				await page.getByRole('button', { name: 'Remove' }).click()

				await expect(page.getByText(newBlog.title, { exact: true })).not.toBeVisible()
			})

			test(
				'only blog creator can see delete button',
				async ({ page, request }) => {
					await request.post('/api/users', { data: mockUsers[1] })

					await logout(page)
					await loginWith(page, mockUsers[1].username, mockUsers[1].password)
					await createBlog(page, {
						title: `Blog by ${mockUsers[1].name}`,
						author: mockUsers[1].name,
						url: 'https://www.google.com'
					})
					await logout(page)
					await loginWith(page, mockUsers[0].username, mockUsers[0].password)

					await page.waitForSelector('.blog')
					const blogs = await page.locator('.blog').all()
					for (let blog of blogs) {
						const currentBlogContent = await blog.getByTestId('hiddenContent')
						const author = await currentBlogContent.getAttribute('data-blog-author')

						await blog.getByText('view').click()
						if (author === mockUsers[0].username) {
							await expect(blog.getByText('Remove')).toBeVisible()
						} else {
							await expect(blog.getByText('Remove')).not.toBeVisible()
						}
					}
				}
			)
		})
	})
})
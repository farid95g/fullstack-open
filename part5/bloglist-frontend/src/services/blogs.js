import axios from 'axios'
const baseUrl = '/api/blogs'

let token = ''

const assignToken = jwt => token = jwt

const addConfig = () => ({
  headers: {
    Authorization: `bearer ${token}`
  }
})

const getAll = async () => {
  const response = await axios.get(baseUrl, addConfig())
  return response.data
}

const createNew = async (newBlog) => {
  const response = await axios.post(baseUrl, newBlog, addConfig())
  return response.data
}

const updateBlog = async (updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, addConfig())
  return response.data
}

const deleteBlog = async (blog) => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, addConfig())
  return response.status
}

export default { getAll, createNew, updateBlog, deleteBlog, assignToken }
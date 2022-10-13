import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async (token) => {
  const response = await axios.get(baseUrl, {
    headers: { Authorization: `bearer ${token}` }
  })
  return response.data
}

export default { getAll }
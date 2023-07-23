import axios from "axios"

const APP_API_URL = process.env.REACT_APP_API_URL
export const api = {
    async addPost(post) {
      const response = await axios.post(`${APP_API_URL}/create-post`, post)
      return response.data
    },
    async removePost(id) {
      const responese = await axios.delete(`${APP_API_URL}/remove-post?id=${id}`)
      return responese.data
    },
    async search(query) {
      const response = await axios.get(`${APP_API_URL}/search?query=${query}`)
      return response.data
    },
    async getAllPosts() {
      const response = await axios.get(`${APP_API_URL}/posts`)
      return response.data
    },
}
import axios from 'axios'

export const HTTP = axios.create({
  baseURL: 'https://localhost:44325/api/v1/',
  headers: {
    Authorization: 'Bearer {token}'
  }
})

import gql from 'graphql-tag'

export const GET_BLOGS_QUERY = gql`
  query getBlogs($count: Int!) {
    getBlogs(count: $count) {
      id
      title
      description
      slug
      thumbnail {
        url
        secureUrl
      }
      coverImage {
        url
        secureUrl
      }
      content {
        blocks
      }
      categories {
        name
        slug
      }
      createdAt
    }
  }
`

export const GET_BLOG_QUERY = gql`
  query getBlog($slug: String!) {
    getBlog(slug: $slug) {
      id
      title
      description
      slug
      thumbnail {
        url
        secureUrl
      }
      coverImage {
        url
        secureUrl
      }
      content {
        blocks
      }
      categories {
        name
        slug
      }
      createdAt
    }
  }
`

export const CREATE_BLOG_MUTATION = gql`
  mutation createBlog($title: String!, $description: String, $categories: [String]) {
    createBlog(title: $title, description: $description, categories: $categories) {
      id
      title
      description
      slug
      thumbnail {
        url
        secureUrl
      }
      coverImage {
        url
        secureUrl
      }
      content {
        blocks
      }
      categories {
        name
        slug
      }
      createdAt
    }
  }
`

export const EDIT_BLOG_MUTATION = gql`
  mutation editBlog(
    $blogId: ID!
    $title: String!
    $description: String
    $time: String
    $blocks: String
    $version: String
    $categories: [String]
    $thumbnail: String
    $coverImage: String
  ) {
    editBlog(
      blogId: $blogId
      title: $title
      description: $description
      content: { time: $time, blocks: $blocks, version: $version }
      categories: $categories
      thumbnail: $thumbnail
      coverImage: $coverImage
    ) {
      id
      title
      description
      slug
      thumbnail {
        url
        secureUrl
      }
      coverImage {
        url
        secureUrl
      }
      content {
        blocks
      }
      categories {
        name
        slug
      }
      createdAt
    }
  }
`

export const DELETE_BLOG_MUTATION = gql`
  mutation deleteBlog($blogId: ID!) {
    deleteBlog(blogId: $blogId)
  }
`

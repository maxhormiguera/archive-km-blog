import gql from 'graphql-tag'

export const GET_CATEGORIES_QUERY = gql`
  query getCategories($count: Int!) {
    getCategories(count: $count) {
      id
      name
      slug
      description
    }
  }
`

export const GET_CATEGORY_QUERY = gql`
  query getCategory($slug: String!) {
    getCategory(slug: $slug) {
      id
      title
      description
      slug
      thumbnail {
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

export const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($name: String!, $description: String) {
    createCategory(name: $name, description: $description) {
      id
      name
      slug
      description
    }
  }
`
export const EDIT_CATEGORY_MUTATION = gql`
  mutation editCategory($categoryId: ID!, $name: String!, $description: String) {
    editCategory(categoryId: $categoryId, name: $name, description: $description) {
      id
      name
      slug
      description
    }
  }
`

export const DELETE_CATEGORY_MUTATION = gql`
  mutation deleteCategory($name: String!) {
    deleteCategory(name: $name)
  }
`

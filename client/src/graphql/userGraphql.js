import gql from 'graphql-tag'

export const GET_USERS_QUERY = gql`
  query getUsers($count: Int!) {
    getUsers(count: $count) {
      id
      displayName
      email
      role
    }
  }
`
export const GOOGLE_SIGN_IN_MUTATION = gql`
  mutation googleSignin($token: String!) {
    googleSignin(token: $token) {
      id
      givenName
      familyName
      displayName
      role
      token
    }
  }
`

import gql from 'graphql-tag'

export const GET_ALL_MEDIA_QUERY = gql`
  query getAllMedia($count: Int!) {
    getAllMedia(count: $count) {
      id
      publicId
      secureUrl
    }
  }
`

export const SINGLE_UPLOAD_MUTATION = gql`
  mutation singleUpload(
    $publicId: String!
    $format: String!
    $url: String!
    $secureUrl: String!
    $originalFilename: String!
  ) {
    singleUpload(
      uploadInput: {
        publicId: $publicId
        format: $format
        url: $url
        secureUrl: $secureUrl
        originalFilename: $originalFilename
      }
    ) {
      id
      publicId
      secureUrl
    }
  }
`

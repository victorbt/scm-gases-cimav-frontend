import gql from 'graphql-tag';

export const allUsers: any = gql`
query AllUsers{
  allUsers {
    id
    username
  }
}
`;

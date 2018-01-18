import gql from 'graphql-tag';

export const getUserGases: any = gql`
query GetUserGases($userId: Int!){
  getUserGases(userId:$ userId){
    id
    type{
      name
    }
    status
  }
}
`;

import gql from 'graphql-tag';

export const allGases: any = gql`
query AllGases{
  allGases {
    name
    owner {
      username
    }
  }
}
`;

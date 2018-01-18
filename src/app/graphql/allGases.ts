import gql from 'graphql-tag';

export const allGases: any = gql`
query AllGases{
  allGases {
    id
    type{
      name
    }
    order{
      id
      order_identifier
    }
    user{
      id
      username
    }
    status
  }
}
`;

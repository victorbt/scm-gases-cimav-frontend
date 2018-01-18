import gql from 'graphql-tag';

export const allOrders: any = gql`
query AllOrders{
  allOrders {
    id
    order_identifier
    user {
      username
    }
  }
}
`;

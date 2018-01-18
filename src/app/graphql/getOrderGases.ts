import gql from 'graphql-tag';

export const getOrderGases: any = gql`
query GetOrderGases($orderId: Int!){
  getOrderGases(orderId: $orderId) {
    id
    type{
      name
    }
    status
  }
}
`;

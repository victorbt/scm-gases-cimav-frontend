import gql from 'graphql-tag';

export const createOrder: any = gql`
mutation CreateOrder($order_identifier: String!,$user_id: Int!){
    createOrder(order_identifier: $order_identifier,user_id: $user_id) {
      id
  }
}
`;

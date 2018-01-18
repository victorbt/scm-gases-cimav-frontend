import gql from 'graphql-tag';

export const createGas: any = gql`
mutation CreateGas($gas_type_id: Int!, $order_id: Int!, $rack_id: Int!,$status: Int!){
    createGas(gas_type_id: $gas_type_id,order_id: $order_id,rack_id: $rack_id,status: $status) {
      id
      type{
        name
      }
      status
  }
}
`;

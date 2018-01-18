import gql from 'graphql-tag';

export const updateGasStatus: any = gql`
mutation updateGasStatus($gas_id: Int!, $status: Int!){
    updateGasStatus(gas_id: $gas_id,status: $status)
}
`;

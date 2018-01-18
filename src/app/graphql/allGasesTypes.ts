import gql from 'graphql-tag';

export const allGasesTypes: any = gql`
query AllGasesTypes{
  allGasesTypes {
    id
    name
  }
}
`;

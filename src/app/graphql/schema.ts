export interface allGasesQuery {
  allGases: Array<{
    name: string,
    owner: {
      username: string,
    }
  }> | null
}


export interface allOrdersQuery {
  allOrders: Array<{
    order_identifier: string,
    user: {
      id: number,
      username: string
    },
    owner: string,
  }> | null
}

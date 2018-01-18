export interface allGasesQuery {
  allGases: Array<{
    id: number,
    type: {
      name: string,
    },
    order: {
      id: number,
      order_identifier: string,
    },
    user: {
      id: number,
      username: string,
    }
    status: number,
  }> | null
}

export interface allGasesTypesQuery {
  allGasesTypes: Array<{
    id: number,
  }> | null
}

export interface getOrderGasesQuery {
  getOrderGases: Array<{
    id: number,
    type: {
      name: string,
    }
    status: number,
  }> | null
}
export interface getUserGasesQuery {
  getUserGases: Array<{
    id: number,
    type: {
      name: string,
    },
    status: number,
  }> | null
}

export interface allOrdersQuery {
  allOrders: Array<{
    id: number,
    order_identifier: string,
    user: {
      id: number,
      username: string
    },
    owner: string,
  }> | null
}

export interface allUsersQuery {
  allUsers: Array<{
    username: string,
    id: number,
  }> | null
}

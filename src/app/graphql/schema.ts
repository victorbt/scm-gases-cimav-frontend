export interface allGasesQuery {
  allGases: Array<{
    name: string,
    owner: {
      username: string,
    }
  }> | null
}

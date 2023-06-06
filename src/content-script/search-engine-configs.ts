export interface SearchEngine {
  inputQuery: string[]
  bodyQuery: string[]
  sidebarContainerQuery: string[]
  appendContainerQuery: string[]
  watchRouteChange?: (callback: () => void) => void
}

export const config: Record<string, SearchEngine> = {
  spoj: {
    inputQuery: ["input[name='query']"],
    bodyQuery: ['table.table-condensed tbody'],
    sidebarContainerQuery: ['#ccontent'],
    appendContainerQuery: [],
  },
}


export default function () {
  const breadcrumbs = useState<Array<any>>('breadcrumbs', () => ([]))
  
  const getBreadcrumbs = () : Array<any> => {
    return breadcrumbs.value
  }

  const setBreadcrumbs = (params: Array<any>) => {
    breadcrumbs.value = params
  }

  const clearBreadcrumbs = () => {
    breadcrumbs.value = []
  }

  return {
    getBreadcrumbs,
    setBreadcrumbs,
    clearBreadcrumbs
  }
}


export default function () {
  const { $storage, $request } = useNuxtApp()

  let sinfo = $storage.get('siteinfo');

  const siteinfo = useState<object|null>('siteinfo', () => (sinfo || null))

  const clearSiteinfo = () => {
    $storage.remove('siteinfo');
    if(siteinfo?.value) {
      siteinfo.value = null
    }
  }

	const fetchSiteinfo = () : Promise<object> => {
		return new Promise((resolve, reject) => {
			$request.post('site.info', { cache: false }).then(function ({ data, error } : any) {
				if (!error) {
					setSiteinfo(data.data)
					resolve(data.data)
				} else if (error?.status_code) {
					reject(error)
				}
			})
		})
	}

  const setSiteinfo = (info: object) => {
    $storage.set('siteinfo', info);
    siteinfo.value = info
  }

  const getSiteinfo = () => {
    return siteinfo.value
  }
  
  const hasSiteinfo = () : boolean => {
    return !!siteinfo.value
  }

  return {
    fetchSiteinfo,
    hasSiteinfo,
    setSiteinfo,
    getSiteinfo,
    clearSiteinfo
  }
}

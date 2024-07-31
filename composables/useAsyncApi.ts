import type { Ref, WatchSource } from 'vue';
import { NuxtApp } from '#app';

type AsyncApiOptions<DataT> = {
	key?: string,
	server?: boolean
	lazy?: boolean
	default?: () => DataT | Ref<DataT> | null
	transform?: (input: DataT) => DataT
	pick?: string[]
	watch?: WatchSource[]
	cache?: boolean
	immediate?: boolean
}

const useAsyncApi = async <DataT> (
	handler: (nuxtApp?: NuxtApp) => Promise<DataT>,
	options?: AsyncApiOptions<DataT>
) => {
	const opt = {
		server: options?.server,
		lazy: options?.lazy,
		default: options?.default,
		transform: options?.transform,
		pick: options?.pick,
		watch: options?.watch,
		initialCache: options?.cache,
		immediate: options?.immediate,
	}
	
	const { data: _d, pending: _p, error: _e, refresh: _r } = await (options?.key ? useAsyncData<any, DataT>(
		options.key,
		//@ts-ignore
		handler,
		//@ts-ignore
		opt
		//@ts-ignore
	) : useAsyncData<any, DataT>(
		//@ts-ignore
		handler,
		opt
	))

	//@ts-ignore
	const { data, status_code, status_message, pending, refresh, error, reference_error } = _d.value

	return {
		data: data,
		status_code,
		status_message,
		pending: _p,
		refresh: _r,
		error: error,
		reference_error,
	}
}

export default useAsyncApi
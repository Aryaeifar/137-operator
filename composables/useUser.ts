import { UserParams } from '../types/auth'

export default function () {
  const { $storage } = useNuxtApp()

  let params = $storage.get('user');

  const user = useState<UserParams|null>('user', () => (params || null))
  
  const getUser = () : UserParams|null => {
    return user.value
  }

  const setUser = (params: UserParams) => {
    $storage.set('user', params);
    user.value = params
  }

  const clearUserData = () => {
    $storage.remove('user');
    user.value = null
  }

  return {
    getUser,
    setUser,
    clearUserData
  }
}

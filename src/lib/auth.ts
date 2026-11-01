import { cookies } from 'next/headers';
import { api,User } from './api';
export async function currentUser():Promise<User|null>{const token=(await cookies()).get('minishop_session')?.value;if(!token)return null;try{return (await api<{user:User}>('/api/auth/me',{headers:{Authorization:`Bearer ${token}`}})).user}catch{return null}}

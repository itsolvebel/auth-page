import { Toaster } from 'react-hot-toast'

import { LoginForm } from '@/components/LoginComponents/LoginForm'

export default function LoginPage() {
  return (
    <div className='flex h-screen w-screen bg-white p-4'>
      <Toaster />
      <LoginForm />
    </div>
  )
}

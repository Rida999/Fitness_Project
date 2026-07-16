// src/components/AdminRoute.tsx
import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentProfile, isAdminEmail } from '@/lib/supabase'
import LoadingScreen from '@/components/LoadingScreen'

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getCurrentProfile().then((user) => {
      setIsAdmin(isAdminEmail(user?.email))
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <LoadingScreen message="Checking admin access..." />

  return isAdmin ? <>{children}</> : <Navigate to="/signin" replace />
}

export default AdminRoute

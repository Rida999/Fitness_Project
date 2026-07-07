// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return null

  return isAuthenticated
    ? <>{children}</>
    : <Navigate to="/signin" replace state={{ from: location }} />
}

export default ProtectedRoute

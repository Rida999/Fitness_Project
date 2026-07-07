// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return null

  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />
}

export default ProtectedRoute

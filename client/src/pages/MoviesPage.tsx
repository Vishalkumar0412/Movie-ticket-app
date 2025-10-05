import { useEffect, useState } from 'react'
import type { ApiResponse } from '@/shared/types/apiResponse.type'
import type { IMovie } from '@/shared/types/movie.type'
import MoviesGrid from '@/components/MoviesGrid'
import { api } from '@/lib/api'
import { CardsSkeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const MoviesPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await api.get<ApiResponse<IMovie[]>>('/movie/fetch-movies')
        if (res.success && res.data) setMovies(res.data)
      } catch (e: any) {
        setError(e?.response?.data?.message || (e instanceof Error ? e.message : 'Failed to fetch movies'))
        toast.error('Failed to fetch movies')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-4"><CardsSkeleton /></div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  return (
    <div className="p-4">
      <MoviesGrid movies={movies} />
    </div>
  )
}

export default MoviesPage

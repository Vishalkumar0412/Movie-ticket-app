import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Form = {
  movie: string
  theater: string
  showTime: string
  rows: number
  cols: number
}

type Movie = {
  _id: string
  title: string
}

type Theater = {
  _id: string
  name: string
  city: string
}

export default function AddShowtime() {
  const { register, handleSubmit, reset } = useForm<Form>()
  const [movies, setMovies] = useState<Movie[]>([])
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatersRes] = await Promise.all([
          api.get('/movies'),
          api.get('/theaters')
        ])
        if (moviesRes.data?.success) {
          setMovies(moviesRes.data.data)
        }
        if (theatersRes.data?.success) {
          setTheaters(theatersRes.data.data)
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error( 'Failed to fetch movies and theaters')
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: Form) => {
    try {
      setLoading(true)
      const payload = { 
        ...data, 
        showTime: new Date(data.showTime).toISOString(), 
        rows: Number(data.rows), 
        cols: Number(data.cols) 
      }
      const res = await api.post('/admin/add-show', payload)
      if (res.data?.success) {
        toast.success('Showtime added successfully')
        reset()
      }
    } catch (e: any) {
      toast.success(e?.response?.data?.message || 'Failed to add showtime')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Add Showtime</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Label htmlFor="movie">Select Movie</Label>
          <select 
            id="movie" 
            {...register('movie')} 
            className="w-full border rounded-md h-10 px-3"
            required
          >
            <option value="">Select a movie</option>
            {movies.map(movie => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="theater">Select Theater</Label>
          <select 
            id="theater" 
            {...register('theater')} 
            className="w-full border rounded-md h-10 px-3"
            required
          >
            <option value="">Select a theater</option>
            {theaters.map(theater => (
              <option key={theater._id} value={theater._id}>
                {theater.name} - {theater.city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="showTime">Show Time</Label>
          <Input 
            id="showTime" 
            type="datetime-local" 
            {...register('showTime')} 
            required 
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rows">Number of Rows</Label>
            <Input 
              id="rows" 
              type="number" 
              min={1} 
              max={26}
              {...register('rows')} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="cols">Number of Columns</Label>
            <Input 
              id="cols" 
              type="number" 
              min={1} 
              max={20}
              {...register('cols')} 
              required 
            />
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Adding Showtime...' : 'Add Showtime'}
        </Button>
      </form>
    </div>
  )
}



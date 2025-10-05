import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MovieGenre } from '@/shared/constraints/constraints'
import { UploadProgress } from '@/components/ui/upload-progress'
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const fileSchema = z.object({
  file: z.custom<File>()
    .refine((file) => file instanceof File, "Must be a valid file")
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
})

type Form = {
  title: string
  description: string
  posterUrl: string
  trailerUrl?: string
  genre: typeof MovieGenre[keyof typeof MovieGenre]
}

type UploadProgress = {
  poster: number
  trailer: number
}

export default function AddMovie() {
  const { register, handleSubmit, reset } = useForm<Form>()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ poster: 0, trailer: 0 })
  const [currentFiles, setCurrentFiles] = useState<{poster?: File, trailer?: File}>({})

  const uploadFile = async (file: File, type: 'poster' | 'trailer') => {
    try {
      fileSchema.parse({ file })
      const form = new FormData()
      form.append('file', file)
      
      const res = await api.post('/admin/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 0))
          setUploadProgress(prev => ({ ...prev, [type]: percentCompleted }))
        }
      })
      
      return res.data?.data?.secure_url as string
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(error.errors[0].message)
      }
      throw error
    }
  }
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'poster' | 'trailer') => {
    const file = event.target.files?.[0]
    if (file) {
      setCurrentFiles(prev => ({ ...prev, [type]: file }))
    }
  }

  const onSubmit = async (data: Form) => {
    try {
      setUploading(true)
      const payload: Form = { ...data }
      
      if (currentFiles.poster) {
        try {
          payload.posterUrl = await uploadFile(currentFiles.poster, 'poster')
        } catch (error) {
          toast.error(`Poster upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          return
        }
      }
      
      if (currentFiles.trailer) {
        try {
          payload.trailerUrl = await uploadFile(currentFiles.trailer, 'trailer')
        } catch (error) {
          toast.error(`Trailer upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
          return
        }
      }
      
      const res = await api.post('/admin/add-movie', payload)
      if (res.data?.success) {
        toast.success('Movie added successfully')
        reset()
        setCurrentFiles({})
        setUploadProgress({ poster: 0, trailer: 0 })
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add movie')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Add Movie</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            {...register('title')} 
            required 
            placeholder="Enter movie title"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input 
            id="description" 
            {...register('description')} 
            required 
            placeholder="Enter movie description"
          />
        </div>
        <div>
          <Label htmlFor="posterUrl">Poster (Max 10MB)</Label>
          <Input 
            id="posterUrl" 
            type="file" 
            accept="image/*" 
            onChange={(e) => onFileChange(e, 'poster')}
            required 
          />
          {currentFiles.poster && uploadProgress.poster > 0 && (
            <div className="mt-2">
              <UploadProgress 
                progress={uploadProgress.poster} 
                fileName={currentFiles.poster.name} 
              />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="trailerUrl">Trailer (optional, Max 10MB)</Label>
          <Input 
            id="trailerUrl" 
            type="file" 
            accept="video/*" 
            onChange={(e) => onFileChange(e, 'trailer')}
          />
          {currentFiles.trailer && uploadProgress.trailer > 0 && (
            <div className="mt-2">
              <UploadProgress 
                progress={uploadProgress.trailer} 
                fileName={currentFiles.trailer.name} 
              />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <select 
            id="genre" 
            className="border rounded h-10 px-3 w-full" 
            {...register('genre')} 
            required
          >
            {Object.values(MovieGenre).map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <Button 
          type="submit" 
          disabled={uploading}
          className="w-full"
        >
          {uploading ? 'Adding Movie...' : 'Add Movie'}
        </Button>
      </form>
    </div>
  )
}



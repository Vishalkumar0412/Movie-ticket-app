import { ItemGroup } from "@/components/ui/item"
import Movie from "./Movie"
import type { IMovie } from "@/shared/types/movie.type"
import { CardSkeleton } from "@/components/ui/loading"
import { ErrorMessage } from "@/components/ui/error"

interface MoviesGridProps {
  movies: IMovie[]
  loading?: boolean
  error?: string
  title?: string
}

export default function MoviesGrid({ 
  movies, 
  loading = false, 
  error,
  title = "List of Movies" 
}: MoviesGridProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
          {title}
        </h1>
        {loading && (
          <span className="text-sm text-gray-500">
            Loading...
          </span>
        )}
      </div>

      <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <CardSkeleton count={8} />
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <Movie movie={movie} key={movie._id} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No movies found
          </div>
        )}
      </ItemGroup>
    </div>
  )
}

import { useState } from "react";
import { Link } from "react-router-dom";
import type { IMovie } from "@/shared/types/movie.type";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "./ui/item";
import { Button } from "./ui/button";
import { Spinner } from "./ui/loading";

const Movie = ({ movie }: { movie: IMovie }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Item key={movie.title} variant="outline" className="group hover:shadow-md transition-shadow duration-200">
      <ItemHeader className="relative overflow-hidden rounded-t-lg">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Spinner size="md" className="text-blue-600" />
          </div>
        )}
        <img
          src={imageError ? "/placeholder-movie.jpg" : movie.posterUrl}
          alt={movie.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          width={300}
          height={450}
          className={`aspect-[2/3] w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {movie.trailerUrl && (
          <Link 
            to={movie.trailerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm hover:bg-black/70 transition-colors"
          >
            Watch Trailer
          </Link>
        )}
      </ItemHeader>
      <ItemContent className="flex-grow">
        <ItemTitle className="text-lg font-semibold line-clamp-1">
          {movie.title}
        </ItemTitle>
        <ItemDescription className="line-clamp-2 text-sm text-gray-600">
          {movie.description}
        </ItemDescription>
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            {movie.genre}
          </span>
        </div>
      </ItemContent>
      <ItemFooter className="pt-4">
        <Link to={`/movies/${movie._id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Showtimes
          </Button>
        </Link>
      </ItemFooter>
    </Item>
  );
};

export default Movie;

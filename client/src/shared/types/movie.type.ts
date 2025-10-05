export interface IMovie  {
  _id: string;
  title: string;
  description: string;
  posterUrl :string;
  trailerUrl?: string;
  genre: string;
  showtimes?: string[];
}
export type movieType=IMovie
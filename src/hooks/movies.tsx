import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { GenreResponseProps, MovieProps } from '../dtos/types';
import { api } from '../services/api';

interface MoviesContextData {
    movies:MovieProps[];
    selectedGenre:GenreResponseProps;
    selectedGenreId:number;
    setSelectedGenreId(id:number):void;
}

const MoviesContext = createContext<MoviesContextData>({} as MoviesContextData);

interface MoviesProviderProps {
    children:ReactNode;
}

export const MoviesProvider = ({children}:MoviesProviderProps) => {

    const [selectedGenreId, setSelectedGenreId] = useState(1);

    const [movies, setMovies] = useState<MovieProps[]>([]);

    const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);


    useEffect(() => {
        api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
          setMovies(response.data);
        });
    
        api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
          setSelectedGenre(response.data);
        })
      }, [selectedGenreId]);

    return (
        <MoviesContext.Provider value={{movies, selectedGenre, selectedGenreId, setSelectedGenreId}}>
            {children}
        </MoviesContext.Provider>
    )
}
export function useMovie() {
    const context = useContext(MoviesContext);

    return context;
}
import React, { useState, useEffect } from 'react';
import {
  useParams
} from "react-router-dom";
import axios from 'axios';
import TopNavbar from '../components/TopNavbar';
import { Spinner } from 'react-bootstrap';
import { getGenreNames } from '../utils/genres_v2';
import { getAllDirectors, getAllActors } from '../utils/credits';
import RecommendedMoviesList from '../components/RecommendedMoviesList';
import moment from 'moment';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

/**
 * @description - Page that shows a movie with a preview video and details such as its rating, genres, release date, director, production, cast, box office and recommended movies.
 * @returns {React.FC}
 */
const Movie = () => {
  const { id } = useParams();

  const [details, setDetails] = useState();
  const [videos, setVideos] = useState();
  const [credits, setCredits] = useState();
  const [recommendedMovies, setRecommendedMovies] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getAndSetAllMovieDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * @description - Get and set all the details about the movie. We'll need separate API calls because of how the TMDB API works and because specific stuff like videos related to the movie and the team behind it are NOT in the same API endpoint as the basic movie details.
   */
  const getAndSetAllMovieDetails = async () => {
    setLoading(true);
    setDetails(await getMovieDetails());
    setVideos(await getVideos());
    setCredits(await getCredits());
    setRecommendedMovies(await getRecommendedMovies());
    setLoading(false);
  };

  /**
   * @description - Get the movie's details.
   * @returns {Object}
   */
  const getMovieDetails = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
    return response.data;
  };

  /**
   * @description - Get videos related to the movie. These can be about anything as long as it's related to the movie but it'll include links to videos on both YouTube and Vimeo. We'll be using YouTube as that makes the embed video process easier.
   * @returns {Object}
   */
  const getVideos = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
    return response.data;
  };

  /**
   * @description - Get information about the crew and cast behind this movie.
   * @returns {Object}
   */
  const getCredits = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`);
    return response.data;
  };

  /**
   * @description - Get other movies that people who like this current movie would enjoy.
   * @returns {Object}
   */
  const getRecommendedMovies = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`);
    return response.data;
  };

  return (
    <div className="bg-black navbarMargin pb-3">
      <TopNavbar />

      {loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
        <div className="moviePageContainer">
          {/* If there's at least one video, then take the first video and show that. We'll be using YouTube as that's the most mainstream option plus most people already use it. */}
          {videos.results.length >= 1 ?
            (<div className="videoWrapper" style={{}}>
              <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos.results[0].key}?&autoplay=1&loop=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
            </div>) : (
              // If there's NO videos, then show an image of the movie. Get the horizontal poster if possible BUT if not just use the normal poster.
              <div>
                <img src={`https://image.tmdb.org/t/p/original${details?.backdrop_path || details?.poster_path}`} alt="" className="w-100" />
              </div>
            )}

          <div className="d-flex gap-4 my-4">
            {/* Shows the movie poster. Will not appear on mobile (screen sizes smaller than 600px) */}
            <div>
              <img src={`https://image.tmdb.org/t/p/original${details?.poster_path || details?.backdrop_path}`} alt="" className="moviePoster" />
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center">
                {/* Title */}
                {details.title ? (
                  <div>
                    <h1 className="fw-bold">{details.title || details.name || details.original_name}</h1>
                  </div>
                ) : null}

                {/* Star rating (i.e. 7.35/10) with the number of times it's been rated (i.e. 1,619) */}
                {details?.vote_count > 0 ? (
                  <div className="d-flex align-items-center gap-2">
                    <div>
                      <i className="bi bi-star-fill fs-3 text-warning"></i>
                    </div>
                    <div className="">
                      <div className="text-center fs-3">
                        <span>{Math.round((details?.vote_average + Number.EPSILON) * 100) / 100}</span>
                        <span className="text-secondary">/10</span>
                      </div>

                      <div className="fs-6 text-secondary text-center">{Number(details?.vote_count).toLocaleString()}</div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* A short paragraph describing what the movie is about. */}
              <div className="mb-4">{details.overview}</div>

              <div className="space-between-y-1">
                {/* Genre */}
                {details.genres && details.genres.length > 0 ? (
                  <div><span className="text-lightgray" style={{ width: '100px' }}>Genre:</span> {getGenreNames(details?.genres)}</div>
                ) : null}

                {/* Release date */}
                {details.release_date ? (
                  <div><span className="text-lightgray">Release:</span> {moment(details?.release_date).format('MMMM Do, YYYY')}</div>
                ) : null}

                {/* Director */}
                {credits && credits.crew && credits.crew.filter((member) => member.job === 'Director').length >= 1 ? (
                  <div>
                    <span className="text-lightgray me-1 span">
                      Director:
                    </span>
                    <span>{getAllDirectors(credits)}</span>
                  </div>
                ) : null}

                {/* Production companies */}
                {details.production_companies && details.production_companies.length > 0 ? (
                  <div>
                    <span className="text-light=gray me-1 span">
                      Production:
                    </span>
                    {details.production_companies.map((company, i) => <span>{company.name}{i !== details.production_companies.length - 1 ? ', ' : null}</span>)}
                  </div>
                ) : null}

                {/* Cast (or actors) */}
                {credits.cast && credits.cast.length > 0 ? (
                  <div><span className="text-lightgray">Cast:</span> {getAllActors(credits)}</div>
                ) : null}

                {/* Box office */}
                {details.revenue ? (
                  <div><span className="text-lightgray">Box Office:</span> ${Number(details?.revenue).toLocaleString()}</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Shows the list of recommended movies. */}
          <RecommendedMoviesList recommendedMovies={recommendedMovies} />
        </div>
      )}
    </div>
  );
};

export default Movie;

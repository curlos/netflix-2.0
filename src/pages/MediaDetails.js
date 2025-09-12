import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { Spinner } from 'react-bootstrap';
import { getGenreNames } from '../utils/genres_v2';
import { getAllDirectors, getAllActors } from '../utils/credits';
import RecommendedMoviesList from '../components/RecommendedMoviesList';
import Seasons from '../components/Seasons';
import moment from 'moment';
import { useGetMediaDetailsQuery, useGetMediaVideosQuery, useGetMediaCreditsQuery, useGetMediaRecommendationsQuery } from '../services/mediaApi';

/**
 * @description - Unified page that shows media (movie or TV show) details with preview video, rating, metadata, and recommendations
 * @returns {React.FC}
 */
const MediaDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine media type from route
  const isMovie = location.pathname.includes('/title/movie/');
  const mediaType = isMovie ? 'movie' : 'tv';
  
  // RTK Query hooks using unified media API
  const { data: details, isLoading: detailsLoading } = useGetMediaDetailsQuery({ mediaType, id });
  const { data: videos, isLoading: videosLoading } = useGetMediaVideosQuery({ mediaType, id });
  const { data: credits, isLoading: creditsLoading } = useGetMediaCreditsQuery({ mediaType, id });
  const { data: recommendedContent, isLoading: recommendedLoading } = useGetMediaRecommendationsQuery({ mediaType, id });
  
  const loading = detailsLoading || videosLoading || creditsLoading || recommendedLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // TV-specific: Get the year range for TV shows
  const getYears = (details) => {
    const startYear = new Date(details.first_air_date).getFullYear();
    const endYear = details.next_episode_to_air === null ? new Date(details.last_air_date).getFullYear() : '';
    return (
      <span>
        <span className="text-lightgray">Year{startYear !== endYear ? 's' : ''}: </span>
        <span>{startYear !== endYear ? `${startYear} - ${endYear}` : startYear}</span>
      </span>
    );
  };

  return (
    <div className="bg-black navbarMargin pb-3">
      <TopNavbar />

      {loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
        <div className="moviePageContainer container mx-auto px-3 px-sm-0">
          {/* Video or image display */}
          {videos?.results?.length >= 1 ?
            (<div className="videoWrapper" style={{}}>
              <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos?.results?.[0]?.key}?&autoplay=1&loop=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
            </div>) : (
              <div>
                <img src={`https://image.tmdb.org/t/p/original${details?.backdrop_path || details?.poster_path}`} alt="" className="w-100" />
              </div>
            )}

          <div className="d-flex gap-4 my-4">
            {/* Media poster */}
            <div>
              <img src={`https://image.tmdb.org/t/p/original${details?.poster_path || details?.backdrop_path}`} alt="" className="moviePoster" />
            </div>

            <div className={isMovie ? '' : 'w-100'}>
              <div className="d-flex justify-content-between align-items-center">
                {/* Title - TV shows have more fallback options */}
                {(isMovie ? details?.title : (details?.title || details?.original_name)) ? (
                  <div>
                    <h1 className="fw-bold">{details?.title || details?.name || details?.original_name}</h1>
                  </div>
                ) : null}

                {/* Star rating */}
                {details?.vote_count > 0 ? (
                  <div className="d-flex align-items-start gap-2">
                    <div className="mt-2">
                      <i className="bi bi-star-fill fs-4 text-warning"></i>
                    </div>
                    <div className="">
                      <div className="text-center fs-2">
                        <span className="fw-bold">{Math.round((details?.vote_average + Number.EPSILON) * 100) / 100}</span>
                        <span className="text-secondary fs-4">/10</span>
                      </div>
                      <div className="fs-6 text-secondary text-center">{Number(details?.vote_count).toLocaleString()}</div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Overview */}
              <div className="mb-4">{details?.overview}</div>

              <div className="space-between-y-1">
                {/* Genre */}
                {details?.genres && details?.genres?.length > 0 ? (
                  <div><span className="text-lightgray" style={{ width: '100px' }}>Genre:</span> {getGenreNames(details?.genres)}</div>
                ) : null}

                {/* Date - Different logic for movies vs TV shows */}
                {isMovie ? (
                  // Movies: Show release date
                  details?.release_date ? (
                    <div><span className="text-lightgray">Release:</span> {moment(details?.release_date).format('MMMM Do, YYYY')}</div>
                  ) : null
                ) : (
                  // TV Shows: Show year range or release date if available
                  <>
                    {details?.release_date ? (
                      <div><span className="text-lightgray">Release Date:</span> {moment(details?.air_date).format('MMMM Do, YYYY')}</div>
                    ) : null}
                    
                    {!details?.release_date && details?.first_air_date && details?.last_air_date ? (
                      <div>{getYears(details)}</div>
                    ) : null}
                  </>
                )}

                {/* Director */}
                {credits && credits?.crew && credits?.crew?.filter((member) => member.job === 'Director').length >= 1 ? (
                  <div>
                    <span className="text-lightgray me-1 span">Director:</span>
                    {getAllDirectors(credits).map((director, index) => (
                      <span key={director.id}>
                        <span 
                          className="text-white cursor-pointer hover:text-gray-300"
                          style={{ cursor: 'pointer', textDecoration: 'none' }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          onClick={() => navigate(`/person/${director.id}`)}
                        >
                          {director.name}
                        </span>
                        {index < getAllDirectors(credits).length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Production companies */}
                {details?.production_companies && details?.production_companies?.length > 0 ? (
                  <div>
                    <span className="text-lightgray me-1 span">Production:</span>
                    {details?.production_companies?.map((company, i) => <span key={company.id || i}>{company.name}{i !== details?.production_companies?.length - 1 ? ', ' : null}</span>)}
                  </div>
                ) : null}

                {/* Cast */}
                {credits?.cast && credits?.cast?.length > 0 ? (
                  <div>
                    <span className="text-lightgray">Cast:</span>{' '}
                    {getAllActors(credits).map((actor, index) => (
                      <span key={actor.id}>
                        <span 
                          className="text-white cursor-pointer hover:text-gray-300"
                          style={{ cursor: 'pointer', textDecoration: 'none' }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                          onClick={() => navigate(`/person/${actor.id}`)}
                        >
                          {actor.name}
                        </span>
                        {index < getAllActors(credits).length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Box office - Movies: show if revenue exists, TV: show if release_date exists (matches original logic) */}
                {(isMovie ? details?.revenue : details?.release_date) ? (
                  <div><span className="text-lightgray">Box Office:</span> ${Number(details?.revenue).toLocaleString()}</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* TV Show specific: Seasons component */}
          {!isMovie && <Seasons tvShowID={id} tvShowDetails={details} />}

          {/* Recommended content */}
          <RecommendedMoviesList recommendedMovies={recommendedContent} />
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
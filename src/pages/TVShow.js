import React, { useEffect } from 'react';
import {
  useParams
} from "react-router-dom";
import TopNavbar from '../components/TopNavbar';
import { Spinner } from 'react-bootstrap';
import { getGenreNames } from '../utils/genres_v2';
import { getAllDirectors, getAllActors } from '../utils/credits';
import RecommendedMoviesList from '../components/RecommendedMoviesList';
import Seasons from '../components/Seasons';
import moment from 'moment';
import { useGetTVShowDetailsQuery, useGetTVVideosQuery, useGetTVCreditsQuery, useGetTVRecommendationsQuery } from '../services/tvApi';

/**
 * @description - 
 * @returns {React.FC}
 */
const TVShow = () => {
  const { id } = useParams();

  // RTK Query hooks
  const { data: details, isLoading: detailsLoading } = useGetTVShowDetailsQuery(id);
  const { data: videos, isLoading: videosLoading } = useGetTVVideosQuery(id);
  const { data: credits, isLoading: creditsLoading } = useGetTVCreditsQuery(id);
  const { data: recommendedTVShows, isLoading: recommendedLoading } = useGetTVRecommendationsQuery(id);
  
  const loading = detailsLoading || videosLoading || creditsLoading || recommendedLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Get the year the TV show started and the year it ended (or if it hasn't ended, then just the current year) and format it.
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
          {/* If there's at least one video, then take the first video and show that. We'll be using YouTube as that's the most mainstream option plus most people already use it. */}
          {videos?.results?.length >= 1 ?
            (<div className="videoWrapper" style={{}}>
              <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videos?.results?.[0]?.key}?&autoplay=1&loop=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} loop={true} autoPlay={true} muted={true} className="video-size"></iframe>
            </div>) : (
              // If there's NO videos, then show an image of the TV show. Get the horizontal poster if possible BUT if not just use the normal poster.
              <div>
                <img src={`https://image.tmdb.org/t/p/original${details?.backdrop_path || details?.poster_path}`} alt="" className="w-100" />
              </div>
            )}

          <div className="d-flex gap-4 my-4">
            {/* Shows the TV show poster. Will not appear on mobile (screen sizes smaller than 600px). Will use a TV poster of the MOST RECENT season. */}
            <div>
              <img src={`https://image.tmdb.org/t/p/original${details?.poster_path || details?.backdrop_path}`} alt="" className="moviePoster" />
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center">
                {details?.title || details?.original_name ? (
                  <div>
                    <h1 className="fw-bold">{details?.title || details?.name || details?.original_name}</h1>
                  </div>
                ) : null}

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

              <div className="mb-4">{details?.overview}</div>

              <div className="space-between-y-1">

                {details?.genres && details?.genres?.length > 0 ? (
                  <div><span className="text-lightgray" style={{ width: '100px' }}>Genre:</span> {getGenreNames(details?.genres)}</div>
                ) : null}

                {details?.release_date ? (
                  <div><span className="text-lightgray">Release Date:</span> {moment(details?.air_date).format('MMMM Do, YYYY')}</div>
                ) : null}

                {!details?.release_date && details?.first_air_date && details?.last_air_date ? (
                  <div>{getYears(details)}</div>
                ) : null}

                {credits && credits?.crew && credits?.crew?.filter((member) => member.job === 'Director').length >= 1 ? (
                  <div>
                    <span className="text-lightgray me-1 span">
                      Director:
                    </span>
                    <span>{getAllDirectors(credits)}</span>
                  </div>
                ) : null}

                {details?.production_companies && details?.production_companies?.length > 0 ? (
                  <div>
                    <span className="text-lightgray me-1 span">
                      Production:
                    </span>
                    {details?.production_companies?.map((company, i) => <span key={company.id || i}>{company.name}{i !== details?.production_companies?.length - 1 ? ', ' : null}</span>)}
                  </div>
                ) : null}

                {credits?.cast && credits?.cast?.length > 0 ? (
                  <div><span className="text-lightgray">Cast:</span> {getAllActors(credits)}</div>
                ) : null}

                {details?.release_date ? (
                  <div><span className="text-lightgray">Box Office:</span> ${Number(details?.revenue).toLocaleString()}</div>
                ) : null}
              </div>
            </div>
          </div>

          <Seasons tvShowID={id} tvShowDetails={details} />

          <RecommendedMoviesList recommendedMovies={recommendedTVShows} />
        </div>
      )}
    </div>
  );
};

export default TVShow;

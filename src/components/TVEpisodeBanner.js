import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import moment from 'moment';
import { useGetTVShowSeasonsQuery } from '../services/tvApi';

/**
 * @description - 
 * @returns {React.FC}
 */
const TVEpisodeBanner = ({ tvShow, episode, currentSeason, tvShowId, currentSeasonNum, currentEpisodeNum }) => {
  const overviewRef = useRef(null);
  const typedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      strings: [episode.overview],
      typeSpeed: 20,
      startDelay: 300,
      showCursor: false
    };

    typedRef.current = new Typed(overviewRef.current, options);

    return () => {
      typedRef.current.destroy();
    };

  }, [episode]);

  // Fetch previous season data when we're on episode 1 of current season (for prev navigation)
  const needsPrevSeasonData = currentEpisodeNum === 1 && currentSeasonNum > 1;
  const { data: prevSeason } = useGetTVShowSeasonsQuery({
    tvId: tvShowId,
    seasonNumber: currentSeasonNum - 1
  }, {
    skip: !needsPrevSeasonData
  });

  // Navigation logic
  const totalEpisodesInSeason = currentSeason?.episodes?.length || 0;
  const totalSeasons = tvShow?.number_of_seasons || 0;
  const prevSeasonEpisodeCount = prevSeason?.episodes?.length || 0;

  const hasPrevEpisode = currentEpisodeNum > 1 || currentSeasonNum > 1;
  const hasNextEpisode = currentEpisodeNum < totalEpisodesInSeason || currentSeasonNum < totalSeasons;

  const handlePrevEpisode = () => {
    if (currentEpisodeNum > 1) {
      // Previous episode in same season
      navigate(`/title/tv/${tvShowId}/season/${currentSeasonNum}/episode/${currentEpisodeNum - 1}`);
    } else if (currentSeasonNum > 1) {
      // Last episode of previous season
      const lastEpisodeOfPrevSeason = prevSeasonEpisodeCount || 1;
      navigate(`/title/tv/${tvShowId}/season/${currentSeasonNum - 1}/episode/${lastEpisodeOfPrevSeason}`);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeNum < totalEpisodesInSeason) {
      // Next episode in same season
      navigate(`/title/tv/${tvShowId}/season/${currentSeasonNum}/episode/${currentEpisodeNum + 1}`);
    } else if (currentSeasonNum < totalSeasons) {
      // First episode of next season
      navigate(`/title/tv/${tvShowId}/season/${currentSeasonNum + 1}/episode/1`);
    }
  };

  return (
    <div className="bannerContainer">
      <div
        style={{
          backgroundSize: 'cover',
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${episode?.still_path}")`,
          backgroundPosition: 'center center'
        }}
        className="bannerContainerInner d-flex justify-content-center"
      >
        <div className="tvEpisodeBannerInfo container mx-auto">
          <Link to={`/title/tv/${tvShow.id}`}>
            <i className="bi bi-chevron-left"></i>
            <span className="ms-2">{tvShow.name || tvShow.original_name}</span>
          </Link>
          <div className="fs-5 fw-light mt-3 d-flex align-items-center gap-3" style={{ marginBottom: '-10px' }}>
            {hasPrevEpisode && (
              <button 
                onClick={handlePrevEpisode}
                className="btn btn-link text-white p-0 border-0 d-flex align-items-center"
                style={{ textDecoration: 'none', fontSize: '1.5rem' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            )}
            <span>Season {episode?.season_number}, Episode {episode?.episode_number}</span>
            {hasNextEpisode && (
              <button 
                onClick={handleNextEpisode}
                className="btn btn-link text-white p-0 border-0 d-flex align-items-center"
                style={{ textDecoration: 'none', fontSize: '1.5rem' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            )}
          </div>
          <div className="fs-1 fw-bold mb-2 d-flex justify-content-between">
            <span>{episode?.name}</span>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="me-1 mb-2">
                  <i className="bi bi-star-fill fs-3 text-warning"></i>
                </span>
                <span>
                  <span>{Math.round((episode?.vote_average + Number.EPSILON) * 100) / 100}</span>
                  <span className="ms-2 text-secondary fs-3">/10</span>
                </span>
              </div>

              <div className="fs-4 text-secondary text-center" style={{ margin: "-12px" }}>{Number(episode?.vote_count).toLocaleString()}</div>
            </div>
          </div>
          <div className=" fw-light mb-2">
            {episode?.air_date && moment(episode.air_date).isValid() && moment(episode.air_date).isSameOrBefore(moment()) 
              ? `Episode aired ${moment(episode.air_date).format('MMMM Do, YYYY')}`
              : 'Episode not aired yet'
            }
          </div>
          <div className="fs-5 fw-light mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }} ref={overviewRef}></div>
        </div>
      </div>
      <div className="fade-effect-less-harsh" />

    </div>
  );
};

export default TVEpisodeBanner;

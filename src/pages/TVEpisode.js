import React, { useEffect } from 'react';
import {
  useParams,
  useNavigate
} from "react-router-dom";
import TopNavbar from '../components/TopNavbar';
import TVEpisodeBanner from '../components/TVEpisodeBanner';
import { Spinner } from 'react-bootstrap';
import { useGetTVShowEpisodeQuery, useGetTVShowSeasonsQuery } from '../services/tvApi';
import { useGetMediaDetailsQuery } from '../services/mediaApi';

/**
 * @description - 
 * @returns {React.FC}
 */
const TVEpisode = () => {

  const { id, seasonNum, episodeNum } = useParams();
  const navigate = useNavigate();
  
  // RTK Query hooks
  const { data: tvShow, isLoading: tvShowLoading } = useGetMediaDetailsQuery({ mediaType: 'tv', id });
  
  // Fetch current season data first to check if episode exists
  const { data: currentSeason, isLoading: seasonLoading } = useGetTVShowSeasonsQuery({
    tvId: id,
    seasonNumber: seasonNum
  });

  // Check if the requested episode exists in the season
  const episodeExists = currentSeason?.episodes?.some(
    ep => ep.episode_number === parseInt(episodeNum)
  );

  // Only fetch episode data if the episode exists
  const { data: episode, isLoading: episodeLoading } = useGetTVShowEpisodeQuery({
    tvId: id,
    seasonNumber: seasonNum,
    episodeNumber: episodeNum
  }, {
    skip: !episodeExists || seasonLoading
  });
  
  const loading = episodeLoading || tvShowLoading || seasonLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Smart episode redirect: if the requested episode doesn't exist, redirect to the first episode of the season
  useEffect(() => {
    if (currentSeason && !seasonLoading && currentSeason.episodes) {
      const currentEpisodeExists = currentSeason.episodes.some(
        ep => ep.episode_number === parseInt(episodeNum)
      );
      
      if (!currentEpisodeExists) {
        // Find the first episode in the season
        const firstEpisode = currentSeason.episodes[0];
        if (firstEpisode && firstEpisode.episode_number !== parseInt(episodeNum)) {
          // Redirect to the actual first episode
          navigate(`/title/tv/${id}/season/${seasonNum}/episode/${firstEpisode.episode_number}`, { replace: true });
        }
      }
    }
  }, [currentSeason, seasonLoading, episodeNum, id, seasonNum, navigate]);


  return (
    loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
      <div>
        <TopNavbar />
        <TVEpisodeBanner 
          tvShow={tvShow} 
          episode={episode} 
          currentSeason={currentSeason}
          tvShowId={id}
          currentSeasonNum={parseInt(seasonNum)}
          currentEpisodeNum={parseInt(episodeNum)}
        />
      </div>
    )
  );
};

export default TVEpisode;

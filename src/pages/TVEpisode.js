import React, { useEffect } from 'react';
import {
  useParams
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
  
  // RTK Query hooks
  const { data: episode, isLoading: episodeLoading } = useGetTVShowEpisodeQuery({
    tvId: id,
    seasonNumber: seasonNum,
    episodeNumber: episodeNum
  });
  
  const { data: tvShow, isLoading: tvShowLoading } = useGetMediaDetailsQuery({ mediaType: 'tv', id });
  
  // Fetch current season data to know total episodes for navigation
  const { data: currentSeason, isLoading: seasonLoading } = useGetTVShowSeasonsQuery({
    tvId: id,
    seasonNumber: seasonNum
  });
  
  const loading = episodeLoading || tvShowLoading || seasonLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


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

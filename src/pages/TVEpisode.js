import React, { useEffect } from 'react';
import {
  useParams
} from "react-router-dom";
import TopNavbar from '../components/TopNavbar';
import TVEpisodeBanner from '../components/TVEpisodeBanner';
import { Spinner } from 'react-bootstrap';
import { useGetTVShowEpisodeQuery } from '../services/tvApi';
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
  
  
  const loading = episodeLoading || tvShowLoading;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  return (
    loading ? <div className="spinnerContainer"><Spinner animation="border" variant="danger" /></div> : (
      <div>
        <TopNavbar />
        <TVEpisodeBanner tvShow={tvShow} episode={episode} />
      </div>
    )
  );
};

export default TVEpisode;

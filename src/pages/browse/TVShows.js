import React from 'react';
import BrowsePage from '../../components/BrowsePage';
import { TV_GENRES } from '../../utils/genres';
import { useGetDiscoverTVQuery, useGetFilteredTVShowsQuery } from '../../services/tvApi';

const TVShows = () => {
  const discoverTVQuery = useGetDiscoverTVQuery();
  
  return (
    <BrowsePage 
      title="TV Shows"
      genres={TV_GENRES}
      bannerQuery={discoverTVQuery}
      useContentQuery={useGetFilteredTVShowsQuery}
    />
  );
};

export default TVShows;

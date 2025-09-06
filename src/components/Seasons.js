import React, { useEffect, useRef } from 'react';
import { Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useGetTVShowSeasonsQuery } from '../services/tvApi';
import CustomPagination from './CustomPagination';

/**
 * @description - Seasons component that displays season selector and current season data
 * @returns {React.FC}
 */
const Seasons = ({ tvShowID, tvShowDetails }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Get selected season from URL query params, default to 1
  const selectedSeason = parseInt(searchParams.get('season')) || 1;
  const seasonDropdownRef = useRef(null);

  if (!tvShowDetails?.number_of_seasons) {
    return null;
  }

  const seasonNumbers = Array.from({ length: tvShowDetails.number_of_seasons }, (_, i) => i + 1);

  const handleSeasonChange = (seasonNum) => {
    if (seasonNum === 1) {
      // Remove season param for season 1 (default)
      setSearchParams({});
    } else {
      setSearchParams({ season: seasonNum.toString() });
    }
  };

  return (
    <div>
      <Dropdown className="fs-6">
        <Dropdown.Toggle ref={seasonDropdownRef} variant="transparent text-white d-flex align-items-center gap-1 border-0 fs-3 fw-bold" id="dropdown-basic" className="p-0 ">
          Season {selectedSeason}
        </Dropdown.Toggle>

        <Dropdown.Menu variant="dark" align="end">
          {seasonNumbers.map((seasonNum) => (
            <Dropdown.Item key={seasonNum} onClick={() => handleSeasonChange(seasonNum)}>
              Season {seasonNum}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Season tvShowID={tvShowID} seasonNumber={selectedSeason} seasonDropdownRef={seasonDropdownRef} />
    </div>
  );
};

// Season component that fetches individual season data
const Season = ({ tvShowID, seasonNumber, seasonDropdownRef }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const isInitialRender = useRef(true);
  
  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', newPage.toString());
    }
    setSearchParams(newSearchParams);
  };
  
  const { data: season, isLoading, error } = useGetTVShowSeasonsQuery({
    tvId: tvShowID,
    seasonNumber: seasonNumber
  });
  
  const episodesPerPage = 13;

  useEffect(() => {
    // Reset page to 1 when show ID changes (but not on initial render)
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('page');
      return newParams;
    });
  }, [tvShowID, setSearchParams]);

  useEffect(() => {
    // Scroll to season dropdown when page changes
    if (seasonDropdownRef.current) {
      const rect = seasonDropdownRef.current.getBoundingClientRect();
      const offsetPosition = window.pageYOffset + rect.top - 70;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [currentPage, seasonDropdownRef]);

  if (isLoading) {
    return <div className="text-center py-4"><Spinner animation="border" variant="danger" /></div>;
  }

  if (error || !season) {
    return <div className="text-center py-4 text-danger">Error loading season data</div>;
  }

  const episodes = season.episodes || [];
  const totalEpisodes = episodes.length;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
  
  // Calculate which episodes to show on current page
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

  return (
    <div>
      <div className="season-overview">
        {season.overview && <div>{season.overview}</div>}
      </div>
      <div>
        {currentEpisodes.map((episode) => {
          return (
            <div key={episode.id || episode.episode_number} className="py-2 p-md-3 d-flex justify-content-between align-items-center gap-4 border-bottom border-secondary tvSmallEpisode" onClick={() => navigate(`/title/tv/${tvShowID}/season/${seasonNumber}/episode/${episode.episode_number}`)}>
              <div className="d-flex align-items-center gap-4">
                <h3>{episode.episode_number}</h3>
                <img src={`https://image.tmdb.org/t/p/original${episode?.still_path}`} alt={''} className="moviePoster" />

                <div>
                  <h4 className="fw-bold">{episode.name}</h4>
                  <div>{episode.overview}</div>
                </div>
              </div>

              {episode?.vote_count > 0 ? (
                <div className="d-none d-lg-flex align-items-center gap-2">
                  <div>
                    <i className="bi bi-star-fill fs-3 text-warning"></i>
                  </div>
                  <div className="">
                    <div className="text-center fs-3">
                      <span>{Math.round((episode?.vote_average + Number.EPSILON) * 100) / 100}</span>
                      <span className="text-secondary">/10</span>
                    </div>

                    <div className="fs-6 text-secondary text-center">{Number(episode?.vote_count).toLocaleString()}</div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {totalEpisodes > 13 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalEpisodes}
          onPageChange={handlePageChange}
          resultsPerPage={episodesPerPage}
        />
      )}
    </div>
  );
};

export default Seasons;

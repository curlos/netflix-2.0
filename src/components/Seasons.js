import React from 'react';
import { Dropdown, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useGetTVShowSeasonsQuery } from '../services/tvApi';

/**
 * @description - Seasons component that displays season selector and current season data
 * @returns {React.FC}
 */
const Seasons = ({ tvShowID, tvShowDetails }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Get selected season from URL query params, default to 1
  const selectedSeason = parseInt(searchParams.get('season')) || 1;

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
        <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0 fs-3 fw-bold" id="dropdown-basic" className="p-0 ">
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

      <Season tvShowID={tvShowID} seasonNumber={selectedSeason} />
    </div>
  );
};

// Season component that fetches individual season data
const Season = ({ tvShowID, seasonNumber }) => {
  const navigate = useNavigate();
  const { data: season, isLoading, error } = useGetTVShowSeasonsQuery({
    tvId: tvShowID,
    seasonNumber: seasonNumber
  });

  if (isLoading) {
    return <div className="text-center py-4"><Spinner animation="border" variant="danger" /></div>;
  }

  if (error || !season) {
    return <div className="text-center py-4 text-danger">Error loading season data</div>;
  }

  return (
    <div>
      {season.overview && <div>{season.overview}</div>}
      <div>
        {season.episodes?.map((episode) => {
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
    </div>
  );
};

export default Seasons;

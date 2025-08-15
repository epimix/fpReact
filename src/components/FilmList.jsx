import { useState, useEffect } from "react";
import { Button, Popconfirm, Space, Table, Input, message, Typography, Card, Tag, Avatar, Badge, Tooltip } from 'antd';
import { getPopularFilms, searchFilms, getLocalFilms, deleteFilm } from '../services/film.servise';
import { useMessage } from '../hooks/useMessage';
import { useFavorites } from '../hooks/useFavorites';
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, HeartFilled, StarFilled, HeartOutlined } from '@ant-design/icons';
import './FilmList.css';

const { Title, Paragraph } = Typography;
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w200';

const isValidPosterUrl = (posterPath) => {
  return posterPath &&
    posterPath !== 'null' &&
    posterPath !== '' &&
    posterPath !== undefined &&
    !posterPath.includes('undefined');
};

const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

const FilmList = () => {
  const navigate = useNavigate();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { contextHolder, showSuccess, showError } = useMessage();
  const {
    toggleFavorite,
    isFavorite,
    addMultipleFavorites,
    removeMultipleFavorites,
    isInitialized
  } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const tmdb = await getPopularFilms();
      const local = getLocalFilms();
      const tmdbFilms = (tmdb?.results || []).map(item => {
        const posterUrl = isValidPosterUrl(item.poster_path) ? TMDB_IMAGE + item.poster_path : '';
        if (!isValidPosterUrl(item.poster_path)) {
          console.log(`Invalid poster path for ${item.title}:`, item.poster_path);
        }
        return {
          id: item.id,
          poster: posterUrl,
          title: item.title,
          year: item.release_date ? item.release_date.slice(0, 4) : '',
          type: 'TMDB',
          isLocal: false,
          rating: item.vote_average,
          posterValid: false,
        };
      });
      const localFilms = (local || []).map(item => ({
        ...item,
        poster: item.poster || '',
        year: item.year || '',
        type: 'Local',
        isLocal: true,
        rating: item.rating || 0,
      }));
      setFilms([...localFilms, ...tmdbFilms]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const validatePosters = async () => {
      const updatedFilms = await Promise.all(
        films.map(async (film) => {
          if (film.poster && !film.isLocal) {
            const isValid = await preloadImage(film.poster);
            if (!isValid) {
              console.log(`Failed to load poster for ${film.title}:`, film.poster);
            }
            return { ...film, posterValid: isValid };
          }
          return film;
        })
      );
      setFilms(updatedFilms);
    };

    if (films.length > 0) {
      validatePosters();
    }
  }, [films.length]);

  const handleSearch = async (value) => {
    if (!value) {
      const tmdb = await getPopularFilms();
      const local = getLocalFilms();
      const tmdbFilms = (tmdb?.results || []).map(item => ({
        id: item.id,
        poster: isValidPosterUrl(item.poster_path) ? TMDB_IMAGE + item.poster_path : '',
        title: item.title,
        year: item.release_date ? item.release_date.slice(0, 4) : '',
        type: 'TMDB',
        isLocal: false,
        rating: item.vote_average,
      }));
      const localFilms = (local || []).map(item => ({
        ...item,
        poster: item.poster || '',
        year: item.year || '',
        type: 'Local',
        isLocal: true,
        rating: item.rating || 0,
      }));
      setFilms([...localFilms, ...tmdbFilms]);
      return;
    }
    setLoading(true);
    const tmdb = await searchFilms(value);
    const local = getLocalFilms().filter(f => f.title.toLowerCase().includes(value.toLowerCase()));
    const tmdbFilms = (tmdb?.results || []).map(item => {
      const posterUrl = isValidPosterUrl(item.poster_path) ? TMDB_IMAGE + item.poster_path : '';
      if (!isValidPosterUrl(item.poster_path)) {
        console.log(`Invalid poster path for ${item.title}:`, item.poster_path);
      }
      return {
        id: item.id,
        poster: posterUrl,
        title: item.title,
        year: item.release_date ? item.release_date.slice(0, 4) : '',
        type: 'TMDB',
        isLocal: false,
        rating: item.vote_average,
      };
    });
    const localFilms = (local || []).map(item => ({
      ...item,
      poster: item.poster || '',
      year: item.year || '',
      type: 'Local',
      isLocal: true,
      rating: item.rating || 0,
    }));
    setFilms([...localFilms, ...tmdbFilms]);
    setLoading(false);
  };

  const onFilmDelete = (id, isLocal) => {
    if (isLocal) {
      deleteFilm(id);
    }
    setFilms(films.filter(film => film.id !== id));
    message.success('Film deleted successfully!');
  };

  const handleLikeToggle = (filmId) => {
    if (!isInitialized) return;

    const film = films.find(f => f.id === filmId);
    const wasLiked = isFavorite(filmId);
    toggleFavorite(filmId);

    if (film) {
      if (!wasLiked) {
        showSuccess(`${film.title} added to favorites!`);
      } else {
        showSuccess(`${film.title} removed from favorites!`);
      }
    }
  };

  const handleBulkLike = () => {
    if (selectedRowKeys.length === 0) {
      showError('Please select films to add to favorites');
      return;
    }

    addMultipleFavorites(selectedRowKeys);
    showSuccess(`${selectedRowKeys.length} films added to favorites!`);
    setSelectedRowKeys([]);
  };

  const handleBulkUnlike = () => {
    if (selectedRowKeys.length === 0) {
      showError('Please select films to remove from favorites');
      return;
    }

    removeMultipleFavorites(selectedRowKeys);
    showSuccess(`${selectedRowKeys.length} films removed from favorites!`);
    setSelectedRowKeys([]);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: !isInitialized,
    }),
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      width: 120,
      render: (text, record) => (
        <div className="film-poster-cell">
          {text && record.posterValid !== false ? (
            <img
              src={text}
              alt={record.title}
              className="film-poster"
              onError={(e) => {
                console.log(`Failed to load poster for ${record.title}:`, text);
                const updatedFilms = films.map(f =>
                  f.id === record.id ? { ...f, posterValid: false } : f
                );
                setFilms(updatedFilms);
              }}
              onLoad={() => {
                console.log(`Successfully loaded poster for ${record.title}:`, text);
              }}
            />
          ) : null}
          <div
            className="film-poster-placeholder"
            style={{
              display: (text && record.posterValid !== false) ? 'none' : 'flex',
              width: '100px',
              height: '100px'
            }}
          >
            {record.title ? record.title.charAt(0).toUpperCase() : '?'}
          </div>
          {record.isLocal && (
            <Tag color="green" className="local-tag">
              Local
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div
          className="film-title-cell"
          onClick={() => navigate(`/film/${record.id}`)}
        >
          <div className="film-title-text">
            {text}
          </div>
          {record.rating && (
            <div className="film-rating-display">
              <StarFilled style={{ color: '#f39c12', fontSize: '12px' }} />
              {record.rating.toFixed(1)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 80,
      render: text => (
        <Tag color="blue" style={{ fontWeight: 600 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: text => (
        <Tag color={text === 'Local' ? 'green' : 'purple'} style={{ fontWeight: 600 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={isFavorite(record.id) ? "Remove from favorites" : "Add to favorites"}>
            <Button
              className={`like-button ${isFavorite(record.id) ? 'liked' : ''}`}
              onClick={() => handleLikeToggle(record.id)}
              icon={isFavorite(record.id) ? <HeartFilled /> : <HeartOutlined />}
              size="small"
              type={isFavorite(record.id) ? 'primary' : 'default'}
              disabled={!isInitialized}
            >
              {isFavorite(record.id) ? 'Liked' : 'Like'}
            </Button>
          </Tooltip>

          <Link to={record.isLocal ? `/edit/${record.id}` : `/edit-tmdb/${record.id}`}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
            >
              Edit
            </Button>
          </Link>

          <Popconfirm
            title="Delete film"
            description={`Are you sure you want to delete "${record.title}"?`}
            onConfirm={() => onFilmDelete(record.id, record.isLocal)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="film-list-container">
      {contextHolder}

      <div className="film-list-header">
        <div className="header-content">
          <div>
            <Title level={2} className="header-title">
              🎬 Film Collection
            </Title>
            <Paragraph className="header-subtitle">
              Manage your film collection and discover new movies
            </Paragraph>
          </div>

          <Link to="/create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="add-film-button"
            >
              Add New Film
            </Button>
          </Link>
        </div>
      </div>

      <div className="search-section">
        <Input.Search
          placeholder="Search films by title..."
          allowClear
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          }
          onSearch={handleSearch}
          className="search-input"
          size="large"
        />

        <div className="stats-display">
          <Badge count={films.length} size="small">
            <Avatar
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600
              }}
            >
              {films.length}
            </Avatar>
          </Badge>
          <span className="stats-label">
            Total Films
          </span>
        </div>
      </div>

      {selectedRowKeys.length > 0 && (
        <div className="bulk-actions">
          <span className="bulk-selection-count">
            {selectedRowKeys.length} film(s) selected
          </span>
          <Button
            type="primary"
            icon={<HeartFilled />}
            onClick={handleBulkLike}
            size="small"
          >
            Add to Favorites
          </Button>
          <Button
            icon={<HeartOutlined />}
            onClick={handleBulkUnlike}
            size="small"
          >
            Remove from Favorites
          </Button>
          <Button
            size="small"
            onClick={() => setSelectedRowKeys([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <Card className="film-table-card">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={films}
          loading={loading}
          rowKey={i => i.id}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} films`,
            pageSizeOptions: ['10', '20', '50'],
            defaultPageSize: 10
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default FilmList;

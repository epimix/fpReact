import React from 'react';
import { Button, Popconfirm, Space, Table, Input, message } from 'antd';
import { getPopularFilms, searchFilms, getLocalFilms, deleteFilm } from '../services/film.servise';
import { useMessage } from '../hooks/useMessage';
import { Link } from 'react-router-dom';

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w200';

const FilmList = () => {
  const [films, setFilms] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { contextHolder, showSuccess, showError } = useMessage();

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const tmdb = await getPopularFilms();
      const local = getLocalFilms();
      const tmdbFilms = (tmdb?.results || []).map(item => ({
        id: item.id,
        poster: item.poster_path ? TMDB_IMAGE + item.poster_path : '',
        title: item.title,
        year: item.release_date ? item.release_date.slice(0, 4) : '',
        type: 'TMDB',
        isLocal: false,
      }));
      const localFilms = (local || []).map(item => ({
        ...item,
        poster: item.poster || '',
        year: item.year || '',
        type: 'Local',
        isLocal: true,
      }));
      setFilms([...localFilms, ...tmdbFilms]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = async (value) => {
    if (!value) {
      const tmdb = await getPopularFilms();
      const local = getLocalFilms();
      const tmdbFilms = (tmdb?.results || []).map(item => ({
        id: item.id,
        poster: item.poster_path ? TMDB_IMAGE + item.poster_path : '',
        title: item.title,
        year: item.release_date ? item.release_date.slice(0, 4) : '',
        type: 'TMDB',
        isLocal: false,
      }));
      const localFilms = (local || []).map(item => ({
        ...item,
        poster: item.poster || '',
        year: item.year || '',
        type: 'Local',
        isLocal: true,
      }));
      setFilms([...localFilms, ...tmdbFilms]);
      return;
    }
    setLoading(true);
    const tmdb = await searchFilms(value);
    const local = getLocalFilms().filter(f => f.title.toLowerCase().includes(value.toLowerCase()));
    const tmdbFilms = (tmdb?.results || []).map(item => ({
      id: item.id,
      poster: item.poster_path ? TMDB_IMAGE + item.poster_path : '',
      title: item.title,
      year: item.release_date ? item.release_date.slice(0, 4) : '',
      type: 'TMDB',
      isLocal: false,
    }));
    const localFilms = (local || []).map(item => ({
      ...item,
      poster: item.poster || '',
      year: item.year || '',
      type: 'Local',
      isLocal: true,
    }));
    setFilms([...localFilms, ...tmdbFilms]);
    setLoading(false);
  };

  const onFilmDelete = (id, isLocal) => {
    if (isLocal) {
      deleteFilm(id);
    }
    setFilms(films.filter(film => film.id !== id));
    message.success('Film deleted!');
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (text, record) => (
        text ? <img src={text} alt={record.title} style={{ width: 50, height: 75, objectFit: 'cover' }} /> : <span>No image</span>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={record.isLocal ? `/edit/${record.id}` : `/edit-tmdb/${record.id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Popconfirm
            title="Delete film"
            description={`Are you sure you want to delete ${record.title}?`}
            onConfirm={() => onFilmDelete(record.id, record.isLocal)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <h2>Film List</h2>
      <Input.Search
        placeholder="Enter film title"
        allowClear
        enterButton="Search"
        onSearch={handleSearch}
        style={{ width: 304, marginBottom: 16 }}
      />
      <Link to="/create">
        <Button type="primary" style={{ marginBottom: '12px' }}>Add Film</Button>
      </Link>
      <Table columns={columns} dataSource={films} loading={loading} rowKey={i => i.id} />
    </>
  );
};

export default FilmList;

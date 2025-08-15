import React from 'react';
import { Breadcrumb, Layout as LayoutAntd, Menu, theme, Badge, Avatar } from 'antd';
import {
    DatabaseFilled,
    HomeFilled,
    PlusOutlined,
    CalendarOutlined,
    HeartFilled,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import HeaderSessionInfo from './HeaderSessionInfo';
import './Layout.css';

const { Header, Content, Footer } = LayoutAntd;

const items = [
    {
        key: '/',
        label: <Link to="/">Home</Link>,
        icon: <HomeFilled />
    },
    {
        key: '/films',
        label: <Link to="/films">Films</Link>,
        icon: <DatabaseFilled />,
    },
    {
        key: '/favorites',
        label: <Link to="/favorites">Favorites</Link>,
        icon: <HeartFilled />,
    },
    {
        key: '/favoritesessions',
        label: <Link to="/favoritesessions">Favorite Sessions</Link>,
        icon: <CalendarOutlined />,
    },

    {
        key: '/create',
        label: <Link to="/create">Add Film</Link>,
        icon: <PlusOutlined />,
    },
    {
        key: '/createsession',
        label: <Link to="/createsession">Create Session</Link>,
        icon: <CalendarOutlined />,
    },
];

const Layout = () => {
    const { getFavoritesCount } = useFavorites();
    const location = useLocation();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <LayoutAntd className='Layout'>
            <Header className="layout-header">
                <div className='logo'>
                    <h2>🎬 Film Gallery</h2>
                </div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={items}
                    className="header-menu"
                />
                <div className="header-actions">
                    <HeaderSessionInfo />
                    <Link to="/favorites" className="favorites-link">
                        <Badge count={getFavoritesCount()} size="small">
                            <Avatar
                                icon={<HeartFilled />}
                                className="favorites-avatar"
                            />
                        </Badge>
                        <span className="favorites-text">
                            Favorites
                        </span>
                    </Link>
                </div>
            </Header>

            <Content className="layout-content">
                <Breadcrumb className="breadcrumb">
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Film Gallery</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="content-container">
                    <Outlet />
                </div>
            </Content>

            <Footer className="layout-footer">
                <div className="footer-content">
                    <span>🎬 Film Gallery ©{new Date().getFullYear()}</span>
                    <span>•</span>
                    <span>Built with React & Ant Design</span>
                </div>
            </Footer>
        </LayoutAntd>
    );
};

export default Layout;
import React from 'react';
import { Button, Typography, Card } from 'antd';
import { HomeOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function NoPage() {
    return (
        <div className="fade-in-up" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            textAlign: 'center'
        }}>
            <Card style={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    marginBottom: '32px',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        margin: '0 auto 24px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                    }}>
                        🎬
                    </div>

                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '200px',
                        height: '4px',
                        background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                        borderRadius: '2px',
                        animation: 'pulse 2s infinite'
                    }} />
                </div>

                <Title level={1} style={{
                    color: '#2c3e50',
                    marginBottom: '16px',
                    fontSize: '4rem',
                    fontWeight: 800,
                    letterSpacing: '-2px'
                }}>
                    404
                </Title>

                <Title level={2} style={{
                    color: '#2c3e50',
                    marginBottom: '16px',
                    fontWeight: 700
                }}>
                    Page Not Found
                </Title>

                <Paragraph style={{
                    fontSize: '18px',
                    color: '#5a6c7d',
                    marginBottom: '32px',
                    lineHeight: 1.6
                }}>
                    Oops! The page you're looking for seems to have wandered off into the digital wilderness.
                    Don't worry, we'll help you find your way back to the film gallery.
                </Paragraph>

                <div style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/">
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            style={{
                                height: '48px',
                                padding: '0 24px',
                                fontWeight: 600,
                                borderRadius: '12px'
                            }}
                        >
                            Go Home
                        </Button>
                    </Link>

                    <Link to="/films">
                        <Button
                            size="large"
                            icon={<SearchOutlined />}
                            style={{
                                height: '48px',
                                padding: '0 24px',
                                fontWeight: 600,
                                borderRadius: '12px'
                            }}
                        >
                            Browse Films
                        </Button>
                    </Link>

                    <Button
                        size="large"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => window.history.back()}
                        style={{
                            height: '48px',
                            padding: '0 24px',
                            fontWeight: 600,
                            borderRadius: '12px'
                        }}
                    >
                        Go Back
                    </Button>
                </div>

                <div style={{
                    marginTop: '32px',
                    padding: '24px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <Title level={4} style={{
                        margin: '0 0 16px 0',
                        color: '#2c3e50',
                        fontWeight: 600
                    }}>
                        🎯 Quick Navigation
                    </Title>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '24px',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/" style={{ color: '#667eea', textDecoration: 'none' }}>
                            Home
                        </Link>
                        <Link to="/films" style={{ color: '#667eea', textDecoration: 'none' }}>
                            Films
                        </Link>
                        <Link to="/create" style={{ color: '#667eea', textDecoration: 'none' }}>
                            Add Film
                        </Link>
                        <Link to="/createsession" style={{ color: '#667eea', textDecoration: 'none' }}>
                            Create Session
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}

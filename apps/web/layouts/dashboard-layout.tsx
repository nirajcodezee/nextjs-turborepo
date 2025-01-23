"use client";
import { Container, AppBar, Typography, Box, Toolbar, Button } from '@mui/material';
import Link from 'next/link';

const pages = [
    { name: 'User', path: '/userform' },
];

function NavBar() {
    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#333', boxShadow: 3 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    {/* Desktop Navigation Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    textTransform: "capitalize",
                                    "&:hover": {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '4px',
                                    },
                                    padding: '8px 16px',
                                    marginLeft: '16px',
                                }}
                            >
                                <Link href={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {page.name}
                                </Link>
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
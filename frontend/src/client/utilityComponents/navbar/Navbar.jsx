import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Toolbar } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const pages = [
  { link: '/', component: 'Home' },
  { link: '/login', component: 'Login' },
  { link: '/register', component: 'Register' },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (link = null) => {
    setAnchorElNav(null);
    if (link) {
      navigate(link);
    }
  };


  return (
    <AppBar position="static" sx={{ backgroundColor: '#086a78' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
             fontFamily:'Courier New',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            School Management System
          </Typography>

          {/* Desktop Menu (Aligned to the Right) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
            {pages.map((page, i) => (
              <Button
                key={i}
                onClick={() => handleCloseNavMenu(page.link)}
                sx={{
                  my: 2,
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                {page.component}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
            >
              {pages.map((page, i) => (
                <MenuItem key={i} onClick={() => handleCloseNavMenu(page.link)}>
                  <Typography textAlign="center">{page.component}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              textAlign: 'center',
            }}
            onClick={() => navigate('/')}
          >
            SMS
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

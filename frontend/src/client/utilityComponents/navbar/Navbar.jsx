import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Toolbar } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import DraggableButton from '../../../basicUtiliyComponents/draggable/DraggableButton';



function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const { user, authenticated } = React.useContext(AuthContext);
  const [pages, setPages] = React.useState([
    { link: '/', component: 'Home' },
    { link: '/login', component: 'Login' },
    { link: '/register', component: 'Register' },
  ])


  React.useEffect(() => {
    if (authenticated) {
      setPages([
        { link: '/', component: 'Home' },
        { link: '/logout', component: 'Logout' },
        { link: `${user.role}`.toLocaleLowerCase(), component: 'Dashboard' },
      ])
    } else {
      setPages([
        { link: '/', component: 'Home' },
        { link: '/login', component: 'Login' },
        { link: '/register', component: 'Register' },
      ])
    }
  }, [authenticated])

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
    <AppBar position="static" sx={{ backgroundColor: '#0A192F' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Animated Logo */}
          <motion.img
            src="https://uxwing.com/wp-content/themes/uxwing/download/education-school/graduation-cap-icon.png"
            alt="School Logo"
            style={{ height: '50px', padding: '4px', marginRight: '2px' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }} // Subtle rotation animation
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            whileHover={{ scale: 1.1, boxShadow: '0px 0px 10px rgba(244, 162, 97, 0.8)' }}
          />

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#F4A261',
              textDecoration: 'none',
              cursor: 'pointer',
              letterSpacing: '1px',
              wordSpacing: '2px'
            }}
            onClick={() => navigate('/')}
          >
            School Breeze
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
            {pages.map((page, i) => (
              <Button
                key={i}
                onClick={() => handleCloseNavMenu(page.link)}
                sx={{
                  my: 2,
                  color: '#E0E1DD',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '16px',
                  letterSpacing: '0.5px',
                  transition: '0.3s ease-in-out',
                  ':hover': { color: '#F4A261' },
                }}
              >
                {page.component}
              </Button>
            ))}
            { user && <DraggableButton />}

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
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElNav)}
              onClose={() => handleCloseNavMenu()}
            >
              {pages.map((page, i) => (
                <MenuItem key={i} onClick={() => handleCloseNavMenu(page.link)}>
                  <Typography
                    textAlign="center"
                    sx={{ fontFamily: "'Playfair Display', serif", color: '#0A192F' }}
                  >
                    {page.component}
                  </Typography>
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
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#F4A261',
              textDecoration: 'none',
              textAlign: 'center',
              letterSpacing: '1px'
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

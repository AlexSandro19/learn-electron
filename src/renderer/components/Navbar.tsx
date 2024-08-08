import { Link, useMatch, useResolvedPath } from "react-router-dom"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

export default function Navbar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Website
      </Typography>
      <Divider />
      <nav className="nav">
        <List>
          {/* {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))} */}
          {/* <Link to="/" className="site-title">
            <ListItem key={"Home"} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={"Home"} />
              </ListItemButton>
            </ListItem>
          </Link> */}
          <Link to="/signin" className="site-title">
            <ListItem key={"Sign In"} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={"Sign In"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/signup" className="site-title">
            <ListItem key={"Sign Up"} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={"Sign Up"} />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/test" className="site-title">
            <ListItem key={"Test"} disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={"Test"} />
              </ListItemButton>
            </ListItem>
          </Link>
          {/* <Link to="/signin">
            SignIn
          </Link>
          <Link to="/signup">
            SignUp
          </Link> */}

        </List>
      </nav>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Website
          </Typography>
          {/* <Link to="/">
              <Button key={"Home"} sx={{ color: '#fff', flexGrow: 1, display: { xs: 'none', sm: 'block' }  }}>
                Website
              </Button>
            </Link> */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {/* {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))} */}
            <Link to="/signin">
              <Button key={"Sign In"} sx={{ color: '#fff' }}>
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
            <Button key={"Sign Up"} sx={{ color: '#fff' }}>
                Sign Up 
              </Button>
            </Link>
            <Link to="/test">
            <Button key={"Test"} sx={{ color: '#fff' }}>
                Test
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
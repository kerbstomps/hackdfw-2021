import * as React from "react"
import PropTypes from "prop-types"

import { StaticImage } from "gatsby-plugin-image"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const Header = ({ siteTitle }) => (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <div style={{padding: "10px"}}>
          <StaticImage src="../images/logo-no-circle.png" 
            alt="Picture the World" 
            transformOptions={{ fit: "inside"}}
            width={64}
            height={64}
            placeholder="blurred"
          />
        </div>
        <h1>{siteTitle}</h1>
      </Toolbar>
    </AppBar>
  </Box>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

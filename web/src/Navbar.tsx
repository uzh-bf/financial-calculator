import React from 'react'
import { Box } from 'grommet'

interface Props {
  children: React.ReactNode
}

function Navbar({ children }: Props): React.ReactElement {
  return (
    <Box
      tag="header"
      direction="row"
      align="center"
      background="brand"
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      style={{ zIndex: 1 }}
    >
      {children}
    </Box>
  )
}

export default Navbar

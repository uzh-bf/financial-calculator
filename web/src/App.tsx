import 'katex/dist/katex.min.css'

import React, { useState } from 'react'
import { Box, Button, Grommet, ResponsiveContext } from 'grommet'

import useFetch from 'use-http'

import Navbar from './Navbar'
import BlackScholesWithDividend from './pages/BlackScholesWithDividend'
import BarrierReverseConvertible from './pages/BarrierReverseConvertible'
import THEME from './theme'

function App(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState('brc')
  const [request, response] = useFetch(
    // 'https://financial-calculator.ibf-devops.ch',
    'http://localhost:8000',
  )

  return (
    <Grommet full theme={THEME}>
      <ResponsiveContext.Consumer>
        {size => (
          <Box fill>
            <Navbar>
              <Button
                color="white"
                margin={{ right: '1rem' }}
                onClick={() => setCurrentPage('bs')}
              >
                Black Scholes
              </Button>
              <Button color="white" onClick={() => setCurrentPage('brc')}>
                Barrier Reverse Convertible
              </Button>
            </Navbar>

            {currentPage === 'bs' && (
              <BlackScholesWithDividend request={request} response={response} />
            )}

            {currentPage === 'brc' && (
              <BarrierReverseConvertible
                request={request}
                response={response}
              />
            )}
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  )
}

export default App

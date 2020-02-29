import React, { useState } from 'react'
import {
  Form,
  FormField,
  Box,
  Button,
  Grommet,
  ResponsiveContext,
  Header,
} from 'grommet'
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts'
import useFetch from 'use-http'

import Navbar from './Navbar'
import THEME from './theme'

function App(): React.ReactElement {
  const [data, setData] = useState([] as any)
  const [request, response] = useFetch(
    'https://financial-calculator.ibf-devops.ch',
  )

  async function calculateResult(e: any) {
    await request.post('/black_scholes', e.value)
    if (response.ok) {
      console.log(response.data)
      setData(response.data)
    }
  }

  return (
    <Grommet full theme={THEME}>
      <ResponsiveContext.Consumer>
        {size => (
          <Box fill>
            <Navbar>
              <Button color="white" margin={{ right: '1rem' }}>
                Black Scholes
              </Button>
              <Button color="white">XYZ</Button>
            </Navbar>

            <Box pad="small">
              <Header as="h1">The Black-Scholes Formula</Header>
            </Box>

            <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
              <Box flex basis="1/4" pad="small">
                <Form onSubmit={calculateResult}>
                  <FormField name="underlying" label="Price of Underlying" />
                  <FormField name="strike" label="Strike Price" />
                  <FormField name="maturity" label="Time to Maturity" />
                  <FormField name="volatility" label="Volatility" />
                  <FormField name="interest" label="Interest Rate" />
                  <FormField name="dividend" label="Dividend Yield" />
                  <Button type="submit" primary label="Submit" />
                </Form>
              </Box>

              <Box flex basis="3/4" pad="small">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    width={730}
                    height={250}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="underlying" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="call" stroke="#8884d8" />
                    <Line type="monotone" dataKey="put" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  )
}

export default App

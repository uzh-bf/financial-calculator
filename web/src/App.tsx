import React from 'react'
import {
  Form,
  FormField,
  Box,
  Button,
  Grommet,
  ResponsiveContext,
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

import Navbar from './Navbar'
import THEME from './theme'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

function App(): React.ReactElement {
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
            <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
              <Box flex basis="1/4" pad="small">
                <Form onSubmit={(e: any) => console.log(e.value)}>
                  <FormField name="underlying" label="Price of Underlying" />
                  <FormField name="strike" label="Strike Price" />
                  <FormField name="maturity" label="Time to Maturity" />
                  <FormField name="volatilty" label="Volatility" />
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
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
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

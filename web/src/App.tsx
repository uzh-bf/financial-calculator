import 'katex/dist/katex.min.css'

import React, { useState } from 'react'
import {
  Form,
  FormField,
  Box,
  Button,
  Grommet,
  ResponsiveContext,
  Collapsible,
  List,
  Anchor,
} from 'grommet'
import { DocumentExcel, Github } from 'grommet-icons'
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import useFetch from 'use-http'
import { InlineMath, BlockMath } from 'react-katex'
import { number } from 'yup'

import Navbar from './Navbar'
import THEME from './theme'

function CustomTooltip({ label, payload }: any) {
  const underlying = { name: 'St', value: label }
  return (
    payload && (
      <List
        border
        background="white"
        primaryKey="name"
        secondaryKey="value"
        data={[underlying, ...payload]}
        pad="small"
      />
    )
  )
}

function BlackScholes({
  underlying,
  strike,
  maturity,
  volatility,
  interest,
  dividend,
  d1,
  d2,
  call,
  put,
}: any): React.ReactElement {
  const d1Format = d1 || 'd_1'
  const d2Format = d2 || 'd_2'
  const d1Result = d1 ? `${d1} =` : ''
  const d2Result = d2 ? `${d2} =` : ''
  const callResult = call ? `${call} =` : ''
  const putResult = put ? `${put} =` : ''
  const St = underlying || 'S_t'
  const K = strike || 'K'
  const sigma = volatility || '\\sigma'
  const t = maturity || 'T - t'
  const r = interest || 'r'
  const q = dividend != null ? dividend : 'q'
  return (
    <>
      <BlockMath
        math={`d_1= ${d1Result} \\frac{1}{\\textcolor{orange}{${sigma}} \\sqrt{\\textcolor{blue}{${t}}}} \\left[\\ln{\\left(\\frac{\\textcolor{red}{${St}}}{\\textcolor{green}{${K}}}\\right)} + \\left(\\textcolor{grey}{${r}} - \\textcolor{aqua}{${q}} + \\frac{\\textcolor{orange}{${sigma}}^2}{2} \\right) (\\textcolor{blue}{${t}}) \\right]`}
      />
      <BlockMath
        math={`d_2= ${d2Result} \\frac{1}{\\textcolor{orange}{${sigma}} \\sqrt{\\textcolor{blue}{${t}}}} \\left[\\ln{\\left(\\frac{\\textcolor{red}{${St}}}{\\textcolor{green}{${K}}}\\right)} + \\left(\\textcolor{grey}{${r}} - \\textcolor{aqua}{${q}} - \\frac{\\textcolor{orange}{${sigma}}^2}{2} \\right) (\\textcolor{blue}{${t}}) \\right]`}
      />
      <BlockMath
        math={`C(S_t,t)= ${callResult} \\textcolor{red}{${St}} \\Phi(${d1Format}) - \\textcolor{green}{${K}}e^{-\\textcolor{grey}{${r}}(\\textcolor{blue}{${t}})}\\Phi(${d2Format})`}
      />
      <BlockMath
        math={`P(S_t,t)= ${putResult} \\textcolor{green}{${K}}e^{-\\textcolor{grey}{${r}}(\\textcolor{blue}{${t}})}\\Phi(-${d2Format}) - \\textcolor{red}{${St}}\\Phi(-${d1Format})`}
      />
    </>
  )
}

function App(): React.ReactElement {
  const [series, setSeries] = useState([] as any)
  const [result, setResult] = useState()
  const [request, response] = useFetch(
    'https://financial-calculator.ibf-devops.ch',
  )

  async function calculateResult(e: any) {
    await request.post('/black_scholes', e.value)
    if (response.ok) {
      setSeries(response.data.series)
      setResult(response.data.specific)
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

            <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
              <Box flex basis="1/4" pad="small">
                <Form onSubmit={calculateResult} validate="submit">
                  <FormField
                    name="underlying"
                    label={
                      <InlineMath math="\text{Price of Underlying } (\textcolor{red}{S_t})" />
                    }
                    validate={(value, _) => {
                      if (
                        !number()
                          .positive()
                          .isValidSync(value)
                      ) {
                        return 'Provide a positive numerical value for "Price of Underlying"'
                      }
                    }}
                  />
                  <FormField
                    name="strike"
                    label={
                      <InlineMath math="\text{Strike Price } (\textcolor{green}{K})" />
                    }
                    validate={(value, _) => {
                      if (
                        !number()
                          .positive()
                          .isValidSync(value)
                      ) {
                        return 'Provide a positive numerical value for "Strike Price"'
                      }
                    }}
                  />
                  <FormField
                    name="maturity"
                    label={
                      <InlineMath math="\text{Time to Maturity } (\textcolor{blue}{T - t})" />
                    }
                    validate={(value, _) => {
                      if (
                        !number()
                          .positive()
                          .isValidSync(value)
                      ) {
                        return 'Provide a positive numerical value for "Time to Maturity"'
                      }
                    }}
                  />
                  <FormField
                    name="volatility"
                    label={
                      <InlineMath math="\text{Volatility } (\textcolor{orange}{\sigma})" />
                    }
                    validate={(value, _) => {
                      if (
                        !number()
                          .min(0)
                          .max(1)
                          .isValidSync(value)
                      ) {
                        return 'Provide a numerical value within [0, 1] for "Volatility"'
                      }
                    }}
                  />
                  <FormField
                    name="interest"
                    label={
                      <InlineMath math="\text{Interest Rate } (\textcolor{grey}{r})" />
                    }
                    validate={(value, _) => {
                      if (
                        !number()
                          .min(0)
                          .max(1)
                          .isValidSync(value)
                      ) {
                        return 'Provide a numerical value within [0, 1] for "Interest Rate"'
                      }
                    }}
                  />
                  <FormField
                    name="dividend"
                    label={
                      <InlineMath math="\text{Dividend Yield } (\textcolor{aqua}{q})" />
                    }
                    validate={(value, _) => {
                      if (
                        !number()
                          .min(0)
                          .max(1)
                          .isValidSync(value)
                      ) {
                        return 'Provide a numerical value within [0, 1] for "Dividend Yield"'
                      }
                    }}
                  />
                  <Box direction="row">
                    <Box
                      direction="column"
                      basis="100%"
                      margin={{ top: '1rem' }}
                    >
                      <Box direction="row" margin={{ bottom: '1rem' }}>
                        <DocumentExcel />
                        <Anchor
                          href="#"
                          label="Excel Calculator"
                          margin={{ left: '0.5rem' }}
                        />
                      </Box>
                      <Box direction="row">
                        <Github />
                        <Anchor
                          target="_blank"
                          href="https://github.com/rschlaefli/financial-calculator/blob/master/calc/black_scholes.py"
                          label="Python Code"
                          margin={{ left: '0.5rem' }}
                        />
                      </Box>
                    </Box>
                    <Box
                      direction="column"
                      basis="150px"
                      margin={{ top: '1rem' }}
                    >
                      <Button type="submit" primary label="Submit" />
                    </Box>
                  </Box>
                </Form>
              </Box>

              <Box flex basis="3/4">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={series}
                    margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="underlying" />
                    <YAxis />
                    <Legend />
                    {result && (
                      <ReferenceLine x={result.underlying} stroke="red" />
                    )}
                    <Line
                      type="monotone"
                      dataKey="call"
                      stroke="#8884d8"
                      name="C"
                    />
                    <Line
                      type="monotone"
                      dataKey="put"
                      stroke="#82ca9d"
                      name="P"
                    />
                    <Tooltip content={CustomTooltip} />
                  </LineChart>
                </ResponsiveContainer>

                <Box direction="row">
                  <Box flex basis="1/2" pad="small" alignContent="center">
                    <Collapsible open>
                      <BlackScholes />
                    </Collapsible>
                  </Box>

                  <Box flex basis="1/2" pad="small" alignContent="center">
                    {result && [<BlackScholes {...result} />]}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  )
}

export default App

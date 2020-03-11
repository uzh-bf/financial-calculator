import React, { useState } from 'react'
import {
  Form,
  FormField,
  Box,
  Button,
  Anchor,
  Collapsible,
  List,
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
import { InlineMath } from 'react-katex'
import { number } from 'yup'

import BlackScholes from '../components/BlackScholes'

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

interface Props {
  request: any
  response: any
}

function BlackScholesWithDividend({ request, response }: Props) {
  const [series, setSeries] = useState([] as any)
  const [result, setResult] = useState({} as { underlying: number })

  async function calculateResult(e: any) {
    await request.post('/black_scholes', e.value)
    if (response.ok) {
      setSeries(response.data.series)
      setResult(response.data.specific)
    }
  }

  return (
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
            <Box direction="column" basis="100%" margin={{ top: '1rem' }}>
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
            <Box direction="column" basis="150px" margin={{ top: '1rem' }}>
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
            {result && <ReferenceLine x={result.underlying} stroke="red" />}
            <Line type="monotone" dataKey="call" stroke="#8884d8" name="C" />
            <Line type="monotone" dataKey="put" stroke="#82ca9d" name="P" />
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
  )
}

export default BlackScholesWithDividend

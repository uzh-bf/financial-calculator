import React, { useState } from 'react'

import { Form, FormField, Box, Button, Anchor, List, Header } from 'grommet'
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

interface Props {
  request: any
  response: any
}

function CustomTooltip({ label, payload }: any) {
  const underlying = { name: 't', value: label }
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

function BarrierReverseConvertible({ request, response }: Props) {
  const [series, setSeries] = useState([] as any)

  async function calculateResult(e: any) {
    await request.post('/barrier_reverse_convertible', e.value)
    if (response.ok) {
      setSeries(response.data)
    }
  }

  return (
    <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
      <Box flex basis="1/4" pad="small">
        <Form onSubmit={calculateResult} validate="submit">
          <FormField
            defaultValue={1}
            name="maturity"
            label={<InlineMath math="\text{Time to Maturity } (T - t)" />}
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
            defaultValue={0.15}
            name="volatility"
            label={<InlineMath math="\text{Volatility } (\sigma)" />}
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
            defaultValue={0.01}
            name="interest"
            label={<InlineMath math="\text{Interest Rate } (r)" />}
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
            defaultValue={0}
            name="dividend"
            label={<InlineMath math="\text{Dividend Yield } (q)" />}
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
          <FormField
            defaultValue={18}
            name="barrier"
            label={<InlineMath math="\text{Barrier } (H)" />}
            validate={(value, _) => {
              if (
                !number()
                  .positive()
                  .isValidSync(value)
              ) {
                return 'Provide a positive numerical value for "Barrier"'
              }
            }}
          />
          <FormField
            defaultValue={1000}
            name="nominal"
            label={<InlineMath math="\text{Nominal Value } (nom)" />}
            validate={(value, _) => {
              if (
                !number()
                  .positive()
                  .isValidSync(value)
              ) {
                return 'Provide a positive numerical value for "Nominal Value"'
              }
            }}
          />
          <FormField
            defaultValue={0.0045}
            name="cds"
            label={<InlineMath math="\text{Credit Default Swap } (cds)" />}
            validate={(value, _) => {
              if (
                !number()
                  .positive()
                  .isValidSync(value)
              ) {
                return 'Provide a positive numerical value for "Credit Default Swap"'
              }
            }}
          />
          <FormField
            defaultValue={0.0665}
            name="c"
            label={<InlineMath math="\text{Coupon } (c)" />}
            validate={(value, _) => {
              if (
                !number()
                  .min(0)
                  .max(1)
                  .isValidSync(value)
              ) {
                return 'Provide a numerical value within [0, 1] for "Coupon"'
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
        {['up', 'sideways', 'down'].map(scenario => (
          <>
            <Header as="h2">{scenario}</Header>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                // syncId="charts"
                data={series[scenario] ? series[scenario].series : []}
                margin={{ top: 15, right: 15, left: 15, bottom: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" allowDecimals={false} />
                <YAxis
                  allowDecimals={false}
                  type="number"
                  domain={[
                    (dataMin: number) => Math.abs(0.85 * dataMin),
                    (dataMax: number) => Math.abs(1.15 * dataMax),
                  ]}
                />
                <Legend />

                <Line
                  dot={false}
                  type="monotone"
                  dataKey="underlying"
                  stroke="#8884d8"
                  name="Underlying"
                />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="convertible"
                  stroke="#82ca9d"
                  name="Convertible"
                />
                {/* <Line
                  dot={false}
                  type="monotone"
                  dataKey="put"
                  stroke="grey"
                  name="Put"
                /> */}
                {series[scenario] && (
                  <ReferenceLine y={series[scenario].barrier} stroke="red" />
                )}
                <Tooltip content={CustomTooltip} />
              </LineChart>
            </ResponsiveContainer>
          </>
        ))}
      </Box>
    </Box>
  )
}

export default BarrierReverseConvertible

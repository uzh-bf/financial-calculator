import React from 'react'
import { BlockMath } from 'react-katex'

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

export default BlackScholes

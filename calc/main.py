import numpy as np
import scipy.stats as si

from pydantic import BaseModel
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# add a CORS middleware to allow local cross-port requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://financial-calculator.now.sh", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BlackScholesInput(BaseModel):
    strike: float
    underlying: float
    maturity: float
    volatility: float
    interest: float
    dividend: float


def black_scholes_call_div(S, K, T, r, q, sigma):
    # see https://aaronschlegel.me/black-scholes-formula-python.html

    # S: spot price
    # K: strike price
    # T: time to maturity
    # r: interest rate
    # q: rate of continuous dividend paying asset
    # sigma: volatility of underlying asset

    d1 = (np.log(S / K) + (r - q + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = (np.log(S / K) + (r - q - 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))

    call = S * np.exp(-q * T) * si.norm.cdf(d1, 0.0, 1.0) - K * np.exp(
        -r * T
    ) * si.norm.cdf(d2, 0.0, 1.0)
    put = K * np.exp(-r * T) * si.norm.cdf(-d2, 0.0, 1.0) - S * np.exp(
        -q * T
    ) * si.norm.cdf(-d1, 0.0, 1.0)

    return np.round(put, 2), np.round(call, 2), np.round(d1, 2), np.round(d2, 2)


@app.post("/black_scholes")
def calc_black_scholes(input: BlackScholesInput):
    result = dict()

    series = list()
    for i in range(1, int(input.strike * 2)):
        put_price, call_price, d1, d2 = black_scholes_call_div(
            i,
            input.strike,
            input.maturity,
            input.interest,
            input.dividend,
            input.volatility,
        )
        series.append(
            {"d1": d1, "d2": d2, "call": call_price, "put": put_price, "underlying": i}
        )
    result["series"] = series

    specific_result = black_scholes_call_div(
        input.underlying,
        input.strike,
        input.maturity,
        input.interest,
        input.dividend,
        input.volatility,
    )
    result["specific"] = {
        "call": specific_result[0],
        "put": specific_result[1],
        "d1": specific_result[2],
        "d2": specific_result[3],
        **input.dict(),
    }

    return result

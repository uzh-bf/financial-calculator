import numpy as np
import scipy.stats as si

from pydantic import BaseModel
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# add a CORS middleware to allow local cross-port requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    return put, call, d1, d2


@app.post("/black_scholes")
def calc_black_scholes(input: BlackScholesInput):
    result = list()
    for i in range(max(int(input.strike) - 50, 0), int(input.strike + 50)):
        put_price, call_price, d1, d2 = black_scholes_call_div(
            i,
            input.strike,
            input.maturity,
            input.interest,
            input.dividend,
            input.volatility,
        )
        result.append(
            {"d1": d1, "d2": d2, "call": call_price, "put": put_price, "underlying": i}
        )
    return result

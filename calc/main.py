import pandas as pd
import numpy as np

from pydantic import BaseModel
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

import black_scholes

app = FastAPI()

# add a CORS middleware to allow local cross-port requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://financial-calculator.now.sh"],
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


@app.post("/black_scholes")
def calc_black_scholes(input: BlackScholesInput):
    # apply black scholes with the same inputs across a range of strike prices (derived +- from the input strike price)
    # this will allow for plotting with strike on the x-axis and price on the y-axis
    series = list()
    for i in range(1, int(input.strike * 2)):
        put_price, call_price, d1, d2 = black_scholes.compute_black_scholes(
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

    # additionally compute black scholes for the strike price that was specified by the user
    # this result will be used to highlight where the user input is located on the result curve
    call, put, d1, d2 = black_scholes.compute_black_scholes(
        input.underlying,
        input.strike,
        input.maturity,
        input.interest,
        input.dividend,
        input.volatility,
    )

    # combine the result series and specific result into a single output dictionary
    return {
        "series": series,
        "specific": {
            "call": call,
            "put": put,
            "d1": d1,
            "d2": d2,
            **input.dict(),
        }
    }


class BarrierReverseConvertibleInput(BaseModel):
    maturity: float
    volatility: float
    interest: float
    dividend: float
    barrier: float
    nominal: float
    cds: float
    c: float


@app.post("/barrier_reverse_convertible")
def calc_barrier_reverse_convertible(input: BarrierReverseConvertibleInput):
    # read example scenario time series from CSV
    underlying_down = pd.read_csv("data/down.csv", header=None, names=["spot"])["spot"]
    underlying_side = pd.read_csv("data/sideways.csv", header=None, names=["spot"])[
        "spot"
    ]
    underlying_up = pd.read_csv("data/up.csv", header=None, names=["spot"])["spot"]

    # calculate the barrier reverse convertible for all values on the time-series
    # returns three result lists that can be plotted against each other (one for each scenario)
    return {
        "up": black_scholes.compute_barrier_reverse_convertible_series(
            underlying_up, input
        ),
        "sideways": black_scholes.compute_barrier_reverse_convertible_series(
            underlying_side, input
        ),
        "down": black_scholes.compute_barrier_reverse_convertible_series(
            underlying_down, input
        ),
    }

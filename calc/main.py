import black_scholes
import pandas as pd

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


@app.post("/black_scholes")
def calc_black_scholes(input: BlackScholesInput):
    result = dict()

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
    result["series"] = series

    specific_result = black_scholes.compute_black_scholes(
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
    # read time series from CSV
    underlying = pd.read_csv("up.csv", header=None, names=["spot"])["spot"]

    # process the input time series
    result = list()
    for i, S in enumerate(underlying):
        lambda_res, gamma, x1, y1, put, bond, convertible = black_scholes.compute_barrier_reverse_convertible(
            S,
            underlying.iloc[0],
            input.maturity,
            input.interest,
            input.dividend,
            input.volatility,
            input.barrier,
            input.nominal,
            input.cds,
            input.c,
        )

        result.append({"t": i, "underlying": S, "convertible": convertible})

    return result

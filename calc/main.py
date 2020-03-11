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


@app.post("/reverse_convertible")
def calc_barrier_reverse_convertible():
    # TODO: implement input type and params
    # TODO: implement result structure
    result = dict()

    # TODO: read real time series from CSV
    series = pd.Series([1, 2, 3, 2, 1])
    print(black_scholes.compute_barrier_reverse_convertible(20, 20, 0.75, 0.01, 0, 0.15, 18, 1000, 0.0045))

    # TODO: hydrate result from computation output
    print("Transformation")
    #transformed_series = series.apply(lambda S: black_scholes.compute_barrier_reverse_convertible(, ))
    print("\nResult Series")


    return result

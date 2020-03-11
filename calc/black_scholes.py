import numpy as np
import scipy.stats as si


def compute_black_scholes(S, K, T, r, q, sigma):
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


def compute_barrier_reverse_convertible(X):
    print(f"TBD: you gave me {X}")

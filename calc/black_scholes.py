import numpy as np
import scipy.stats as si


def compute_black_scholes(S, K, T, r, q, sigma):
    """
    Compute black scholes for a single data point

    S -- spot price
    K -- strike price
    T -- time to maturity
    r -- interest rate
    q -- rate of continuous dividend paying asset
    sigma -- volatility of underlying asset

    See https://aaronschlegel.me/black-scholes-formula-python.html for a detailed explanation
    """

    d1 = (np.log(S / K) + (r - q + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = (np.log(S / K) + (r - q - 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))

    call = S * np.exp(-q * T) * si.norm.cdf(d1, 0.0, 1.0) - K * np.exp(
        -r * T
    ) * si.norm.cdf(d2, 0.0, 1.0)
    put = K * np.exp(-r * T) * si.norm.cdf(-d2, 0.0, 1.0) - S * np.exp(
        -q * T
    ) * si.norm.cdf(-d1, 0.0, 1.0)

    return np.round(put, 2), np.round(call, 2), np.round(d1, 2), np.round(d2, 2)


def compute_barrier_reverse_convertible(S, K, T, r, q, sigma, H, nom, cds, c, i):
    """
    Compute barrier reverse convertible for a single data point

    S -- spot price
    K -- strike price
    T -- time to maturity
    r -- interest rate
    q -- rate of continuous dividend paying asset
    sigma -- volatility of underlying asset
    H -- barrier
    nom -- nominal value
    cds -- credit default swap
    c -- coupon
    i -- current day in maturity period
    """

    # remaining days
    t = T - (i / 250)

    # 2. Schritt: Lambda und Gamma berechnen
    lambda_var = (r - q + (sigma ** 2) / 2) / sigma ** 2
    gamma = np.log(H ** 2 / (S * K)) / (
        sigma * np.sqrt(t)
    ) + lambda_var * sigma * np.sqrt(t)

    # 3. Schritt: x1 und y1 berechnen
    x1 = np.log(S / H) / (sigma * np.sqrt(t)) + (lambda_var * sigma * np.sqrt(t))
    y1 = np.log(H / S) / (sigma * np.sqrt(t)) + (lambda_var * sigma * np.sqrt(t))

    # 4. Schritt: Optionspreis berechnen

    # down_and_in_put = - S * si.norm.cdf(-x1) * np.exp(- q * T) + K * np.exp(- r * T) * si.norm.cdf(-x1 + sigma * np.sqrt(T)) + S * np.exp(- q * T) * (H / S) ** (2*lambda_var) * (si.norm.cdf(gamma) - si.norm.cdf(y1)) - K * np.exp(- r * T) * (H/S) ** (2 * lambda_var - 2) * (si.norm.cdf(gamma - sigma * np.sqrt(T)) -  si.norm.cdf(y1 - sigma * np.sqrt(T)))
    down_and_in_put = (
        -S * si.norm.cdf(-x1) * np.exp(-q * t)
        + K * np.exp(-r * t) * si.norm.cdf(-x1 + sigma * np.sqrt(t))
        + S
        * np.exp(-q * t)
        * (H / S) ** (2 * lambda_var)
        * (si.norm.cdf(gamma) - si.norm.cdf(y1))
        - K
        * np.exp(-r * t)
        * (H / S) ** (2 * lambda_var - 2)
        * (
            si.norm.cdf(gamma - sigma * np.sqrt(t))
            - si.norm.cdf(y1 - sigma * np.sqrt(t))
        )
    )

    # 6. Schritt: Fair Value Bond
    fair_value_bond = ((1 + c) * nom) * np.exp(-(r + cds) * t)

    # 6. Schritt: Berechnung Struki
    barrier_reverse_convertible = fair_value_bond - (down_and_in_put * (nom / K))

    # 7. Schritt: Normierung Struki
    norm_bar_rev_conv = (barrier_reverse_convertible / nom) * 100

    # 8. Schritt: Normierung Basiswert
    # TODO: use S0 here instead of K
    norm_spot_price = (S / K) * 100

    return (
        np.round(down_and_in_put, 2),
        np.round(c, 2),
        np.round(fair_value_bond, 2),
        np.round(norm_bar_rev_conv, 2),
        np.round(norm_spot_price, 2),
    )


def compute_barrier_reverse_convertible_series(underlying, input):
    """
    Compute barrier reverse convertible for an entire time-series

    underlying -- The input time series (variable)
    input -- The external input parameters / factors (fixed)

    TODO: make this generalizable
    """

    result = list()
    for i, S in enumerate(underlying):
        put, coupon, bond, norm_convertible, norm_spot = compute_barrier_reverse_convertible(
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
            i,
        )

        result.append(
            {
                "t": i,
                "underlying": norm_spot,
                # "lambda": lambda_res,
                # "gamma": gamma,
                # "x1": x1,
                # "y1": y1,
                "put": put,
                "bond": bond,
                "convertible": norm_convertible,
                "coupon": coupon,
            }
        )

    return {"barrier": input.barrier / underlying.iloc[0] * 100, "series": result}

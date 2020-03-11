import numpy as np
import scipy.stats as si
# from pricing_2d import pricing_2d
# from perm_matrix import perm_matrix ; from scipy . interpolate import interpn
# import timeit


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


def compute_barrier_reverse_convertible(S, K, T, r, q, sigma, H, Nom, cds, c):
    # X1: 
    # S: spot price
    # K: strike price
    # T: time to maturity
    # r: interest rate
    # q: rate of continuous dividend paying asset
    # sigma: volatility of underlying asset
    # H: Barrier
    # Nom: Nominal Value
    # cds: Credit-Default Swap
    # c: Coupon

    # 0. Schritt: Berechnung Zero-Bond
    price_zero_bond = Nom / ((1 + r + cds) ** T) 

     # 1. Plain Vanilla Call oder Put berechnen
    d1 = (np.log(S / K) + (r - q + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
    d2 = (np.log(S / K) + (r - q - 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))

    call = S * np.exp(-q * T) * si.norm.cdf(d1, 0.0, 1.0) - K * np.exp(-r * T) * si.norm.cdf(d2, 0.0, 1.0)
    put = K * np.exp(-r * T) * si.norm.cdf(-d2, 0.0, 1.0) - S * np.exp(-q * T) * si.norm.cdf(-d1, 0.0, 1.0)

    # 2. Schritt: Lambda und Gamma berechnen
    lambda_var = (r - q + (sigma ** 2)/2)/sigma ** 2 
    gamma = np.log(H ** 2 / (S * K)) / (sigma * np.sqrt(T)) + lambda_var * sigma * np.sqrt(T)

    # 3. Schritt: x1 und y1 berechnen
    x1 = np.log(S/H) / (sigma * np.sqrt(T)) + (lambda_var * sigma * np.sqrt(T))
    y1 = np.log(H/S) / (sigma * np.sqrt(T)) + (lambda_var * sigma * np.sqrt(T))

    # 4. Schritt: Optionspreis berechnen
    down_and_in_put = - S * si.norm.cdf(-x1) * np.exp(- q * T) + K * np.exp(- r * T) * si.norm.cdf(-x1 + sigma * np.sqrt(T)) + S * np.exp(- q * T) * (H / S) ** (2*lambda_var) * (si.norm.cdf(gamma) - si.norm.cdf(y1)) - K * np.exp(- r * T) * (H/S) ** (2 * lambda_var - 2) * (si.norm.cdf(gamma - sigma * np.sqrt(T)) -  si.norm.cdf(y1 - sigma * np.sqrt(T)))
    
    # 5. Schritt: Geld für Coupons
    money_for_coupon = Nom - price_zero_bond + (Nom/K * down_and_in_put)
    coupon = (money_for_coupon * ((1 + r + cds) ** T)) / Nom

    # 6. Schritt: Fair Value Bond 
    trading_days = np.arange(1, T*250, 1).tolist()

    for i in trading_days:
        print(i)
    
    #fair_value_bond = ((1 + coupon) * Nom) / np.exp(-(r + cds) * (T - trading_days) / 250)
    
    # 6. Schritt: Berechnung Struki
    #barrier_reverse_convertible =  fair_value_bond - down_and_in_put * Nom/K

    # 7. Schritt: Normierung Struki
    #norm_bar_rev_conv = (barrier_reverse_convertible / barrier_reverse_convertible.shape[0]) * 100

    # 8. Schritt: Normierung Basiswert
    norm_spot_price = (S / S.shape[0]) * 100

    return np.round(lambda_var, 2), np.round(gamma, 2), np.round(x1, 2), np.round(y1, 2), np.round(down_and_in_put, 2) #, np.round(zero_bond, 2), np.round(barrier_reverse_convertible, 2), np.round(norm_bar_rev_conv, 2), np.round(norm_spot_price, 2)

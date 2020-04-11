# financial-calculator

## Preparations

- Install all dependencies (e.g., Pandas) using `pip install -r requirements.txt`

## Development

If a visualization should explain the outcomes of a single computation (e.g., for simple black-scholes):

- Define an input class for the functionality (i.e., what parameters/inputs will be coming from the frontend)
- Create a method that takes in all parameters needed to compute a solution (can be a combination of user inputs and other parameters)

Additionally, if the visualization should display the change of a computation across an entire exemplary time-series (e.g., the change of a price based on a changing underlying):

- Optional: Place any example data files in `data/` (a simple CSV with one column works best, but it is also possible to add multi-column data files) and import the data using `pd.read_csv`
- Create functionality that applies the "single-datapoint computation" across the entire series, combining the series with fixed inputs (e.g., varying strike price but otherwise fixed black-scholes parameters)
- Return the resulting series as a result. The frontend can then take all values of the result series and display them on (potentially) different axes.

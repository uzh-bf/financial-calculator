FROM python:3.8

COPY . ./

# TODO: this will fail until we add poetry export in CI
RUN set -x && pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]

EXPOSE 8000

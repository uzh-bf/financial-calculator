FROM python:3.8

COPY . ./

RUN set -x && pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]

EXPOSE 8000

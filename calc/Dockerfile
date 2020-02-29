FROM python:3.8

COPY main.py requirements.txt ./

RUN set -x && pip install -r requirements.txt

CMD ["uvicorn", "main:app"]

EXPOSE 8080

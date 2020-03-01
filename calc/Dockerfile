FROM python:3.8

COPY main.py requirements.txt ./

RUN set -x && pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]

EXPOSE 8000

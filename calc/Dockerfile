FROM python:3.8-alpine

COPY main.py requirements.txt ./

RUN set -x \
  && apk add build-base \
  && pip install -r requirements.txt \
  && apk del build-base

CMD ["uvicorn", "main:app"]

EXPOSE 8080

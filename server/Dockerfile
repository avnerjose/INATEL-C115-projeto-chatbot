FROM python:3.8-alpine
WORKDIR /usr/src/chatbot

COPY ./requirements.txt /usr/src/chatbot/requirements.txt

RUN pip install --upgrade pip setuptools wheel \
&& pip install -r /usr/src/chatbot/requirements.txt \
&& rm -rf /root/.cache/pip

COPY . /usr/src/chatbot

CMD ["python", "main.py"]

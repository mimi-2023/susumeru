FROM python:3.9-buster
ENV PYTHONUNBUFFERED=1

WORKDIR /backend

# 言語・地域情報
RUN apt-get update &&\
    apt-get -y install locales &&\
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TZ JST-9
ENV TERM xterm

RUN curl -sSL https://install.python-poetry.org | python -
ENV PATH /root/.local/bin:$PATH

# 依存関係のみをインストール（ルートパッケージを除く）
COPY ./backend/pyproject.toml* ./backend/poetry.lock* ./
RUN poetry install --no-root

# ソースコードをコピー
# 本番環境ではコピーして固定化する？
# COPY . .

# # uvicornのサーバーを立ち上げる
# ENTRYPOINT ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]
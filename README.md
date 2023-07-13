# Salamander Web

Playground for several proof-of-concepts for interacting with nats server through a static web page.

## Examples

**Simpl Pub-Sub**

Currently works locally. Also tried to use [github pages](https://aricallen.github.io/salamander-web/) but
`wss://demo.nats.io:443` was timing out. Not sure if its a thing...

```sh
# clone repo locally
git clone git@github.com:aricallen/salamander-web.git

# install deps and start local static file server
cd salameder-web
yarn
yarn start

# bring up docker container for nats
docker-compose up
```

Open up two tabs and navigate to:
* http://localhost:1234/pub-sub/subscribe.html
* http://localhost:1234/pub-sub/publish.html

The defaults should be setup to work with local docker container
Hit subscribe in the subscribe page, then publish messages to the same _subject_

## TODO

More to come...
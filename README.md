# Salamander Web

Playground for several proof-of-concepts for interacting with nats server through a static web page.

## Examples

**Simple Pub-Sub**

Example: [github pages](https://aricallen.github.io/salamander-web/)but
`wss://demo.nats.io:8443` will be set as the default nats url.

Or follow the instructions below to run locally.

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
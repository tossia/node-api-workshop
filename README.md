# Node API (Workshop)

> This repo is a material for my courses I teach around Node.js.
> Only my students are allowed to use it as part of their learning.

* https://github.com/ntalle-support/node-api-workshop

## Usage

Start the stack:

```sh
docker-compose up
```

Enter in the API container:

```sh
docker-compose exec api bash
```

Then, install packages (dependencies) :

```sh
yarn
```

Then, start the API server in `development` environment:

```sh
./bin/run-dev
```

or in `production` environment:

```sh
yarn start
```

## Troubleshooting

Clean the volume container (on the host):

```sh
./bin/vc-clean
```

## Author

(c) 2020, Nicolas Tallefourtane

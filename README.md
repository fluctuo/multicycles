# Multicyles

[![Build Status](https://travis-ci.org/PierrickP/multicycles.svg?branch=master)](https://travis-ci.org/PierrickP/multicycles)

[Multicycles.org](http://multicycles.org) aggregates on one map, different "free-floating" bike rental services.

See [Open-API](https://developer.multicycles.org/) for the API endpoint.

## Supported Providers

|                                                                                                                                                        |                                                                                                                                               |                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/bird.svg?label=Bird)](https://www.npmjs.com/package/@multicycles/bird)                      | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/jump.svg?label=Jump)](https://www.npmjs.com/package/@multicycles/jump)             | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/pony.svg?label=Pony)](https://www.npmjs.com/package/@multicycles/pony)                   |
| [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/byke.svg?label=Byke)](https://www.npmjs.com/package/@multicycles/byke)                      | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/lime.svg?label=Lime)](https://www.npmjs.com/package/@multicycles/lime)             | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/spin.svg?label=Spin)](https://www.npmjs.com/package/@multicycles/spin)                   |
| [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/coup.svg?label=Coup)](https://www.npmjs.com/package/@multicycles/coup)                      | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/mobike.svg?label=Mobike)](https://www.npmjs.com/package/@multicycles/mobike)       | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/whitebikes.svg?label=WhiteBikes)](https://www.npmjs.com/package/@multicycles/whitebikes) |
| [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/donkey.svg?label=Donkey%20Republic)](https://www.npmjs.com/package/@multicycles/donkey)     | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/nextbike.svg?label=Nextbike)](https://www.npmjs.com/package/@multicycles/nextbike) | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/yobike.svg?label=Yobike)](https://www.npmjs.com/package/@multicycles/yobike)             |
| [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/gobee.bike.svg?label=Gobee.bike)](https://www.npmjs.com/package/@multicycles/gobee.bike)    | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/obike.svg?label=Obike)](https://www.npmjs.com/package/@multicycles/obike)          |                                                                                                                                                     |
| [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/indigowheel.svg?label=IndigoWheel)](https://www.npmjs.com/package/@multicycles/indigowheel) | [![npm (scoped)](https://img.shields.io/npm/v/@multicycles/ofo.svg?label=Ofo)](https://www.npmjs.com/package/@multicycles/ofo)                |                                                                                                                                                     |

Want to add one ? [https://en.wikipedia.org/wiki/List_of_bicycle-sharing_systems](https://en.wikipedia.org/wiki/List_of_bicycle-sharing_systems)
Or submit an [Issue](https://github.com/PierrickP/multicycles/issues/new)

## Contribute

### Setup

`git clone https://github.com/PierrickP/multicycles && cd multicycles`
run `npm i`

### Create a new provider

Run `npm run generate`

### Run services

Set `{api,developer}/.env` files
Use `npm run dev:SERVICE` with SERVICE as `api` / `front` / `developer`

## Contact

Email: contact@multicycles.org
Twitter: https://twitter.com/multicyclesOrg

## Sponsors

[![Realtime application protection](https://s3-eu-west-1.amazonaws.com/sqreen-assets/badges/20171107/sqreen-light-badge.svg)](https://www.sqreen.io/?utm_source=badge)
[![Sentry](https://developer.multicycles.org/sentry-logo-black.png)](https://sentry.io)

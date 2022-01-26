# app

### Environment Variables and IDL json

To run the project, first rename the `.env.example` file at the root directory to `.env` and update the following variables:

```
VUE_APP_GEM_FARM_PK
VUE_APP_GEM_BANK_PROG_ID
VUE_APP_GEM_FARM_PROG_ID
VUE_APP_MAINNET_URL
```

Make sure to replace `VUE_APP_GEM_FARM_PK` in `public/gem_farm.json` with your actual Gem Farm public key and likewise for `public/gem_bank.json`.


## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Run your end-to-end tests

```
yarn test:e2e
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

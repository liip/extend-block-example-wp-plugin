# Example how to extend an existing Gutenberg block in WordPress

## Developer information

### Installation

1. Clone this repository

1. Install Node dependencies

    ```
    $ npm install
    ```

### Code style

Run eslint with the following command:

```
$ npm run lint
```

### Compile assets

#### `npm start`
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

#### `npm run build`
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.

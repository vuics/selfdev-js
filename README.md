# selfdev-js

The selfdev-js is a command line tool for interacting with the [Self-developing](https://az1.ai) API.

You can read the [API.md](./API.md) document to learn more about the Self-developing API.

## Install

You can install the package from NPM globally:
```bash
# TODO: use az1 organization on npm
npm i -g @vuics/selfdev-js
```

Or install locally from the repo:
```bash
npm i
```

## Setup

TODO: use az1.ai domain
Create an API key on [Self-developing](https://selfdev.vuics.com/keys).
Create `.env` file with the following content:
```
SELFDEV_API_URL=https://api.selfdev.vuics.com/v1
SELFDEV_API_KEY=<GET_API_KEY_ON_SELFDEV>
```

## Run

To run:
```bash
selfdev
selfdev help
```

## Usage Examples

### Ask

Ask a question and get an answer.
```bash
selfdev ask --prompt='What is a self-developing AI?'
```
Example output:
```
TBS
```

## Use in Jupyter Notebook

It is possible to use the selfdev-js directly from your Jupyter Notebooks.
See the [notebook-example.ipynb](./notebook-example.ipynb) for more information.

![Screenshot of Jupyther Notebook Example](./notebook-screenshot.png)


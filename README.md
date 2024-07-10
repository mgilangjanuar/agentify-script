# agentception-script

This is an [Agentify](https://github.com/mgilangjanuar/agentify) dependency that allows you to run an isolated script in a node environment.

## Installation

```bash
pnpm install
```

## Environment Variables

```[.env]
PORT=4014
SECRET="xxx"
```

## Usage

```bash
pnpm run build && pnpm start
```

Then, save this service URL and secret to the Agentify variables `SCRIPT_URL` and `SCRIPT_SECRET`.

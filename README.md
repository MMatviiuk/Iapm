# IAPM

This is a code bundle for IAPM. The original project is available at https://www.figma.com/design/aSak9KiY6nHXqLygUmLvAc/IAPM.

## Running the code

### Windows (PowerShell)

1) Open PowerShell or Command Prompt.
2) Go to the project folder (use your real path):

```
cd D:\path\to\Iapm
```

Example:

```
cd D:\tempbuild\Iapm
```

3) Install dependencies (once):

```
npm i
```

4) Start the dev server:

```
npm run dev
```

5) Open the app in the browser:

```
http://localhost:3000
```

### Windows (Command Prompt)

1) Open Command Prompt.
2) Go to the project folder (use your real path):

```
cd /d D:\path\to\Iapm
```

Example:

```
cd /d D:\tempbuild\Iapm
```

3) Install dependencies (once):

```
npm i
```

4) Start the dev server:

```
npm run dev
```

5) Open the app in the browser:

```
http://localhost:3000
```

### macOS / Linux (Terminal)

1) Open Terminal.
2) Go to the project folder:

```
cd /path/to/Iapm
```

3) Install dependencies (once):

```
npm i
```

4) Start the dev server:

```
npm run dev
```

5) Open the app in the browser:

```
http://localhost:3000
```

## Troubleshooting (Windows Git)

### "fatal: 'origin' does not appear to be a git repository"
This means the remote is missing. Add it and pull again:

```
git remote add origin https://github.com/MMatviiuk/Iapm.git
git pull origin main
```

If the default branch is `master`, use:

```
git pull origin master
```

### "The following untracked working tree files would be overwritten by merge"
This happens when you copied a folder into `D:\tempbuild\Iapm` and then tried to pull.
You have two clean options:

Option A: fresh clone (recommended)

```
cd D:\tempbuild
git clone https://github.com/MMatviiuk/Iapm.git
cd D:\tempbuild\Iapm
```

Option B: keep the folder and reset it to match the remote (deletes local untracked files)

```
cd D:\tempbuild\Iapm
git fetch origin
git reset --hard origin/main
git clean -fd
```

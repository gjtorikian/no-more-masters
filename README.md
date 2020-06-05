# no-more-masters

Rename your default Git branch from master to production.

## Install

```
$ npm install -g no-more-masters
```

## Usage

```
$ no-more-masters
```


## What is this doing?

1. `git checkout -b production master`: Create a branch `production` from `master`
2. `git push origin production`: Push that `production` branch to your remote
3. Using [the GitHub API's Update a repository endpoint](https://developer.github.com/v3/repos/#update-a-repository), set `production` as the new default branch
4. `git branch -D master`: Removes `master` from your local machine
5. `git push origin :master`: Removes `master` from your remote repository

    Note: this step will fail if branch protections are enabled

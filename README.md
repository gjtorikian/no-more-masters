# no-more-masters

Rename your default Git branch from master to production.

This script requires that you have [a GitHub authorization token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line). As well, if you have branch protections enabled for `master`, consider turning them off so that the script can remove the branch from your remote repo.

## Install

```
$ npm install -g no-more-masters
```

## Usage

```
$ no-more-masters

OPTIONS
  -b, --branch=branch  [default: production] The branch name to create
  -h, --help           show CLI help
  -v, --version        show CLI version
```

## What is this doing?

1. `git checkout -b production master`: Create a branch `production` from `master`
2. `git push origin production`: Push that `production` branch to your remote
3. Using [the GitHub API's Update a repository endpoint](https://developer.github.com/v3/repos/#update-a-repository), set `production` as the new default branch
4. `git branch -D master`: Removes `master` from your local machine
5. `git push origin :master`: Removes `master` from your remote repository

    Note: this step will fail if branch protections are enabled

## Configuration

If you have `core.defaultBranch` set, the script will use that branch name as its default.

A GitHub API token can also be provided via the `GITHUB_TOKEN` environment variable.



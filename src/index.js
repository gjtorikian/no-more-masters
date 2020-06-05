const { Command, flags } = require("@oclif/command");
const { cli } = require("cli-ux");
const execa = require("execa");
const axios = require("axios");
const parseRepo = require("parse-repo");
const util = require("util");

class nomoremastersCommand extends Command {
  async run() {
    const { flags } = this.parse(nomoremastersCommand);

    let origin = "";
    try {
      const { stdout } = await execa("git", ["remote", "get-url", "origin"]);
      origin = stdout;
    } catch (error) {
      this.error(error);
      return;
    }

    const nwo = parseRepo(origin).repository;

    this
      .log(`This script will create a new branch off of master called production.

It will then set production as the default branch on GitHub, and then delete the master branch.

This will modify the ${nwo} repository.

These are DESTRUCTIVE actions!
  `);
    const choice = await cli.prompt("Do you understand [y/n]?");
    if (choice != "y") {
      this.log(
        `I expected you to say 'y' but you did not, so I won't do anything.`
      );
      return;
    }

    const token = await cli.prompt("What is your GitHub API token?", {
      type: "hide",
    });

    try {
      const { stdout } = await execa("git", [
        "checkout",
        "-b",
        "production",
        "master",
      ]);
    } catch (error) {
      this.error(error);
      return;
    }

    try {
      const { stdout } = await execa("git", ["push", "origin", "production"]);
    } catch (error) {
      this.error(error);
      return;
    }

    this.log("Created production and pushed it up...");

    try {
      const data = { default_branch: "production" };
      const options = {
        method: "PATCH",
        headers: { Authorization: `token ${token}` },
        data: data,
        url: `https://api.github.com/repos/${nwo}`,
      };

      await axios(options);
    } catch (e) {
      this.error(
        util.inspect(e.response.data, { showHidden: false, depth: null })
      );
      return;
    }

    this.log("Set GitHub branch to production ...");

    try {
      const { stdout } = await execa("git", ["branch", "-D", "master"]);
      console.log(stdout);
    } catch (error) {
      this.error(error);
      return;
    }

    try {
      const { stdout } = await execa("git", ["push", "origin", ":master"]);
    } catch (e) {
      this
        .log(`\n*** I could not delete the master branch on GitHub! Probably because it has branch protection...
Here's what they said:\n${e}\n\n`);
    }

    this.log(`All done! PS: GitHub, drop ICE 🤗`);
  }
}

nomoremastersCommand.description =
  "Use this script to rename your default Git branch from `master` to `production`";

nomoremastersCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: "v" }),
  // add --help flag to show CLI version
  help: flags.help({ char: "h" }),
};

module.exports = nomoremastersCommand;

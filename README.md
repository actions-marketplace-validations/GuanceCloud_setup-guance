# setup-guance

[![Continuous Integration](https://github.com/GuanceCloud/setup-guance/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/GuanceCloud/setup-guance/actions/workflows/continuous-integration.yml)
[![Setup Guance](https://github.com/GuanceCloud/setup-guance/actions/workflows/setup-cli.yml/badge.svg)](https://github.com/GuanceCloud/setup-guance/actions/workflows/setup-cli.yml)

The `GuanceCloud/setup-guance` action is a JavaScript action that sets up Guance CLI in your GitHub Actions workflow,

## Usage

This action can be run on `ubuntu-latest`, `windows-latest`, and `macos-latest` GitHub Actions runners. When running on `windows-latest` the shell should be set to Bash.

A specific version of Terraform CLI can be installed:

```yaml
steps:
- uses: GuanceCloud/setup-guance@v2
  with:
    version: 0.0.2
```

## Inputs

The action supports the following inputs:

- `version` - (optional) The version of Guance CLI to install.

## Related projects

This action is inspired by follow projects:

1. [hashicorp/setup-terraform](https://github.com/hashicorp/setup-terraform), The GitHub action of Hashicorp Terraform.
1. [actions/setup-go](https://github.com/actions/setup-go), The GitHub action of Golang.

## License

This project is licensed under the [MIT license](LICENSE).

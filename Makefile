.DEFAULT_GOAL := help
.PHONY: help install dev run build preview lint verify check clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start the dev server
	npm run dev

run: dev ## Alias for `dev`

build: ## Typecheck and build for production
	npm run build

preview: ## Serve the production build locally
	npm run preview

lint: ## Lint the codebase
	npm run lint

verify: ## Validate every assignment (tests pass vs solution, fail vs starter)
	npm run verify:content

check: lint build verify ## Run lint, build, and content verification

clean: ## Remove build output and verification scratch
	rm -rf dist .verify

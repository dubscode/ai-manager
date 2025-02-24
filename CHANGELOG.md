# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 1.0.0 (2025-02-24)


### Features

* **app:** add base routes for reports and settings. Add mockup for standup call page ([0d1ded7](https://github.com/dubscode/ai-manager/commit/0d1ded790ef68ee79cb44da4f836650744889bdc))
* **app:** add manager email to the user table, and setup form in settings allowing for it to be updated ([9eb1ed0](https://github.com/dubscode/ai-manager/commit/9eb1ed02dccc9269a2758923804c0887848c5f58))
* **app:** add mockup for standup summary page. Update hard coded colors to use css variables ([ed5b027](https://github.com/dubscode/ai-manager/commit/ed5b02717fe0d7bc25ec9f6f8fd4330bbe21b331))
* **app:** add sentiment trend chart to main dashboard page ([f3ed74b](https://github.com/dubscode/ai-manager/commit/f3ed74b78455c0051bdd7d9541ae71047cbb5ee0))
* **app:** automatically email manager if there are any manager follow up items from the standup ([20e0718](https://github.com/dubscode/ai-manager/commit/20e0718fabcbf73ce36a281c23ebc5893faee48f))
* **app:** create standup and conversation records whenever a standup calls starts/ends ([2399940](https://github.com/dubscode/ai-manager/commit/2399940a8cce4d1c6c4a2429078787c0a16efcd8))
* **app:** fetch recent standups and display summaries on the main dashboard landing page ([f789db3](https://github.com/dubscode/ai-manager/commit/f789db3a62c0def79c90f310805e3a14932b1a46))
* **app:** finish setting up the report/standup detail page ([8043e72](https://github.com/dubscode/ai-manager/commit/8043e72f9d9d773f882f0b46527b0a2836291344))
* **app:** Implement mockup for the main dashboard page ([c72588b](https://github.com/dubscode/ai-manager/commit/c72588b2334c34157c3ccaf8802ddb3c8fb67e85))
* **app:** integrate linear issue search into Eleven Labs AI agent ([d087968](https://github.com/dubscode/ai-manager/commit/d08796800a1e5a4f4b84ac22a8277601c690be30))
* **app:** setup flow to analyze conversation results, parse, and store in desired db structures ([afc328c](https://github.com/dubscode/ai-manager/commit/afc328cf498c9fec20ec2028e2dc2497e634b743))
* **app:** trigger a standup cal land converse with the standup manager agent ([89bcd28](https://github.com/dubscode/ai-manager/commit/89bcd2867039f1b9a410bb4d6d21e2e1ef2365fa))
* **app:** update settings form to accept a linear api key for the user ([0be266c](https://github.com/dubscode/ai-manager/commit/0be266c3c7ccbb225f795f3106395291619589c8))
* **app:** use inngest to update db conversation record after standup is completed ([86d6f05](https://github.com/dubscode/ai-manager/commit/86d6f05d850a9d83b0bc8fd99743bee898dee787))
* **auth:** integrate Clerk ([5633ee1](https://github.com/dubscode/ai-manager/commit/5633ee1dcb15e9d29a7d89b33b000a06d0987519))
* **config:** add vercel analytics and speed insights ([2b1c804](https://github.com/dubscode/ai-manager/commit/2b1c80472ba94a3d621ad50f6b182e8ee9b7ead7))
* **db:** add db table to store 11 labs conversations ([7c7d35c](https://github.com/dubscode/ai-manager/commit/7c7d35c91c5f02a408dd83697d0277e31e5ca967))
* **db:** add encrypted text column to users for storing linear api key ([0fbd250](https://github.com/dubscode/ai-manager/commit/0fbd2505b6479637c3c147e904beb491ad8f76b4))
* **db:** setup drizzle orm ([214ff11](https://github.com/dubscode/ai-manager/commit/214ff11273d79424a19fadcce46f06ca77cefb1d))

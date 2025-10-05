# AI Usage

- Tooling: `@google/generative-ai` SDK; model: `gemini-1.5-flash`
- Prompts: classification to constrained enum set; responses validated and coerced to known categories
- Methodology: backend-only AI call, frontend requests suggestion for title; avoids leaking API key to client
- Sample prompt excerpt:

```
You are a classifier. Map the given expense title and optional notes to one of these exact categories: FOOD, TRAVEL, UTILITIES, ENTERTAINMENT, OTHER. Respond with only the category.
Title: Coffee at Starbucks
Notes: breakfast meeting
```

- Failure handling: if response not in enum, fallback to OTHER

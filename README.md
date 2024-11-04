# 🎯 ArgClinic

An open-source platform for debate argument crafting, analysis, and collaboration.

The name, a reference to Monty Python's skit The Argument Clinic. The inspiration, a lifetime as a former debater now engineer, and a dad with a son now in debate:
https://muselab.com/bench-notes/foster-a-culture-of-debate-in-engineering-teams

## 🎓 Vision

ArgClinic aims to revolutionize how debaters construct, analyze, and share arguments across different debate formats. By leveraging modern web technologies and AI integration, we're building a collaborative platform where the debate community can:

-   📝 Craft structured arguments using the ARESR framework
-   🔄 Map arguments across different debate formats
-   🤝 Collaborate through GitHub's ecosystem
-   🤖 Enhance research with AI assistance
-   📊 Track argument effectiveness

### ARESR Framework Core Components

-   **Assertion** - The claim being made
-   **Reasoning** - The logical path from assertion to conclusion
-   **Evidence** - Supporting facts and data
-   **Significance** - Why the argument matters
-   **Result** - The ultimate impact or conclusion

### Format Mappings

| ARESR Component | Policy                   | LD                    | Public Forum             | MSPDP    |
| --------------- | ------------------------ | --------------------- | ------------------------ | -------- |
| Assertion       | Plan/Counter-Plan        | Value Claim           | Resolution               | Motion   |
| Reasoning       | Internal Links           | Value/Criterion Links | Warrants                 | Points   |
| Evidence        | Cards/Sources            | Philosophy/Studies    | Statistics/Expert Quotes | Examples |
| Significance    | Impacts                  | Value Impacts         | Voters                   | Stakes   |
| Result          | Advantages/Disadvantages | Value Outcome         | Cost-Benefit             | POI      |

### 🤖 AI Integration Plans

1. Argument analysis for logical fallacies
2. Evidence suggestion and fact-checking
3. Counter-argument generation
4. Format translation assistance
5. Research aggregation and summarization

## 🚀 Getting Started

### Using Codespaces or Copilot Workspaces

To run your own instance of ArgClinic using Codespaces or Copilot Workspaces, follow these steps:

1. **Fork the Repository**: Start by forking the ArgClinic repository to your own GitHub account.

2. **Open in Codespaces or Copilot Workspaces**: Navigate to your forked repository and click on the "Code" button. Select "Open with Codespaces" or "Open with Copilot Workspaces".

3. **Set Environment Variables**: You will need to set the following environment variables to run the application:
   - `AI_ENGINE_ENDPOINT`: The endpoint for the AI engine.
   - `CONTEXT_TYPE`: The context type for the AI engine (e.g., "debate").
   - `CERTAINTY_THRESHOLD`: The certainty threshold for argument validation.

   You can set these environment variables in the `.env` file in the root of the project. Here is an example of what the `.env` file might look like:

   ```
   AI_ENGINE_ENDPOINT=http://localhost:3000/api/ai
   CONTEXT_TYPE=debate
   CERTAINTY_THRESHOLD=0.75
   ```

4. **Run the Application**: Once the environment variables are set, you can run the application using the following command:

   ```
   npm run dev
   ```

   This will start the development server and you can access the application at `http://localhost:3000`.

5. **Debugging**: You can use the built-in debugging tools in Codespaces or Copilot Workspaces to debug the application. The repository includes a `.vscode/launch.json` file with configurations for debugging the Next.js application and the AI argument parser.

6. **Contributing**: If you make improvements or fixes, consider contributing back to the main repository by opening a pull request.

### Selecting and Defaulting to Current Topics

The data model has been expanded to support the current selected topic and select that by default for each format. The `data/topics.json` file now includes fields for `currentTopic` and `defaultTopic` for each format. The `src/pages/index.tsx` file allows users to select a current topic and defaults to the current topic for each format. The `src/pages/api/parse-argument.ts` file handles logic related to the current selected topic and default selection for each format.

### Reviewing Structure of data.json for Use in Topics

The structure of `data.json` has been reviewed for use in topics. The `data/topics.json` file now includes the necessary fields to support the current selected topic and default selection for each format.

### Example Structure of `data/topics.json`

```json
{
  "policy": {
    "currentTopic": "The United States federal government should significantly strengthen its protection of domestic intellectual property rights in copyrights, patents, and/or trademarks.",
    "defaultTopic": "The United States federal government should significantly strengthen its protection of domestic intellectual property rights in copyrights, patents, and/or trademarks.",
    "topics": [
      {
        "topic": "The United States federal government should significantly strengthen its protection of domestic intellectual property rights in copyrights, patents, and/or trademarks.",
        "start_date": "2024-09-01",
        "end_date": "2025-05-31",
        "selected": true,
        "slug": "usfg-ipr-protection",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      }
    ]
  },
  "ld": {
    "currentTopic": "The United States ought to adopt a wealth tax.",
    "defaultTopic": "The United States ought to substantially increase incentives for nuclear power production.",
    "topics": [
      {
        "topic": "The United States ought to substantially increase incentives for nuclear power production.",
        "start_date": "2024-11-01",
        "end_date": "2024-12-31",
        "selected": false,
        "slug": "us-nuclear-incentives",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States ought to adopt a wealth tax.",
        "start_date": "2024-11-01",
        "end_date": "2024-12-31",
        "selected": true,
        "slug": "us-wealth-tax",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The Commonwealth of Australia ought to establish an Indigenous Voice to Parliament.",
        "start_date": "2024-11-01",
        "end_date": "2024-12-31",
        "selected": false,
        "slug": "australia-indigenous-voice",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States ought to formally recognize one or more of the following: Iraqi Kurdistan, the Republic of China, the Republic of Somaliland.",
        "start_date": "2025-01-01",
        "end_date": "2025-02-28",
        "selected": false,
        "slug": "us-recognition",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States ought to remove all or nearly all of its economic sanctions on one or more of the following: Islamic Republic of Iran, Democratic People’s Republic of Korea, Bolivarian Republic of Venezuela.",
        "start_date": "2025-01-01",
        "end_date": "2025-02-28",
        "selected": false,
        "slug": "us-sanctions-removal",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States ought to become party to the United Nations Convention on the Law of the Sea and/or the Rome Statute of the International Criminal Court.",
        "start_date": "2025-01-01",
        "end_date": "2025-02-28",
        "selected": false,
        "slug": "us-un-conventions",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "Social media ought to be regulated as a public utility.",
        "start_date": "2025-03-01",
        "end_date": "2025-04-30",
        "selected": false,
        "slug": "social-media-regulation",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The development of Artificial General Intelligence is immoral.",
        "start_date": "2025-03-01",
        "end_date": "2025-04-30",
        "selected": false,
        "slug": "agi-immorality",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States ought to ban non-therapeutic human genetic engineering.",
        "start_date": "2025-03-01",
        "end_date": "2025-04-30",
        "selected": false,
        "slug": "us-genetic-engineering-ban",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "Violent revolution is a just response to political oppression.",
        "start_date": "2025-05-01",
        "end_date": "2025-05-31",
        "selected": false,
        "slug": "violent-revolution",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "A just society ought to prefer social ownership to private ownership.",
        "start_date": "2025-05-01",
        "end_date": "2025-05-31",
        "selected": false,
        "slug": "social-ownership",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States ought to enact electoral reform that replaces the plurality voting system in federal elections.",
        "start_date": "2025-05-01",
        "end_date": "2025-05-31",
        "selected": false,
        "slug": "us-electoral-reform",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      }
    ]
  },
  "pf": {
    "currentTopic": "The United States should substantially reduce its military support of Taiwan.",
    "defaultTopic": "The United States federal government should substantially expand its surveillance infrastructure along its southern border.",
    "topics": [
      {
        "topic": "The United States federal government should substantially expand its surveillance infrastructure along its southern border.",
        "start_date": "2024-09-01",
        "end_date": "2024-10-31",
        "selected": true,
        "slug": "usfg-surveillance",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United Mexican States should substantially increase private sector participation in its energy industry.",
        "start_date": "2024-09-01",
        "end_date": "2024-10-31",
        "selected": false,
        "slug": "mexico-energy-participation",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States should substantially reduce its military support of Taiwan.",
        "start_date": "2024-11-01",
        "end_date": "2024-12-31",
        "selected": true,
        "slug": "us-taiwan-military-support",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States federal government should eliminate its intercontinental ballistic missiles.",
        "start_date": "2024-11-01",
        "end_date": "2024-12-31",
        "selected": false,
        "slug": "usfg-icbm-elimination",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The East African Community Partner States should establish the East African Federation.",
        "start_date": "2025-01-01",
        "end_date": "2025-01-31",
        "selected": false,
        "slug": "east-african-federation",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The African Union should grant diplomatic recognition to the Republic of Somaliland as an independent state.",
        "start_date": "2025-01-01",
        "end_date": "2025-01-31",
        "selected": false,
        "slug": "somaliland-recognition",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States should accede to the Rome Statute of the International Criminal Court.",
        "start_date": "2025-02-01",
        "end_date": "2025-02-28",
        "selected": false,
        "slug": "us-rome-statute",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "International financial institutions should cancel all outstanding public debt from fossil fuel projects in low- and middle-income countries (LIMC).",
        "start_date": "2025-02-01",
        "end_date": "2025-02-28",
        "selected": false,
        "slug": "fossil-fuel-debt-cancellation",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "In the United States, the benefits of the use of generative artificial intelligence in education outweigh the harms.",
        "start_date": "2025-03-01",
        "end_date": "2025-03-31",
        "selected": false,
        "slug": "ai-education-benefits",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States federal government should ban corporate acquisition of single-family residences.",
        "start_date": "2025-03-01",
        "end_date": "2025-03-31",
        "selected": false,
        "slug": "usfg-corporate-housing-ban",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States federal government should eliminate its agricultural subsidies for domestic corn production.",
        "start_date": "2025-04-01",
        "end_date": "2025-04-30",
        "selected": false,
        "slug": "usfg-corn-subsidies",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "The United States federal government should substantially increase its investment in domestic nuclear energy.",
        "start_date": "2025-04-01",
        "end_date": "2025-04-30",
        "selected": false,
        "slug": "usfg-nuclear-investment",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      },
      {
        "topic": "Potential topics will be available in April 2025.",
        "start_date": "2025-05-01",
        "end_date": "2025-05-31",
        "selected": false,
        "slug": "potential-topics-april-2025",
        "aff_prompt": "Provide the strongest initial or additional arguments on Affirmative (Aff) for this topic.",
        "neg_prompt": "Provide the strongest initial or additional arguments on Negative (Neg) for this topic."
      }
    ]
  }
}
```

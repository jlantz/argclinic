# 🎯 ArgClinic

An open-source platform for debate argument crafting, analysis, and collaboration.

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


# 📝 Contribute guide

This project is structured as a **monorepo** using [NX](https://nx.dev/). It was created to simplify the organization and development of multiple modules in an integrated way, making it ideal for scalability and maintainability.

## 🧭 Table of Contents

- [✅ Requirements](#-requirements)
- [🚀 Installation](#-installation)
- [📦 Project Structure](#-project-structure)
- [🧬 Branch Strategy](#-branch-strategy)
- [🧩 How to Create Your Branch](#-how-to-create-your-branch)
- [✅ Pull Request Rules](#-pull-request-rules)
- [🔜 Future Branches](#-future-branches)

## ✅ Requirements

- **Node.js** version `20` or higher  
- **NVM** (Node Version Manager) is recommended for managing Node versions (optional)

> 💡 If you're using `nvm`, just run:
>
> ```bash
> nvm use
> ```
>
> This will automatically select the ideal Node version defined in the `.nvmrc` file.

## 🚀 Installation

To install and run the project locally, follow the steps below:

1. Clone the repository:
   ```bash
   git clone https://github.com/zard-ui/zardui.git
   cd zardui
    
2.  Install the dependencies:
    
    ```bash
    npm install
    
    
    ```
    
3.  Start the project:
    
    ```bash
    npm start
    
    
    ```
    
4.  Open the app in your browser, The project runs by default at:
    
    ```bash
    <http://localhost:4200>
    ```
    

<h2>📦 Project Structure</h2>

This monorepo is divided into two main modules:

### 1. `web`

This module hosts the **official documentation website**. Here, you can view components in real time, navigate between pages, and understand how everything was built.

### 2. `lib`

This module contains the **Zard UI components**, which are also reused on the documentation site. It will be continuously expanded as new components are created.

> 🧩 Every time a new component is added, the documentation site (`web`) will be updated to use it—ensuring live and integrated documentation that reflects the source library.

<h2>🧬 Branch Strategy</h2>

This project follows the **Trunk Based Development** model, where all developers collaborate on a single main branch (_trunk_) and work with short-lived feature branches.

<h3>🌲 Main Branches</h3>

Atualmente, temos **duas branches principais**:

### `master` – Production

-   This is considered the **production** branch.
-   Only the **project founder** has direct access to it.
-   Updates are made **exclusively through pull requests** from the `alpha` branch.
-   Protected by branch rules (no direct commits allowed).

### `alpha` – Development

-   Our **development** environment branch.
-   Deployed at: [`https://dev.zardui.com/`](https://dev.zardui.com/)
-   All changes are tested here before being promoted to `master`.
-   Also protected by branch rules.

> 🧪 The `alpha` branch is used for testing and validation before going live.

## 🧩 How to Create Your Branch

If you're going to work on an issue, follow this process:

1.  **Assign the issue to yourself** on GitHub to avoid duplication.
    
2.  Create your branch from the `alpha` branch.
    
3.  Use the following naming convention:
```bash
feat/#<issueNumber>-<issueName>
```
Example:
```bash
feat/#42-button-component
```


## ✅ Pull Request Rules

-   Pull requests to `alpha` can only be approved by **maintainers** or the **project founder**.
-   Once approved, an **automatic deployment pipeline** is triggered, publishing the changes to the dev environment.

## 🔜 Future Branches

-   After the **official release**, a `develop` branch will be created.
-   Later on, **release branches** will be added as the project evolves.

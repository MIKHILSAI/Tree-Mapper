# Tree Mapper (BFHL Challenge)

A full-stack application designed to parse, process, and visualize hierarchical node-edge data. It features a robust Node.js/Express backend API for graph computation (tree building, duplicate detection, cycle detection) and a dynamic, responsive single-page frontend.

## Features

- **Edge Parsing & Validation**: Validates string pairs formatted as `A->B` representing directed edges.
- **Cycle Detection**: Implements Depth-First Search (DFS) to identify and safely handle cyclic dependencies 
(e.g., A->B->A).
- **Tree Construction**: Groups edges into connected components, identifies root nodes, and dynamically builds hierarchical tree structures.
- **Duplicate Handling**: Identifies duplicate edges within the input data.
- **Dynamic Visualization**: Renders an interactive, collapsible tree view of the parsed hierarchies on the frontend.
- **Raw JSON Viewer**: Includes a developer-friendly raw payload viewer to inspect the exact API response.

## Tech Stack

- **Backend**: Node.js, Express.js, CORS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: FontAwesome 6

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (Node Package Manager)

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd bfhl-fullstack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   node start.js
   ```

   *This will concurrently start:*
   - **Frontend UI**: `http://localhost:3001`
   - **Backend API**: `http://localhost:3000`

## API Documentation

### Endpoint
`POST /bfhl`

### Request Payload
Accepts a JSON payload with an array of strings representing edges.
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response Output
Returns a structured JSON response identifying users, hierarchies, errors, and statistics.
```json
{
  "user_id": "MIKHILSAI",
  "email_id": "nmikhilsai@gmail.com",
  "college_roll_number": "RA2311003020010",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "B": {
          "D": {}
        },
        "C": {}
      },
      "depth": 3,
      "has_cycle": false
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Project Structure

```
bfhl-fullstack/
├── backend/
│   └── server.js      # Express API server & graph computation logic
├── frontend/
│   └── index.html     # Single-page UI and DOM manipulation
├── start.js           # Concurrent startup script
└── package.json       # Dependencies (express, cors)
```

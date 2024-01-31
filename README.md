# Confluence API Page Creation Script

This Node.js script utilizes the `node-fetch` module to create a new page in Confluence using the Confluence REST API.

## Prerequisites

Before running the script, make sure to install the required Node.js module:

```bash
npm install node-fetch
```

## Usage

1. Clone or download the script.
2. Install dependencies:

```bash
npm install
```

3. Replace the placeholder values in the script with your Confluence API endpoint, username, password, and desired page details.

4. Run the script:

```bash
node index.js
```

## Script Details

- **Script File**: `index.js`
- **Dependencies**:
  - `node-fetch`: Used for making HTTP requests to the Confluence API.

## Configuration

Update the following variables in the script with your Confluence API details:

- `url`: Confluence API endpoint for creating pages.
- `username`: Your Confluence username.
- `password`: Your Confluence API token.
- `data`: Page details, such as spaceId, status, title, parentId, body, etc.
- `headers`: Request headers, including Authorization with Basic authentication.

## Example

Here's an example script usage for creating a new Confluence page:
- change the file name in the script
- run the script with the following command:

```bash
node index.js
```

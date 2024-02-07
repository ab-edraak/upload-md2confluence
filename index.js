import fetch from 'node-fetch';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import md2c from '@shogobg/markdown2confluence';
import dotenv from 'dotenv';
dotenv.config();

// Function to get space ID from space key
const getSpaceIdFromSpaceKey = (spaceKey) => {
  // Implement your logic to fetch space ID from space key
};

// Function to retrieve Confluence data from Markdown content
const getConfluenceData = (markdownContent) => {
  const content = matter(markdownContent).content;
  return md2c(content);
};

// Function to fetch Confluence page by title and space ID
const fetchConfluencePage = async (url, spaceId, title, headers) => {
  const queryParams = { 'space-id': spaceId, title };
  const queryString = new URLSearchParams(queryParams).toString();
  const urlWithParams = `${url}?${queryString}`;
  const requestOptions = {
    method: 'GET',
    headers,
  };
  const response = await fetch(urlWithParams, requestOptions);
  const result = await response.json();
  return result;
};

// Function to update Confluence page
const updateConfluencePage = async (url, id, version, data, headers) => {
  const updateUrl = `${url}/${id}`;
  version.number++;
  const updateData = { ...data, id, version };
  const updateRequestOptions = {
    method: 'PUT',
    headers,
    body: JSON.stringify(updateData),
  };
  const response = await fetch(updateUrl, updateRequestOptions);
  const result = await response.json();
  return result;
};

// Main function to handle Confluence update
const upload = async () => {
  const token = process.env.token;
  const defaultSpaceId = process.env.default_space_id;
  const defaultSpaceKey = process.env.default_space_key;
  const url = process.env.url;
  const email = process.env.email;
  const markdownFilePath = process.env.CONFLUENCE_FILE_PATH;

  // Read Markdown file content
  const markdownFileContent = fs.readFileSync(markdownFilePath, 'utf8');

  // Parse front matter
  const frontMatter = matter(markdownFileContent).data;
  let spaceId = frontMatter.spaceId;
  if (frontMatter.spaceKey && !spaceId) {
    spaceId = getSpaceIdFromSpaceKey(frontMatter.spaceKey);
  } else {
    spaceId = defaultSpaceId;
  }

  // Prepare Confluence data
  const confluenceData = getConfluenceData(markdownFileContent);

  // Prepare request options for creating or updating Confluence page
  const data = {
    spaceId,
    status: frontMatter.status || 'current',
    title: frontMatter.title || path.basename(markdownFilePath),
    parentId: frontMatter.parentId || null,
    body: {
      representation: 'wiki',
      value: confluenceData,
    },
  };
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64'),
  };

  // Create or update Confluence page
  try {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
    const result = await response.json();
    if (result.errors && result.errors[0].status == 400) {
      // If page already exists, update it
      const existingPage = await fetchConfluencePage(url, spaceId, data.title, headers);
      if (existingPage.results && existingPage.results.length > 0) {
        const { id, version } = existingPage.results[0];
        const updateResult = await updateConfluencePage(url, id, version, data, headers);
        console.log(updateResult);
      }
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the main function
upload();

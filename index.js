import fetch from 'node-fetch';
import matter from 'gray-matter';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const token = process.env.token;
const defaultSpaceKey = process.env.default_space_key
const defaultSpaceId = process.env.default_space_id

const url = process.env.url;
const email = process.env.email
// Read your Markdown file
const markdownFilePath = './test.md';
const markdownFileContent = fs.readFileSync(markdownFilePath, 'utf8');

// Parse front matter using gray-matter
const frontMatter = matter(markdownFileContent).data;
let spaceId = frontMatter.spaceId
if (frontMatter.spaceKey && !spaceId) {
  spaceId = getSpaceIdFromSpaceKey(frontMatter.spaceKey)
} else spaceId = defaultSpaceId


const data = {
  spaceId: spaceId,
  status: frontMatter.status || 'current',
  title: frontMatter.title || 'title',
  parentId: frontMatter.parentId || null,
  body: {
    representation: 'storage',
    value: matter(markdownFileContent).content, // Use the content without front matter
  },
};

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64'),
};

const requestOptions = {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data),
};

fetch(url, requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error);
  });

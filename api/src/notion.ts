import { Client } from "@notionhq/client"
const { NotionToMarkdown } = require("notion-to-md");

const NOTION_BASE_URL = "https://www.notion.so";
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const n2m = new NotionToMarkdown({ notionClient: notion });

n2m.setCustomTransformer("table_of_contents", async (_: any) => {
  return "## Table of contents";
});

// replace with long-lived url
//n2m.setCustomTransformer("image", async (block: any) => {
//  let blockContent = block.image;
  
//  const image_type = blockContent.type;
//  let link = "";
//  if (image_type === "external") {
//    link = blockContent.external.url;
//  }
//  if (image_type === "file") {
//    link = blockContent.file.url;
//  }

//  if (link.startsWith("https://s3")) {
//    link = link.replace("X-Amz-Expires=3600", "X-Amz-Expires=604800");
//  } else if (link.startsWith("/image")) {
//    link = `${NOTION_BASE_URL}${link}`
//  }

//  if (blockContent?.external?.url)
//  {
//    blockContent.external.url = link;
//  }
//  if (blockContent?.file?.url)
//  {
//    blockContent.file.url = link;
//  }
//  return false;
//});

export {
  notion,
  n2m
}
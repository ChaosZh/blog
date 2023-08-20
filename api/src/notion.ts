import { CreateCopyToBlobTask } from "./blob";
import { Client } from "@notionhq/client";
const { v4: uuidv4 } = require("uuid"); 
const { NotionToMarkdown } = require("notion-to-md");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

n2m.setCustomTransformer("table_of_contents", async (_: any) => {
  return "## Table of contents";
});

const copyToBlobTasks: Promise<any>[] = [];
n2m.setCustomTransformer("image", async (block: any) => {
  let blockContent = block.image;

  const image_type = blockContent.type;
  let link = "";
  if (image_type === "file") {
    link = blockContent.file.url;
  }

  if (link.startsWith("https://s3")) {
    let blobName = uuidv4();
    let matches = /\/([^/?]+\/[^/?]+)\?/.exec(link)
    if (matches && matches[1]) {
      blobName = matches[1];
    }
    let [blobLink, task] = CreateCopyToBlobTask(blobName, link);
    link = blobLink;
    copyToBlobTasks.push(task);
  }

  if (blockContent?.file?.url)
  {
    blockContent.file.url = link;
  }
  return false;
});

export {
  notion,
  n2m,
  copyToBlobTasks
}
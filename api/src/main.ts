import { Page } from "./model"
import { Client } from "@notionhq/client"
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
const { NotionToMarkdown } = require("notion-to-md");
import * as fs from 'fs';

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: notion });
const databaseId = process.env.NOTION_DATABASE_ID

async function FetchPages(): Promise<Page[]> {
  let raw_notion_db = await notion.databases.query({
    database_id: databaseId!,
  });

  var pages = raw_notion_db.results.map(_ => {
    let item = _ as PageObjectResponse;

    let id = item.id;
    let createdTime = item.created_time;
    let lastEditTime = item.last_edited_time;
    let category = (item.properties as any)?.Category?.select?.name as string;
    let title = (item.properties as any)?.Notebook?.title?.[0]?.plain_text as string;
    let status = (item.properties as any)?.Status?.select?.name as string;

    return new Page(id, title, category, createdTime, lastEditTime, status)
  });

  return pages;
}

const cacheDir = "./cache";
async function PersistPages(pages: Page[]) {
  // remove cached pages that doesn't exist anymore
  if (fs.existsSync(cacheDir))
  {
    let existings = fs.readdirSync(cacheDir);
    for (let existing of existings)
    {
      if (!pages.find(_ => _.Id == existing))
      {
        fs.rmSync(existing, { recursive: true, force: true });
      }
    }
  }

  // update cached pages according to last_edit_time
  let tasks: Promise<void>[] = [];
  for (let page of pages)
  {
    tasks.push(PersistSinglePage(page));
  }
  for (let task of tasks)
  {
    await task;
  }
}

async function PersistSinglePage(page: Page): Promise<void>{
  try {
    console.log(`[${page.Id}] Start to persist page.`);
    // only update when expired
    if (fs.existsSync(`${cacheDir}/${page.getManifestFilePath()}`))
    {
      let manifest = JSON.parse(
        fs.readFileSync(`${cacheDir}/${page.getManifestFilePath()}`)
        .toString()) as Page;
      if (manifest.LastModifiedTime == page.LastModifiedTime)
      {
        console.log(`[${page.Id}] Skip persisting since it is up-to-date.`);
        return;
      }
    }
  
    // ensure directory
    fs.mkdirSync(`${cacheDir}/${page.Id}`, { recursive: true });
  
    // update manifest.json
    fs.writeFileSync(`${cacheDir}/${page.getManifestFilePath()}`, JSON.stringify(page));
  
    // update content.md
    let mdblocks = await n2m.pageToMarkdown(page.Id);
    let mdString = n2m.toMarkdownString(mdblocks);
    fs.writeFileSync(`${cacheDir}/${page.getMarkdownFilePath()}`, mdString.parent);

    console.log(`[${page.Id}] Finish persisting page.`);
  } catch (err) {
    console.log(`[${page.Id}] Failed to persist page, err: ${err}`)
  }
}

async function main() {
  var pages = await FetchPages();
  await PersistPages(pages);
}

main()
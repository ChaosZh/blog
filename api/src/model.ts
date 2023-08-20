const pinyin = require('pinyin');

export class Page {
  Id: string;
  Title: string;
  Category: string;
  CreatedTime: string;
  LastModifiedTime: string;
  Status: string;
  Description: string;

  constructor(id: string, title: string, category: string, createdTime: string, lastModifiedTime: string, status: string, description: string) {
    this.Id = id;
    this.Title = title;
    this.Category = category;
    this.CreatedTime = createdTime;
    this.LastModifiedTime = lastModifiedTime;
    this.Status = status;
    this.Description = description;
  }

  getManifestFilePath(): string {
    return `${this.Id}/manifest.json`;  
  }

  getMarkdownFilePath(): string {
    return `${this.Id}/${this.getSlug()}.md`;
  }

  getSlug(): string {
    let slug = this.Title;

    const containsChinese = /[一-龥]/.test(slug);

    if (containsChinese) {
      // Convert Chinese characters to Pinyin
      slug = pinyin.pinyin(this.Title, {
        style: "normal", // You can choose the Pinyin style you prefer
      }).join(' ');
    }
    // Convert to lowercase
    slug = slug.toLowerCase();
    // Remove special characters and spaces, replace with hyphens
    slug = slug.replace(/[^a-z0-9-]/g, '-');
    // Remove leading and trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');
    // Remove consecutive hyphens
    slug = slug.replace(/-+/g, '-');
    return slug;
  }

  getAstroHeader(): string
  {
    return `---
author: Chao Zheng
pubDatetime: ${this.LastModifiedTime}
title: "${this.Title}"
postSlug: "${this.getSlug()}"
featured: false
draft: ${this.Status == "Done" ? "false" : "true"}
tags:
- "${this.Category}"
ogImage: ""
description: "${this.Description}"
---`
  }
}
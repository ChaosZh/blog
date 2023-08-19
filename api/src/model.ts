export class Page {
  Id: string;
  Title: string;
  Category: string;
  CreatedTime: string;
  LastModifiedTime: string;
  Status: string;

  constructor(id: string, title: string, category: string, createdTime: string, lastModifiedTime: string, status: string) {
    this.Id = id;
    this.Title = title;
    this.Category = category;
    this.CreatedTime = createdTime;
    this.LastModifiedTime = lastModifiedTime;
    this.Status = status;
  }

  getManifestFilePath() {
    return `${this.Id}/manifest.json`;  
  }

  getMarkdownFilePath() {
    return `${this.Id}/content.md`;
  }
}
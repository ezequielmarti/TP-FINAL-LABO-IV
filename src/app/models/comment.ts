export class Comment {

    key: string;
    userId: string;
    newsId: string;
    timestamp: number;
    content: string;

    constructor(userId: string, newsId: string, timestamp: number, content: string, key?: string){
        this.key = key || '';
        this.userId = userId;
        this.newsId = newsId;
        this.timestamp = timestamp;
        this.content = content;
    }
}

export class News {
    id: number;
    title: string;
    snippet: string;
    publisher: string;
    url: string;
    imageUrl: string;
    timestamp: number;
    category: string;
    visible: boolean;
    likes: number[];

    
    constructor(id: number, title: string, snippet:string, publisher: string, url: string,
        imageUrl: string, timestamp: number, category: string, visible:boolean, likes: number[]){
            this.id= id;
            this.title = title;
            this.snippet= snippet;
            this.publisher = publisher;
            this.url = url;
            this.imageUrl = imageUrl;
            this.timestamp = timestamp;
            this.category = category
            this.visible = visible;
            this.likes = likes;
    }
    
}


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
    likes: string[];
    key: string;

    
    constructor(id: number, title: string, snippet:string, publisher: string, url: string,
        imageUrl: string, timestamp: number, category: string, visible:boolean, likes?: string[], key?: string){
            this.id= id;
            this.title = title;
            this.snippet= snippet;
            this.publisher = publisher;
            this.url = url;
            this.imageUrl = imageUrl;
            this.timestamp = timestamp;
            this.category = category
            this.visible = visible;
            this.likes = likes || new Array<string>;
            this.key= key || '';
    }
    
    like(id: string){
        if(!this.likes.includes(id)){
            this.likes.push(id);
            return true;
        }else{
            const index = this.likes.indexOf(id);
            if (index !== -1) {
                this.likes.splice(index, 1);  // Elimina el like por id
            }
            return false;
        }
    }

    likeLength(){
        return this.likes.length || 0;
    }

    setLikes(){
        this.likes = new Array<string>;
    }
}

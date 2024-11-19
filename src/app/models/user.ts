
export class User {
    userName: string;
    subscription: boolean;
    likes: string[];
    key: string;
    active: boolean;
    email: string;
    
    constructor(userName: string, email: string, key: string, subscription?: boolean) {
        this.userName = userName;
        this.subscription = subscription || false;
        this.likes = [];
        this.key = key;
        this.active = true;
        this.email = email;
    }

    like(id: string){
        if(!this.likes.includes(id)){
            this.likes.push(id);
        }
    }
}

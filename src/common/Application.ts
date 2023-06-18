import express, {Express} from "express";

export class Application {
    private app: Express;
    
    public constructor() {
        this.app = express();
    }    

    public listen(port: number): void {
        
    }
}
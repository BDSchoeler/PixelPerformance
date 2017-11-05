import { Inventory } from "./inventory";
import {dbconnection} from "./dbconnection";

var db = new dbconnection().getDBConnector();
export class Cart {
    //This class will have an array of inventory objects, an id, and a userId.
    private id: string;
    private userId: string;
    private inventory: Inventory[] = new Array<Inventory>();

    constructor(newId: string, newUserId: string) {
        this.id = newId;
        this.userId = newUserId;
    }
    public getId(): string {return this.id;}
    public setId(newId: string):void {this.id = newId;}

    public getUserId(): string {return this.userId;}
    public setUserId(newUserId: string):void {this.userId = newUserId;}

    public setInventory(inv: Inventory[]):void{ this.inventory  = inv;}
    public getInventory(): Inventory[]{ return this.inventory;}

    /*******************************************************
     * Method to return all carts saved in the database
     *******************************************************/
    private static async findAllPurchased(): Promise<Cart[]>{
        return db.many('SELECT * FROM cart;')
            .then(function(rows) {
                let carts: Cart[] = new Array<Cart>();
                for(let i=0; i < rows.length; i++) {
                    carts.push(new Cart(rows[i].id, rows[i].client_id));
                }
                return carts;
            }).catch(function (err) {
                console.log("There was an error retrieving all carts: " + err);
                return null;
            });
    }

    /********************************************************
     * Function to load all carts with previous purchases
     *********************************************************/
    public static async findAllRecords(): Promise<Cart[]>{
        let savedInventories: { [key: string]: Inventory[]} = {};
        let savedCarts: Cart[] = [];
        let dataPromises = new Array();

        //find all previously purchased carts
        dataPromises.push(Cart.findAllPurchased())
        dataPromises[0].then((data) => {
            for(let i=0; i< data.length; i++){
                savedCarts.push(data[i]);
            }
        });

        //find all previously purchased inventories
        dataPromises.push(Inventory.findAllPurchased());
        dataPromises[1].then( (data) => {
            for (let cartid in data){
                savedInventories[cartid] = data[cartid];
            }
        });

        return Promise.all(dataPromises).then(() => {
            for (let i = 0; i < savedCarts.length; i++) {
                savedCarts[i].setInventory(savedInventories[savedCarts[i].getId()]);
            }
            return savedCarts;
        }).catch( function (err) {
            console.log("Loading previously saved carts could not be completed.");
            return null;
        });
    }
}
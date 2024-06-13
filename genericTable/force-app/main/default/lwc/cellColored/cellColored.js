import { LightningElement,api } from 'lwc';

export default class CellColored extends LightningElement {
    @api value;
    @api txtColor;

    get css(){
        return 'color:'+this.txtColor;
    }

}
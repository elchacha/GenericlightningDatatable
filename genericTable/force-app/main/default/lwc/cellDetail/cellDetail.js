import { LightningElement ,api} from 'lwc';

export default class CellDetail extends LightningElement {

    @api eventName;
    @api info;
    @api value;

    callAction(){
        this.dispatchEvent(new CustomEvent(this.eventName, { bubbles: true , composed : true, detail: this.info }));
    }

    get css(){
        return '--sds-c-icon-color-foreground-default: '+this.info.color;
    }


}
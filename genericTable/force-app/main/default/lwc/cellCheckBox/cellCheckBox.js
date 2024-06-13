import { LightningElement ,api} from 'lwc';

export default class CellCheckBox extends LightningElement {
    @api value;
    @api recordId;
    @api selected;
    @api eventName;

    callAction(event){
        console.log('about to launch event : '+this.eventNam);
        this.dispatchEvent(new CustomEvent(this.eventName, { bubbles: true , composed : true, detail: {selected : event.target.checked,id:this.recordId} }));
        console.log('about to launch event');
    }

}
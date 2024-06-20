import { LightningElement,track,api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getData';
import { NavigationMixin } from 'lightning/navigation';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import tableScreenFlowModal from 'c/tableScreenFlowModal';


export default class DggnTableUsage extends NavigationMixin(LightningElement) {
//    static shadowSupportMode = 'native';

    @track result=[];
    @track columns=[];
    // define the number of row to display by default. Infinite scrolling will retrieve the next result
    @api rowLimit =10;
    // monitor the index to use when fetching records
    rowOffset = 0;
    sortedBy;
    sortedDirection;
    isLoading = true;
    continueSearching=true;
    inputVariables;


    /*
       Declare here all the event that should be monitored by the controller.
       events are defined during columns configuration
    */
    connectedCallback() {
        this.template.addEventListener("action", (evt) => {
            this.callAction(evt.detail);
          });
        this.template.addEventListener("iconaction", (evt) => {
            this.callAction(evt.detail.values.Nam);
        });
        this.template.addEventListener("cbselection", (evt) => {
            this.callCbSelection(evt);
        });
        this.template.addEventListener("multiiconevent1", (evt) => {
            this.callMultiIcon(evt);
        });
        this.template.addEventListener("multiiconevent2", (evt) => {
            this.callMultiIcon(evt);
        });
        this.template.addEventListener("multiiconevent3", (evt) => {
            this.callMultiIcon(evt);
        });

        this.template.addEventListener("detail1", (evt) => {
            this.callDetail1(evt);
        });

        

          
        this._getRecords();
        this.handleClick2();
    }






    _getRecords(){
        this.isLoading = true;
        return getContactList({limitSize: this.rowLimit , offset : this.rowOffset,orderBy : this.sortedBy,direction : this.sortedDirection}).then(data => {
            let updatedRecords = [...this.result, ...data];
            this.result=updatedRecords;
            this.isLoading = false;
            if(data.length == this.rowLimit) {
                this.continueSearching=true;
            } else {
                this.continueSearching=false;

            }
        });
    }


    /*
        methods that will be used when a specific event is triggered by a custom cell
    */

    value;          
    // async : we will launch a screenflow through a modal, we need to wait for the result
    // screenFlowName : Api name of the screen flow to launch in modal view
    async  callAction(info){
        const result = await tableScreenFlowModal.open({
            size: 'small',
            description: 'Accessible description of modal\'s purpose',
            content: {title : 'test Title', screenFlowName : 'screenFlowTest' , inputVariables : [{name: 'iVariable1',type: 'String',value: info}]}
        });
        //WARNING :  when retrieving values from the flow, the var name are case sensitive
        this.displayActionCliked(result.flowVariables.ovariable1);
    }
   
    /*
        https://developer.salesforce.com/docs/component-library/bundle/lightning-flow
    */
    handleStatusChange(event) {
        // supported status are : STARTED,PAUSED,FINISHED/FINISHED_SCREEN,ERROR
        if (event.detail.status === "FINISHED_SCREEN") {    
            // do what you want when the flow is finished
        }
    }


    callCbSelection(event){
        console.log('selection ??');
        this.displayActionCliked('cbselection');
    }

    callMultiIcon(event){
        console.log('icon : '+JSON.stringify(event));
        this.displayActionCliked('multiiconevent1');
    }
    callDetail1(event){
        this.displayActionCliked('detail1');
    }


    displayActionCliked(action){
        const evt = new ShowToastEvent({
            title: 'action reçu',
            message: 'action '+action+' a été cliqué',
            variant: 'success',
          });
        this.dispatchEvent(evt);

    }

    /*
        sorting and infinite scrolling method
    */

    onHandleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.rowOffset=0;
        this.result=[];
        this._getRecords();
    }

    loadMoreData(event) {
        if(this.continueSearching){
            this.isLoading = true;
            this.rowOffset = this.rowOffset + this.rowLimit;
            this._getRecords()
                .then(()=> {
                    this.isLoading = false;
                });
        }
    }



    /* You can define your colums definitions here for testing purpse
       It would be wiser to have them store inside a custom object/ custom metadata (TO BE DONE)
    */

    handleClick1(){
        this.columns = [
            { label: 'Id', fieldName: 'Id' ,hideDefaultActions: true, sortable: 'true'},
            { label: 'Account (PArent relation)', fieldName: 'accountName' ,hideDefaultActions: true, sortable: 'false' },
            { label: 'TextColored', fieldName: 'Department', type: 'cellColored', typeAttributes: { cellColor: { fieldName: "textColor" } },hideDefaultActions: true, sortable: 'true'},
            { label: 'detail', fieldName: 'Id', type: 'cellDetail', typeAttributes: { eventname:'detail1',info :{ fieldName: "textIcon" }},hideDefaultActions: true, sortable: 'false'},
        ];
    }

    handleClick2(){
        this.columns = [
            { label: 'Id', fieldName: 'Id' ,hideDefaultActions: true, sortable: 'true' },
            { label: 'Checkbox', fieldName: 'IsEmailBounced' ,type: 'cellCheckBox' ,typeAttributes: { eventname:'cbselection',selected: {fieldName: "IsEmailBounced" },recordid: {fieldName: "Id" }} ,hideDefaultActions: true, sortable: 'true'},
            { label: 'button', fieldName: 'Id', type: 'cellActionButton', typeAttributes: { label: 'monBouton',variant: 'warning',css: '',eventname:'action' },hideDefaultActions: true, sortable: 'false'},

        ];
    }

    handleClick3(){
        this.columns = [
            { label: 'Id', fieldName: 'Id' ,hideDefaultActions: true, sortable: 'true'},
            { label: 'monoIcon', fieldName: 'Id', type: 'cellActionIcon', typeAttributes: { icon: 'utility:edit',size: 'small' ,eventname:'iconaction',info :{ fieldName: "monoIcon" }},hideDefaultActions: true, sortable: 'false'},
           { label: 'multiIcon', fieldName: 'Id', type: 'cellActionIcon', typeAttributes: {info :{ fieldName: "multiIcon" }},hideDefaultActions: true, sortable: 'false'}
        ];
    }



}
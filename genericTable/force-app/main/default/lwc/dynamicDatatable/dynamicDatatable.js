
import LightningDatatable from "lightning/datatable";
import cellColoredTemplate from "./cellColoredTemplate.html";
import cellCheckBoxTemplate from "./cellCheckBoxTemplate.html";
import cellActionIconTemplate from "./cellActionIconTemplate.html";
import cellActionButtonTemplate from "./cellActionButtonTemplate.html";
import cellDetailTemplate from "./cellDetailTemplate.html";


export default class DynamicDatatable extends LightningDatatable {

    static customTypes = {
        cellColored: {
          template: cellColoredTemplate,
          standardCellLayout: true,
          typeAttributes: ["cellColor"],
        },
        cellCheckBox: {
            template: cellCheckBoxTemplate,
            standardCellLayout: true,
            typeAttributes: ["selected","recordid","eventname"],
        },cellActionIcon: {
          template: cellActionIconTemplate,
          standardCellLayout: true,
          typeAttributes: ["icon","color","size","eventname","info"],
        },cellActionButton: {
          template: cellActionButtonTemplate,
          standardCellLayout: true,
          typeAttributes: ["label","variant","eventname","css"],
        },cellDetail: {
          template: cellDetailTemplate,
          standardCellLayout: true,
          typeAttributes: ["eventname","info"],
        }

  

        
    }
}
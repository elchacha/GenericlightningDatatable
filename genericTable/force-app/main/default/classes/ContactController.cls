public with sharing class ContactController {


    public static Map<String,String> sortableFields = new Map<String,String>();
    static{
        sortableFields.put('accountName','Account.Name');
    }

    @AuraEnabled
    public static list<Map<String,Object>> getData(Integer limitSize, Integer offset,String orderBy, String direction)
    {
        String query='SELECT Name,Department ,Email ,Title ,Account.Name ,Account.CreatedDate,IsEmailBounced,CreatedBy.Name  FROM Contact ';

        // WARNING : orderBy doit correspondre à un champs Salesforce sinon la requete ne pourra pas se faire. NE rendre triable que les colonnes portant sur un champs SF dans la v1
        if(!String.isBlank(orderBy)){
            // on doit traduire les champs calculé pour permettre un tri dessus
            if(sortableFields.containsKey(orderBy)){
                orderBy=sortableFields.get(orderBy);
            }
            query+=' ORDER BY '+orderBy+' '+direction.replace('asc','asc NULLS FIRST').replace('desc','desc NULLS LAST');
        }

        if(limitSize!=null){
            query+=' LIMIT '+limitSize;
        }
        if(offset!=null){
            query+=' OFFSET '+offset;
        }


        // let's rebuild the content to diplay
        list<Map<String,Object>> result = new list<Map<String,Object>>();
        for(Contact cont : Database.query(query)){
            // first we want to retrieve all simple fields from the object
            Map<String, Object> record = (Map<String, Object>) JSON.deserializeUntyped(JSON.serialize(cont));
            // let's add a related field             
            record.put('accountName',cont.Account.Name);
            // let's indicate how to sort this column 
            record.put('multiIcon',displayMultiIcon(cont));
            record.put('textColor',chooseColorForStatus(cont));
            record.put('textIcon',DisplayIconText(cont));
            result.add(record);
        }


        return result;
    }


    /*
        build a color content text cell
    */
    private static String chooseColorForStatus(Contact cont){
        switch on cont.Department {
            when  'Finance','Administration' {
                return 'green';
            }
            when  'Operations','Production','Technology' {
                return 'red';
            }
            when else {
                return 'blue';
            }
        }
    }


    /*
        build a cell with multiple icon clickable
    */
    private static List<DynamicDataTable.CellActionIcon> displayMultiIcon(Contact cont){
        List<DynamicDataTable.CellActionIcon> results = new List<DynamicDataTable.CellActionIcon>();
        String color='blue';
        String colorError='blue';
        switch on cont.Department {
            when  'Finance','Administration' {
                color='green';
                colorError='red';
            }
            when  'Operations','Production','Technology' {
                color='red';
                colorError='green';
            }
            when else {
                color='blue';
                colorError='grey';
            }
        }
        results.add(new DynamicDataTable.CellActionIcon('utility:edit','small',cont,'multiiconevent1',color));
        results.add(new DynamicDataTable.CellActionIcon('utility:error','small',cont,'multiiconevent2',colorError));
        results.add(new DynamicDataTable.CellActionIcon('utility:answer','small',cont,'multiiconevent3',color));

        return results;
    }

    /*
        exemple poour afficher le contenu d'une celle de type detail
    */
    private static DynamicDataTable.CellDetail DisplayIconText(Contact cont){
        String color='red';
        String iconName='utility:close';
        String text;
        switch on cont.Department {
            when  'Finance','Administration' {
                color='green';
                iconName='utility:success';
                text=cont.Title;
            }
            when  'Operations','Production','Technology' {
                color='red';
                iconName='utility:info';
                text=cont.Title;
            }
            when else {
                color='blue';
                iconName='utility:info';
                text=cont.Title;
            }
        }
        return new DynamicDataTable.CellDetail(iconName,cont,color,text);
    }

}
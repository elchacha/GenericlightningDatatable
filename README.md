To be reviewed:

The example is running with the contact object.
If you don't have any contacts , create a few one 

Then launch the following script to add some Department to those contacts:

List<String> departments = new List<String>{'Finance','Operations','Production','Administration','Other'};
List<Contact> conts = [select Id from Contact];
for(Contact cont : conts){
	cont.Department=departments[Integer.valueof((Math.random() * 4))];
}
update conts;

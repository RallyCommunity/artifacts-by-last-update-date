Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
        console.log(this.getContext().getProject());
        this.add({
                    xtype: 'component',
                    itemId: 'datepick',
                    html: 'pick a date:',
                    width: 100,
                    margin: 10
                },
                {
                    xtype: 'rallydatepicker',
                    showToday: false,
                    contentEl: Ext.ComponentQuery.query('#datepick')[0],
                    margin: 10,
                    handler: function(picker, date) {
                        this._onDateSelected(date);
                    },
                    scope:this
                },
                {
                    xtype: 'container',
                    itemId: 'gridContainer'
                });
    },
    _onDateSelected:function(date){
        var formattedDate = Rally.util.DateTime.formatWithDefault(date, this.getContext());
        Ext.ComponentQuery.query('#datepick')[0].update((formattedDate) + '<br /> selected');
        if (this.down('rallygrid')) {
            Ext.ComponentQuery.query('#gridContainer')[0].remove(Ext.ComponentQuery.query('#artifactsGrid')[0], true);
        }
        
        this.down('#gridContainer').add({
            xtype: 'rallygrid',
            itemId: 'artifactsGrid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'LastUpdateDate',
                'Project'
            ],
            context: this.getContext(),
            storeConfig: {
                models: ['userstory','defect','task','testcase','portfolioitem'],
                filters:[
                    {
                        property: 'LastUpdateDate',
                        operator: '>',
                        value: Rally.util.DateTime.toIsoString(date,true)
                    }
                ]
            }
        });
    }    
});
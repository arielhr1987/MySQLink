/**
 *
 */
Ext.define('MySQLink.ux.DatabaseDiagram', {
    extend: 'Ext.panel.Panel',//Ext.panel.Panel
    requires: [],
    xtype: 'database-diagram',
    initComponent: function (config) {
        Ext.applyIf(this, {
            host: '',
            db: '',
            name: ''
        });

        config = Ext.apply(this, {
            layout: 'border',
            //border: false,
            //enableHdMenu: true,
//            bodyStyle: {
//                'border-top-width': '0px'
//            },
            items: [{
                region: 'center'
                //title: 'Parameters',
                //xtype:'parameter-grid'
            },{
                region: 'east',
                title: 'Tables',
                width: '25%'
                //xtype:'parameter-grid'
            }]
        });
        this.callParent();
    }
});

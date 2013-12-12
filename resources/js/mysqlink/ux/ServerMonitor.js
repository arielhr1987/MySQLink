/**
 *
 */
Ext.define('ServerMonitor', {
    extend: 'Ext.panel.Panel',
    requires: [],
    xtype: 'server-monitor',
    /*tbar: [
        { xtype: 'button', text: 'Button 1' }
    ],*/
    layout: 'fit',
    items: [
        {
            xtype: 'tabpanel',
            border: false,
            tabPosition: 'bottom',
            defaults:{
                layout:'fit',
                border: false
            },
            items: [
                {
                    title: 'Porcess list',
                    items:[{xtype:'process-list',border:false}]
                },
                {
                    title: 'Variables',
                    items:[{xtype:'server-variables',border:false,url:'Server/variables'}]
                },
                {
                    title: 'Status',
                    items:[{xtype:'server-variables',border:false,url:'Server/status'}]
                },
                {
                    title: 'Engines',
                    items:[{xtype:'engine-grid',border:false,url:'Server/engines'}]
                },
                {
                    title: 'Character set',
                    items:[{xtype:'charset-grid',border:false,url:'Server/charset'}]
                }
            ]
        }
    ],
    initComponent: function () {
        this.callParent();
    }
});
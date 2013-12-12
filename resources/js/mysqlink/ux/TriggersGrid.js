/**
 *
 */
Ext.define('MySQLink.ux.TriggersGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'triggers-grid',
    initComponent: function () {
        this.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: ['name', 'timing', 'event', 'definer'],
            proxy: {
                type: 'ajax',
                url: this.listURL,
                baseParams: {
                    n: 'ahsdfa'
                },
                actionMethods: {
                    read: 'POST'
                }
            }
        });
        this.columns = [
            { text: 'Name', dataIndex: 'name' },
            { text: 'Timing', dataIndex: 'timing' },
            { text: 'Event', dataIndex: 'event' },
            { text: 'Definer', dataIndex: 'definer' }
        ];
        //var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
        Ext.apply(this, {
            border: 0,
            layout: 'fit',
            loadMask: true,
            //plugins: [rowEditing],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            }        });
        this.callParent();
    }
});
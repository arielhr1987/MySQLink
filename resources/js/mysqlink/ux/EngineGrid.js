/**
 *
 */
Ext.define('EngineGrid', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'engine-grid',
    initComponent: function () {
        var model = Ext.define('EngineGridModel', {
            extend: 'Ext.data.Model',
            fields: ['Engine', 'Support', 'Comment', 'Transactions', 'XA', 'Savepoints', 'groupHost']
        });
        var store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            autoSync: true,
            model: 'EngineGridModel',
            groupField: 'groupHost',
            proxy: {
                type: 'ajax',
                pageParam: false, //to remove param "page"
                startParam: false, //to remove param "start"
                limitParam: false, //to remove param "limit"
                noCache: false, //to remove param "_dc"
                actionMethods: {
                    read: 'POST'
                },
                api: {
                    read: "Server/engines"
                }
            }
        });
        Ext.apply(this, {
            store: store,
            loadMask: true,
            forceFit: true,
            tbar: this.createToolbar(),
            features: [
                {
                    ftype: 'grouping',
                    enableGroupingMenu: false,
                    groupHeaderTpl: 'Server: {name}'
                }
            ],
            columns: [
                //{xtype: 'rownumberer'},
                { text: 'Engine', dataIndex: 'Engine' },
                { text: 'Support', dataIndex: 'Support'},
                { text: 'Comment', dataIndex: 'Comment' },
                { text: 'Transactions', dataIndex: 'Transactions' },
                { text: 'XA', dataIndex: 'XA' },
                { text: 'Savepoints', dataIndex: 'Savepoints' }
            ],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            }
        });
        this.callParent();
    },
    createToolbar: function () {
        return[
            {
                text: 'Refresh',
                scope: this,
                iconCls: 'x-tbar-loading',
                handler: function () {
                    this.getStore().reload();
                }
            },'->',{
                xtype: 'search-field-grid',
                emptyText: 'Search engine...',
                grid:this
            }
        ]

    }
});
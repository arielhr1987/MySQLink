/**
 *
 */
Ext.define('ServerVariables', {
    extend: 'Ext.grid.Panel',
    requires: [],
    xtype: 'server-variables',
    initComponent: function (opt) {

        var store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: ['Variable_name'],
            proxy: {
                type: 'ajax',
                pageParam: false, //to remove param "page"
                startParam: false, //to remove param "start"
                limitParam: false, //to remove param "limit"
                noCache: false, //to remove param "_dc"
                actionMethods: {
                    read: 'POST',
                    destroy: 'POST'
                },
                reader: {
                    root: 'rows'
                },
                api: {
                    read: this.url
                }
            },
            listeners: {
                'metachange': {
                    fn: function (store, meta, eOpt) {
                        meta.columns = Ext.Array.insert(meta.columns, 0, [Ext.create('Ext.grid.RowNumberer', {width: 30, maxWidth:30})]);
                        this.reconfigure(store, meta.columns);
                    },
                    scope: this
                }
            }
        });
        Ext.apply(this, {
            store: store,
            loadMask: true,
            forceFit: true,
			//plugins: 'bufferedrenderer',
            tbar : this.createToolbar(),
            columns: [
                { text: 'Variable', dataIndex: 'Variable_name' }
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
				emptyText: 'Search variable...',
				grid:this/*,
				column:1*/
			}
        ]
    }
});